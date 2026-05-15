# Auth, Profile & Database Audit

Issues found after reviewing the current state of authentication, user profiles, and database interactions.

---

## 🔴 Should Fix

### 1. Session Token Persisted in AsyncStorage (Unencrypted)

**File**: `src/stores/userStore.js` (persist config at bottom)

```javascript
partialize: (state) => ({
  user: state.user,
  session: state.session,  // ← Contains access_token and refresh_token
  isAuthenticated: state.isAuthenticated,
  userStats: state.userStats,
}),
```

**Problem**: The full Supabase session (including JWT tokens) is stored in plain AsyncStorage. While Supabase also manages its own session persistence, this duplicate creates a stale token that could be read by other apps on rooted/jailbroken devices.

**Fix**: Remove `session` from the persisted state. Supabase handles session persistence internally. On app start, `initialize()` already calls `supabase.auth.getSession()` which reads Supabase's own secure storage.

```javascript
partialize: (state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  userStats: state.userStats,
}),
```

---

### 2. No Display Name Length Limit or Sanitization

**File**: `src/stores/userStore.js` (signUp) and `src/screens/ProfileScreen.js` (handleUpdateProfile)

**Problem**: Display names are sent directly to the database with no validation beyond "not empty." A user could:
- Enter a 500-character name that breaks the leaderboard UI
- Enter HTML/script tags (less risky in React Native but still bad practice)
- Enter offensive content

**Fix**: Add validation before saving:

```javascript
// In signUp and handleUpdateProfile:
const trimmedName = displayName.trim();
if (trimmedName.length < 2) {
  return { success: false, error: 'Display name must be at least 2 characters.' };
}
if (trimmedName.length > 20) {
  return { success: false, error: 'Display name must be 20 characters or less.' };
}
if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmedName)) {
  return { success: false, error: 'Display name can only contain letters, numbers, spaces, hyphens, and underscores.' };
}
```

---

### 3. Profile Update Doesn't Check Display Name Uniqueness

**File**: `src/screens/ProfileScreen.js` (handleUpdateProfile)

**Problem**: When a user changes their display name in the profile screen, there's no uniqueness check. The sign-up flow checks for duplicates, but the profile update bypasses it. The database constraint will reject it, but the error message will be a generic "Failed to update profile" instead of "name already taken."

**Fix**: Add the same uniqueness check before updating:

```javascript
const { data: existingUser } = await supabase
  .from('whs-users')
  .select('id')
  .ilike('display_name', displayName.trim())
  .neq('id', user.id)  // Exclude current user
  .maybeSingle();

if (existingUser) {
  Alert.alert("Error", "This display name is already taken.");
  return;
}
```

---

### 4. `error` State in Store Blocks App UI

**File**: `App.js` (line ~70) and `src/stores/userStore.js`

```javascript
// App.js
if (initError || error) {
  return <View>... "Oops! Something went wrong" ...</View>;
}
```

**Problem**: If ANY Supabase call sets `error` in the store (network blip, RLS issue, etc.), the entire app shows the error screen with no way to recover except restarting. The `error` state is never cleared automatically.

**Fix**: 
- Don't show the full-app error screen for transient errors
- Only show it for initialization failures
- Clear the error after displaying it to the user
- Or remove `error` from the App.js check entirely:

```javascript
// App.js — only check initError, not store error
if (initError) {
  return <View>... error screen ...</View>;
}
```

---

### 5. No "Forgot Password" Flow

**Problem**: There's no way for users to reset their password from the sign-in screen. If they forget it, they're locked out. Supabase supports password reset emails out of the box.

**Fix**: Add a "Forgot Password?" link on the sign-in dialog that calls:

```javascript
const { error } = await supabase.auth.resetPasswordForEmail(email);
if (!error) {
  Alert.alert("Check Your Email", "We sent a password reset link to your email.");
}
```

---

## 🟠 Should Consider

### 6. No Email Validation Format Check

**File**: `src/screens/StartScreen.js` (handleSignUp, handleSignIn)

**Problem**: The app only checks if email is non-empty. It doesn't validate the format before sending to Supabase. Supabase will reject invalid emails, but the error message might not be user-friendly.

**Fix**: Add a basic regex check:

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  Alert.alert("Error", "Please enter a valid email address");
  return;
}
```

---

### 7. Leaderboard Fetches 1000 Entries Just to Find User's Rank

**File**: `src/stores/userStore.js` (fetchUserStats)

```javascript
const { data: rankData } = await supabase.rpc('get_enhanced_leaderboard', {
  p_year: currentYear,
  p_month: currentMonth,
  p_limit: 1000  // ← Fetches up to 1000 rows just to find one user
});
const userRank = rankData.find(entry => entry.user_id === user.id);
```

**Problem**: Downloads up to 1000 leaderboard entries on every app start just to find the current user's rank. Wasteful on bandwidth and slow.

**Fix**: Create a dedicated RPC function that returns just the user's rank:

```sql
CREATE OR REPLACE FUNCTION get_user_monthly_rank(p_user_id uuid, p_year integer, p_month integer)
RETURNS integer AS $$
  SELECT rank FROM (
    SELECT user_id, ROW_NUMBER() OVER (ORDER BY highest_score DESC) as rank
    FROM "whs-monthly_leaderboards"
    WHERE year = p_year AND month = p_month
  ) ranked WHERE user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

---

### 8. No Rate Limiting on Sign-Up

**Problem**: While Supabase has built-in rate limiting, there's no client-side throttle. A user could spam the sign-up button creating multiple auth entries before the server rate limit kicks in.

**Fix**: Disable the sign-up button while loading (already done with `loading` state), and add a cooldown after failed attempts.

---

### 9. Password Change Verifies by Re-Signing In

**File**: `src/screens/ProfileScreen.js` (handleChangePassword)

```javascript
const { error: signInError } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: currentPassword,
});
```

**Problem**: This creates a new session just to verify the password. It's not wrong, but it's unnecessary — Supabase's `updateUser` will fail if the session is invalid anyway. The real issue is that if the sign-in succeeds but the update fails, you now have a potentially different session.

**Fix**: This is fine for now but could be simplified to just call `updateUser` directly and handle the error.

---

## 🟢 Nice to Have

### 10. No Account Deletion Option

Users can't delete their account. App Store and Google Play both require this for compliance. Add a "Delete Account" button in the profile that:
1. Confirms with the user
2. Calls `supabase.auth.admin.deleteUser()` (requires a server-side function)
3. Clears local state and signs out

### 11. No Session Refresh Handling

If the user's session expires while the app is in the background, the next API call will fail silently. Supabase's `autoRefreshToken: true` handles most cases, but there's no listener for auth state changes that would update the Zustand store.

### 12. Unused Imports in ProfileScreen

`Paragraph`, `Divider`, `RadioButton` group is used but `Paragraph` and `Divider` are imported but unused.
