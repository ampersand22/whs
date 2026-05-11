# Recommendations & Action Plan

Prioritized list of changes to make this app production-ready on all iPhones, Android devices, and tablets.

---

## Phase 1: Critical Fixes (Do First)

These are blocking issues that cause crashes, data loss, or security exposure.

### 1.1 Remove hardcoded Supabase credentials
- Delete the fallback in `src/config/supabase.js`
- Ensure EAS env vars are configured correctly for all build profiles
- Show a user-friendly "can't connect" screen if config is missing
- Rotate the exposed anon key

### 1.2 Fix navigation typo
- `src/screens/ProfileScreen.js`: Change `'PortuguesGame'` → `'PortugueseGame'`

### 1.3 Add adjacency validation to LetterGrid
- Implement `isAdjacent()` check in `handleTouchMove`
- Only allow selecting cells that neighbor the last selected cell

### 1.4 Fix timer stale closure
- Use refs for values accessed inside the timer callback
- Or restructure `handleGameEnd` to read from refs instead of state

### 1.5 Remove `password_hash` column usage
- Stop inserting `password_hash: 'handled_by_supabase_auth'`
- Consider dropping the column from the database schema

---

## Phase 2: Cross-Platform Reliability (iPhone + Android + Tablet)

### 2.1 Fix responsive dimensions
- Replace module-level `Dimensions.get('window')` with per-call or hook-based approach
- Use `useWindowDimensions()` in components
- Pass dimensions as parameters to utility functions

### 2.2 Replace deprecated touch measurement
- Remove `findNodeHandle` + `UIManager.measure` pattern
- Use `onLayout` + `measureInWindow` instead
- Remove the triple-setTimeout hack

### 2.3 Fix vibration for iOS
- Replace `Vibration.vibrate()` with `expo-haptics`
- Install: `npx expo install expo-haptics`
- Use `Haptics.notificationAsync()` for success/error feedback

### 2.4 Handle Android back button
- Add `BackHandler` listener in GameScreen
- Show confirmation dialog or open menu instead of navigating away

### 2.5 Fix SafeAreaView edges
- Remove `"bottom"` edge from game screens where it adds unnecessary padding
- Keep `"top"` on all screens

### 2.6 Test on small phones
- Remove `minHeight` from grid cells (let flex handle it)
- Test on 320px-wide screens (iPhone SE 1st gen equivalent)
- Ensure grid doesn't overflow on any screen size

---

## Phase 3: Code Quality & Maintenance

### 3.1 Consolidate Portuguese game
- Make `useGameLogic` accept a `language` parameter
- Delete `PortugueseGameScreen.js` and use `GameScreen` with language prop
- This fixes: no score saving for Portuguese, inconsistent timer, different reset limits

### 3.2 Remove dead code
- Delete all `console.log` / `console.error` statements
- Remove empty event listeners in GameScreen
- Remove unused imports (Animated, Linking, Card, Dialog, etc.)
- Remove `endTimer` testing method (or gate behind `__DEV__`)
- Remove `generateEnglishBoardLegacy` (unused)
- Remove `screenData` state in App.js

### 3.3 Fix `data-testid` → `testID`
- Replace all `data-testid` attributes with `testID` for React Native compatibility

### 3.4 Add error feedback for score saving
- Show a toast/snackbar if `processGameCompletion` fails
- Offer retry option

---

## Phase 4: Documentation

### 4.1 Delete outdated docs
- Remove or archive: `04_AUTHENTICATION_SYSTEM_GUIDE.md`, `05_TECH_STACK_AND_ARCHITECTURE.md`, `RESPONSIVE_GUIDE.md`
- Any doc referencing Firebase, React Context, or non-existent files

### 4.2 Write accurate docs
- **README.md**: How to clone, install, run (with correct env var names)
- **ARCHITECTURE.md**: Actual file tree, data flow, Supabase schema
- **DEPLOYMENT.md**: EAS build profiles, env var setup, app store submission
- **SCORING.md**: The scoring matrix, board decay, bonus words

---

## Phase 5: Polish & Best Practices

### 5.1 Add TypeScript (or JSDoc)
- Rename `.js` → `.ts`/`.tsx` incrementally
- Start with utility files (`scoringUtils`, `responsive`, `WordList`)
- Add interfaces for component props

### 5.2 Add test infrastructure
- Install Jest + React Native Testing Library
- Write tests for: scoring utils, board generator, word validation, useGameLogic hook
- These are pure logic — easy to test without UI

### 5.3 Add accessibility
- `accessibilityLabel` on grid cells (announce the letter)
- `accessibilityRole="button"` on interactive elements
- `accessibilityLiveRegion="polite"` on score/timer displays
- Test with VoiceOver (iOS) and TalkBack (Android)

### 5.4 Add dark mode support
- Use React Native Paper's theme system (already set up)
- Detect system preference with `useColorScheme()`
- Define dark theme colors

### 5.5 Performance optimization
- Lazy-load word lists (only when entering game)
- Memoize `getResponsiveDimensions()` results per render
- Move `isTablet()` calls outside render loops
- Consider `React.memo` for grid cells

---

## Estimated Effort

| Phase | Effort | Impact |
|-------|--------|--------|
| Phase 1 | 2-3 hours | Fixes crashes and security issues |
| Phase 2 | 4-6 hours | Makes app work on all devices |
| Phase 3 | 3-4 hours | Reduces maintenance burden |
| Phase 4 | 2-3 hours | Makes project understandable |
| Phase 5 | 8-12 hours | Professional quality |

---

## Quick Wins (< 30 minutes each)

If you want to knock out some easy improvements:

1. ✂️ Delete all `console.log` statements
2. ✂️ Fix the `'PortuguesGame'` typo
3. ✂️ Remove empty event listeners in GameScreen
4. ✂️ Remove unused imports
5. ✂️ Remove `endTimer` from production export
6. ✂️ Remove `screenData` state from App.js
7. ✂️ Move `isTablet()` / `getResponsiveDimensions()` calls outside the grid `.map()` loop
