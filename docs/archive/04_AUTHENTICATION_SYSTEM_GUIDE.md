# Word Hustle 3C - Authentication System Guide

## Overview

Word Hustle 3C uses Firebase Authentication for user management, allowing players to create accounts, sign in, and maintain persistent profiles across devices. This guide explains how the authentication system works and how to work with it.

## Authentication Flow

### 1. User States
- **Unauthenticated**: Guest user, can play but scores aren't saved
- **Authenticated**: Registered user with persistent profile and scores
- **Loading**: Checking authentication status on app startup

### 2. Sign-Up Process
1. User enters email and password
2. System validates email format and password strength
3. Firebase creates account
4. User profile is created with display name
5. User is automatically signed in

### 3. Sign-In Process
1. User enters email and password
2. Firebase validates credentials
3. User profile is loaded
4. User gains access to saved scores and leaderboards

## File Structure

### Core Authentication Files

**`src/auth/AuthContext.js`** - Main authentication context provider
**`src/auth/AuthService.js`** - Authentication utility functions
**`src/auth/EmailPasswordAuth.js`** - Email/password authentication component
**`src/screens/AuthScreen.js`** - Authentication screen UI

### Firebase Configuration

**`src/firebase/initFirebase.js`** - Firebase initialization
**`src/firebase/config.js`** - Firebase service exports

## Authentication Context

### AuthContext Provider

**File**: `src/auth/AuthContext.js`

```javascript
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setUserProfile({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
}
```

### Using Authentication in Components

```javascript
import { useAuth } from '../auth/AuthContext';

function MyComponent() {
  const { currentUser, userProfile, isAuthenticated, signOut } = useAuth();
  
  if (isAuthenticated) {
    return <Text>Welcome, {userProfile.displayName}!</Text>;
  } else {
    return <Text>Please sign in</Text>;
  }
}
```

## Email/Password Authentication

### Sign-Up Implementation

**File**: `src/auth/EmailPasswordAuth.js`

```javascript
const handleSignUp = async () => {
  try {
    // Validate input
    if (!email || !password || !displayName) {
      setError('All fields are required');
      return;
    }

    // Check password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    // Create Firebase account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });

    // Success - user is automatically signed in
    navigation.navigate('Start');
    
  } catch (error) {
    handleAuthError(error);
  }
};
```

### Sign-In Implementation

```javascript
const handleSignIn = async () => {
  try {
    setLoading(true);
    setError('');

    // Sign in with Firebase
    await signInWithEmailAndPassword(auth, email, password);
    
    // Success - navigate to main screen
    navigation.navigate('Start');
    
  } catch (error) {
    handleAuthError(error);
  } finally {
    setLoading(false);
  }
};
```

### Password Validation

**File**: `src/utils/passwordValidator.js`

```javascript
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`,
      strength: 'weak'
    };
  }

  let strength = 'weak';
  let score = 0;

  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;

  if (score >= 3) strength = 'medium';
  if (score >= 4) strength = 'strong';

  return {
    isValid: true,
    message: 'Password is valid',
    strength: strength
  };
};
```

## User Profile Management

### Profile Data Structure

```javascript
const userProfile = {
  uid: "firebase-user-id",
  email: "user@example.com",
  displayName: "Player Name",
  photoURL: null, // Optional profile picture
  createdAt: "2024-01-01T00:00:00Z",
  lastLoginAt: "2024-01-15T12:30:00Z"
};
```

### Updating User Profile

```javascript
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';

const updateUserProfile = async (updates) => {
  try {
    await updateProfile(auth.currentUser, updates);
    
    // Update local state
    setUserProfile(prev => ({
      ...prev,
      ...updates
    }));
    
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
```

## Username System

### Username Validation

**File**: `src/components/UsernameSuggestions.js`

```javascript
const validateUsername = (username) => {
  // Length check
  if (username.length < 3 || username.length > 20) {
    return { isValid: false, message: 'Username must be 3-20 characters' };
  }

  // Character check (alphanumeric and underscores only)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }

  // Profanity check
  if (containsProfanity(username)) {
    return { isValid: false, message: 'Username contains inappropriate content' };
  }

  return { isValid: true, message: 'Username is valid' };
};
```

### Content Moderation

**File**: `src/utils/contentModerator.js`

```javascript
import Filter from 'bad-words';
import { badWordsList } from 'badwords-list';

const filter = new Filter();
filter.addWords(...badWordsList.array);

export const containsProfanity = (text) => {
  return filter.isProfane(text);
};

export const cleanText = (text) => {
  return filter.clean(text);
};
```

## Error Handling

### Firebase Auth Errors

```javascript
const handleAuthError = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      setError('An account with this email already exists');
      break;
    case 'auth/weak-password':
      setError('Password is too weak');
      break;
    case 'auth/invalid-email':
      setError('Invalid email address');
      break;
    case 'auth/user-not-found':
      setError('No account found with this email');
      break;
    case 'auth/wrong-password':
      setError('Incorrect password');
      break;
    case 'auth/too-many-requests':
      setError('Too many failed attempts. Please try again later');
      break;
    default:
      setError('An error occurred. Please try again');
      console.error('Auth error:', error);
  }
};
```

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase and lowercase letters
- Must contain at least one number
- Special characters recommended for strong passwords

### Username Requirements
- 3-20 characters long
- Alphanumeric characters and underscores only
- No profanity or inappropriate content
- Must be unique (checked against existing users)

### Data Protection
- Passwords are hashed by Firebase (never stored in plain text)
- User sessions are managed securely by Firebase
- Automatic token refresh for persistent login

## Integration with Game Features

### Score Persistence

```javascript
// Only authenticated users can save scores
const saveScore = async (score, gameData) => {
  if (!isAuthenticated) {
    console.log('User not authenticated, score not saved');
    return;
  }

  try {
    await submitScore(currentUser.uid, score, gameData);
  } catch (error) {
    console.error('Error saving score:', error);
  }
};
```

### Leaderboard Access

```javascript
// Different leaderboard views for authenticated vs guest users
const getLeaderboardData = async () => {
  if (isAuthenticated) {
    // Show full leaderboard with user's rank
    return await getFullLeaderboard(currentUser.uid);
  } else {
    // Show limited leaderboard, encourage sign-up
    return await getPublicLeaderboard();
  }
};
```

## Testing Authentication

### Manual Testing Checklist

1. **Sign-Up Flow**:
   - Valid email and password creates account
   - Invalid email shows error
   - Weak password shows error
   - Duplicate email shows error

2. **Sign-In Flow**:
   - Valid credentials sign in successfully
   - Invalid credentials show error
   - Account lockout after too many attempts

3. **Profile Management**:
   - Display name updates correctly
   - Profile data persists across app restarts

4. **Username Validation**:
   - Length requirements enforced
   - Character restrictions enforced
   - Profanity filter works

5. **Session Management**:
   - User stays signed in after app restart
   - Sign out works correctly
   - Token refresh happens automatically

### Common Issues and Solutions

**Issue**: User gets signed out unexpectedly
**Solution**: Check Firebase token expiration and refresh logic

**Issue**: Profile updates don't persist
**Solution**: Ensure `updateProfile` is called and local state is updated

**Issue**: Username validation too strict/lenient
**Solution**: Adjust validation rules in `validateUsername` function

**Issue**: Authentication state not updating in UI
**Solution**: Check that components are properly using `useAuth` hook

## Development Tips

### Debugging Authentication

```javascript
// Add logging to track auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', {
      isSignedIn: !!user,
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName
    });
    
    setCurrentUser(user);
  });

  return unsubscribe;
}, []);
```

### Testing with Different User States

```javascript
// Create test accounts for different scenarios
const testAccounts = {
  newUser: { email: 'new@test.com', password: 'TestPass123!' },
  existingUser: { email: 'existing@test.com', password: 'TestPass123!' },
  adminUser: { email: 'admin@test.com', password: 'AdminPass123!' }
};
```

### Environment-Specific Configuration

```javascript
// Different Firebase configs for development/production
const firebaseConfig = {
  // Development config
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY_DEV,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV,
  // ... other config
};
```

---

**For developers**: Always test authentication flows thoroughly, especially error cases. Remember that authentication state changes are asynchronous and components should handle loading states appropriately.
