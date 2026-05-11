# Critical Issues

These must be fixed before any production release.

---

## 1. Hardcoded Supabase Credentials in Source Code

**File**: `src/config/supabase.js` (lines 22-24)  
**Severity**: 🔴 Critical (Security)

```javascript
// Method 3: Hardcoded fallback for production (if EAS env vars fail)
if (!supabaseUrl) {
  supabaseUrl = 'https://mnuduacsnqdrypkzkfzi.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
}
```

**Problem**: The Supabase URL and anon key are committed to source control as a "fallback." While anon keys are designed to be public-facing, hardcoding them:
- Makes key rotation impossible without a code deploy
- Exposes the project URL permanently in git history
- Signals that env var configuration isn't working reliably (the real problem)

**Fix**: 
- Remove the hardcoded fallback entirely
- Fix the EAS environment variable configuration so it works reliably
- If the app can't connect, show a user-friendly error instead of silently using stale credentials
- Add the Supabase URL to `.gitignore` patterns and rotate the key

---

## 2. Password Hash Placeholder Stored in Database

**File**: `src/stores/userStore.js` (line 97)  
**Severity**: 🔴 Critical (Security/Data Integrity)

```javascript
const { error: dbError } = await supabase
  .from('whs-users')
  .insert({
    id: authData.user.id,
    email: authData.user.email,
    display_name: displayName,
    password_hash: 'handled_by_supabase_auth',  // ← This
  });
```

**Problem**: 
- A `password_hash` column exists in the `whs-users` table with a meaningless string value
- This column shouldn't exist at all — Supabase Auth manages passwords internally in `auth.users`
- Having a column named `password_hash` in a public-facing table is confusing and could mislead future developers into thinking they need to manage passwords manually

**Fix**:
- Remove the `password_hash` column from the `whs-users` table schema
- Remove the field from the insert statement
- If the column can't be removed (other code depends on it), at minimum stop inserting a value

---

## 3. No Adjacency Validation in Word Formation

**File**: `src/components/game/LetterGrid.js` (handleTouchMove function)  
**Severity**: 🔴 Critical (Game Logic Bug)

```javascript
// Current code only checks:
if (
  row >= 0 && row < rows &&
  col >= 0 && col < cols &&
  isInsideCenter &&
  !selectedCells.some((cell) => cell.row === row && cell.col === col)
) {
  setSelectedCells((prev) => [...prev, { row, col }]);
}
```

**Problem**: The grid accepts any cell that's within bounds and not already selected. There's no check that the new cell is **adjacent** to the previously selected cell. On fast swipes, a player can "jump" across the grid and form words from non-adjacent letters.

In word games like Boggle (which this is based on), cells must be horizontally, vertically, or diagonally adjacent to the previous cell.

**Fix**: Add adjacency validation:

```javascript
const isAdjacent = (cell1, cell2) => {
  return Math.abs(cell1.row - cell2.row) <= 1 && 
         Math.abs(cell1.col - cell2.col) <= 1;
};

// In handleTouchMove, before adding to selectedCells:
const lastCell = selectedCells[selectedCells.length - 1];
if (selectedCells.length === 0 || isAdjacent(lastCell, { row, col })) {
  setSelectedCells((prev) => [...prev, { row, col }]);
}
```

---

## 4. Navigation Typo — Dead Route Causes Crash

**File**: `src/screens/ProfileScreen.js` (line 283)  
**Severity**: 🔴 Critical (Crash)

```javascript
navigation.navigate('PortuguesGame');  // Missing 'e'
```

**Problem**: The route is registered as `'PortugueseGame'` in App.js but referenced as `'PortuguesGame'` in ProfileScreen. Tapping this button will throw a navigation error and likely crash the app or show a blank screen.

**Fix**: 
```javascript
navigation.navigate('PortugueseGame');
```

---

## 5. Timer Stale Closure Bug

**File**: `src/hooks/useGameLogic.js` (lines 56-78)  
**Severity**: 🔴 Critical (Game Logic Bug)

```javascript
useEffect(() => {
  // ...
  timerRef.current = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1 || gameEndedRef.current) {
        if (!gameEndedRef.current) {
          gameEndedRef.current = true;
          setTimeout(() => handleGameEnd(), 100);  // ← stale closure
        }
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);
  // ...
}, [gameOverVisible, showGameOverModal]);  // handleGameEnd not in deps
```

**Problem**: `handleGameEnd()` is called inside the timer callback but isn't in the dependency array. When `handleGameEnd` executes, it reads `score`, `foundWords`, and `timeLeft` from the closure — but these values are stale (captured when the effect last ran, not when the timer fires).

This means the score saved to Supabase at game end could be 0 or an earlier value, not the actual final score.

**Fix**: Use a ref to always have the latest `handleGameEnd`, or move the game-end logic into the `setTimeLeft` updater where you have access to current state:

```javascript
const handleGameEndRef = useRef(handleGameEnd);
handleGameEndRef.current = handleGameEnd;

// In the timer:
setTimeout(() => handleGameEndRef.current(), 100);
```

Or better — use refs for score/foundWords that are always current:
```javascript
const scoreRef = useRef(score);
scoreRef.current = score;
// Use scoreRef.current in handleGameEnd
```
