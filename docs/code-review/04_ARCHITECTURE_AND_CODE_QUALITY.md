# Architecture & Code Quality

---

## Architecture Overview

```
App.js
├── ErrorBoundary
├── SafeAreaProvider
├── PaperProvider (theme)
└── NavigationContainer
    ├── StartScreen (auth + menu)
    ├── GameScreen (English game)
    ├── PortugueseGameScreen (Portuguese game)
    └── ProfileScreen

State: Zustand (userStore) + AsyncStorage persistence
Backend: Supabase (Auth + PostgreSQL + RPC functions)
Styling: Inline styles + StyleSheet.create (mixed)
```

**Verdict**: The architecture is simple and appropriate for a single-feature game app. The main structural problem is the duplicated Portuguese game screen.

---

## 🔴 Major Issues

### 1. Duplicated Game Logic (PortugueseGameScreen)

**File**: `src/screens/PortugueseGameScreen.js`

This 170-line file reimplements everything that `useGameLogic` already does:
- Timer management (using `setTimeout` instead of `setInterval`)
- Score tracking
- Board reset logic
- Word validation
- Game over handling

**Differences from English version**:
| Feature | English (useGameLogic) | Portuguese |
|---------|----------------------|------------|
| Timer | `setInterval` with refs | `setTimeout` recursive |
| Max resets | 4 usable (MAX_RESETS - 1) | 5 usable |
| Score saving | Saves to Supabase | Never saves |
| Game end protection | `gameEndedRef` prevents double-fire | None |
| Bonus words | Checked and awarded | Not checked |

**Fix**: Make `useGameLogic` accept a `language` parameter:
```javascript
const gameLogic = useGameLogic({ language: 'portuguese' });
```

---

### 2. Console Statements in Production Code

**Files**: GameScreen.js, PortugueseGameScreen.js, useGameLogic.js, GameOverModalNew.js

```javascript
console.log("English Game");
console.log("Word formed:", word);
console.log("Is valid Portuguese word:", isValid);
console.log('Saving game score:', gameData);
console.error('🔍 GameScreen: Navigation error:', error);
```

**Impact**: 
- Performance hit on Android (console.log is synchronous and blocks the JS thread)
- Leaks game state information in production
- The `console.log` inside the render function of GameScreen runs every re-render

**Fix**: Remove all console statements, or use a logger that's disabled in production:
```javascript
const log = __DEV__ ? console.log : () => {};
```

---

### 3. Empty Event Listeners

**File**: `src/screens/GameScreen.js` (lines 79-95)

```javascript
const unsubscribe = navigation.addListener("focus", () => {});
const unsubscribeBlur = navigation.addListener("blur", () => {});
const unsubscribeBeforeRemove = navigation.addListener("beforeRemove", (e) => {});
```

These are leftover debugging listeners that do nothing. They add memory overhead (three subscriptions per mount) and make the code harder to read.

---

### 4. Unused Imports

| File | Unused Imports |
|------|---------------|
| `GameScreen.js` | `useState`, `useCallback` (from React), `Dimensions` used only at module level |
| `LetterGrid.js` | `Animated` |
| `StartScreen.js` | `Linking` |
| `GameMenuModal.js` | `Card`, `Dialog`, `Paragraph` |
| `BoardGenerator.js` | `generateEnglishBoardLegacy` (exported but never imported anywhere) |

---

### 5. `endTimer` Testing Method Exposed in Production

**File**: `src/hooks/useGameLogic.js` (line 155)

```javascript
// Temporary method for testing - manually end the timer
const endTimer = () => {
  setTimeLeft(0);
  handleGameEnd();
};

return {
  // ...
  endTimer, // Temporary for testing
};
```

This allows any component to instantly end the game. Should be removed or gated behind `__DEV__`.

---

### 6. `screenData` State Never Used

**File**: `App.js` (line 39)

```javascript
const [screenData, setScreenData] = useState(Dimensions.get("window"));

useEffect(() => {
  const subscription = Dimensions.addEventListener("change", ({ window }) => {
    setScreenData(window);  // Set but never read
  });
  return () => subscription?.remove();
}, []);
```

This causes unnecessary re-renders of the entire app tree on every dimension change, but the value is never consumed.

---

## 🟠 Moderate Issues

### 7. Mixed Styling Approaches

The codebase uses three different styling patterns:
1. **Inline styles** (most components): `style={{ flex: 1, padding: 20 }}`
2. **StyleSheet.create** (AuthenticatedView): `styles.welcomeCard`
3. **Responsive utility** (some components): `getResponsiveDimensions()`

This makes it hard to maintain consistent spacing, colors, and sizing. There's no design token system.

**Recommendation**: Pick one approach. For this app size, `StyleSheet.create` with a shared theme/tokens file would work well.

---

### 8. No Error Recovery in Game Flow

If `processGameCompletion` fails (network error, Supabase down), the user gets no feedback. The score is silently lost:

```javascript
} catch (error) {
  console.error('Error saving game score:', error);
  // User never knows their score wasn't saved
}
```

**Fix**: Show a retry option or at minimum a toast notification.

---

### 9. Word List Memory Management

**Files**: `src/utils/validation/EnglishWordList.js`, `src/utils/validation/PortugueseWordList.js`

Both word lists are loaded as `Set` objects and kept in memory forever. For a ~170K word English dictionary, this is ~5-10MB of RAM that's never released, even when the user is on the Start screen.

**Fix**: Load word lists lazily when entering the game screen, and consider unloading when leaving.

---

### 10. `isTablet()` Called Inside Render Loops

**File**: `src/components/game/LetterGrid.js` (inside `.map()`)

```javascript
{rowArr.map((cell, col) => {
  // Called 25 times per render (5x5 grid)
  const dimensions = getResponsiveDimensions();
  // ...
  margin: isTablet() ? 3 : 2,
  minHeight: isTablet() ? 60 : 50,
})}
```

`isTablet()` and `getResponsiveDimensions()` are called 25 times per render. These should be called once outside the loop.

---

### 11. Portal + Modal Double-Wrapping

**File**: `src/modals/GameOverModalNew.js`

```javascript
<Portal>
  <Modal visible={visible} transparent animationType="none">
    ...
  </Modal>
</Portal>
```

Using both React Native Paper's `<Portal>` and React Native's `<Modal>` together can cause z-index conflicts on Android. The `Portal` renders content at the root of the Paper provider, but `Modal` creates its own native layer. Pick one:
- Use `Portal` + a custom overlay (for Paper-consistent theming)
- Use `Modal` alone (for native modal behavior)

---

## 🟢 Minor Issues

### 12. No TypeScript

The entire project is plain JavaScript. For a project with this many moving parts (auth, game logic, scoring, API calls), TypeScript would catch many bugs at compile time — especially the navigation typo and stale closure issues.

### 13. No Prop Validation

No PropTypes or TypeScript interfaces. Components accept any props without validation, making it easy to pass wrong types silently.

### 14. Inconsistent Naming

- `GameOverModalNew` — what was the old one? Is there a `GameOverModal` somewhere?
- `portBoardGenerator.js` vs `EnglishBoardGenerator.js` — inconsistent casing and abbreviation
- `whs-users`, `whs-game_scores`, `whs-user_stars` — table names mix hyphens and underscores

### 15. No Loading States for Game Initialization

`GameScreen` calls `gameLogic.initializeGame()` on mount but shows no loading indicator while the high score is being fetched. If the network is slow, the game starts with `userHighScore: 0` and may incorrectly show "NEW HIGH SCORE!" at game end.
