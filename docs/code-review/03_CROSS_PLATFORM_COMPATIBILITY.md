# Cross-Platform Compatibility (iPhone, Android, Tablets)

This document covers issues that affect the app's ability to run correctly on all iPhones, all Android devices, and tablets.

---

## 🔴 High Priority

### 1. Stale Responsive Dimensions

**File**: `src/constants/responsive.js` (lines 4-5)

```javascript
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
```

**Problem**: `screenWidth` and `screenHeight` are captured **once** when the module first loads. These values never update. If the device rotates, or if the app is used in split-screen mode on tablets, all responsive calculations use the wrong dimensions.

`App.js` listens for dimension changes via `Dimensions.addEventListener('change', ...)` but the responsive utility ignores this — it always uses the initial values.

**Affected devices**: All tablets (iPad, Android tablets) that support rotation or multitasking. Also affects foldable phones (Samsung Fold, Pixel Fold).

**Fix**: Call `Dimensions.get('window')` inside `getResponsiveDimensions()` every time it's called:

```javascript
export const getResponsiveDimensions = () => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTab = isTablet(screenWidth, screenHeight);
  // ... rest of function
};
```

Or better — use the `useWindowDimensions()` hook from React Native in components, which automatically re-renders on dimension changes.

---

### 2. Touch Handling Uses `findNodeHandle` + `UIManager.measure` (Deprecated)

**File**: `src/components/game/LetterGrid.js` (lines 33-50)

```javascript
import { UIManager, findNodeHandle } from "react-native";

// Multiple measurement attempts for iPhone 16 compatibility
setTimeout(measureGrid, 100);
setTimeout(measureGrid, 500);
setTimeout(measureGrid, 1000);
```

**Problem**: 
- `findNodeHandle` and `UIManager.measure` are deprecated in the New Architecture (which this app enables via `newArchEnabled: true` in app.config.js)
- The "multiple setTimeout" pattern is a hack that doesn't reliably work — it's a race condition
- On faster devices, the grid may be measured before layout is complete; on slower devices, the 1000ms delay may not be enough

**Affected devices**: All devices with New Architecture enabled. Particularly unreliable on older Android devices with slower rendering.

**Fix**: Use `onLayout` callback instead:

```javascript
const [gridLayout, setGridLayout] = useState(null);

<View
  ref={gridRef}
  onLayout={(event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    // Convert to page coordinates
    gridRef.current?.measureInWindow((pageX, pageY, w, h) => {
      setGridLayout({ x: pageX, y: pageY, width: w, height: h });
    });
  }}
  // ...
>
```

Or use `ref.measureInWindow()` which works with the New Architecture.

---

### 3. Grid Cell Sizing on Small Phones

**File**: `src/components/game/LetterGrid.js` (line 195)

```javascript
minHeight: isTablet() ? 60 : 50,
```

**Problem**: On phones with screen width < 360px (iPhone SE 1st gen, older Android phones), the grid cells with `minHeight: 50` plus margins can overflow the screen. The grid uses `aspectRatio: 1` which is good, but the `minHeight` constraint can conflict with the available space.

**Affected devices**: iPhone SE (1st gen, 320px wide), small Android phones (Galaxy A series, budget phones).

**Fix**: Remove `minHeight` and let `flex: 1` handle sizing naturally within the aspect-ratio container. The grid already constrains itself via `gridMaxWidth`.

---

### 4. `isTablet()` Detection Unreliable on Some Android Devices

**File**: `src/constants/responsive.js` (lines 8-15)

```javascript
export const isTablet = () => {
  const aspectRatio = screenHeight / screenWidth;
  const minDimension = Math.min(screenWidth, screenHeight);
  
  return (
    (Platform.OS === 'ios' && aspectRatio < 1.6) ||
    (Platform.OS === 'android' && minDimension >= 600)
  );
};
```

**Problem**: 
- Uses stale `screenWidth`/`screenHeight` (see issue #1)
- The iOS check (`aspectRatio < 1.6`) incorrectly classifies iPhone 16 Pro Max (aspect ratio ~2.16) as a phone, which is correct — but an iPad Mini in landscape has aspect ratio > 1.6, so it would be classified as a phone
- The Android threshold of 600dp is reasonable but doesn't account for foldable phones in unfolded state (which have min dimension > 600 but aren't tablets)

**Fix**: Accept dimensions as parameters instead of using module-level constants:

```javascript
export const isTablet = (width, height) => {
  const w = width || Dimensions.get('window').width;
  const h = height || Dimensions.get('window').height;
  const aspectRatio = Math.max(w, h) / Math.min(w, h);
  const minDimension = Math.min(w, h);
  
  return (
    (Platform.OS === 'ios' && Platform.isPad) ||  // Use Apple's own detection
    (Platform.OS === 'android' && minDimension >= 600 && aspectRatio < 1.6)
  );
};
```

---

## 🟠 Medium Priority

### 5. Vibration API Differences

**File**: `src/components/game/LetterGrid.js` (lines 82, 87)

```javascript
Vibration.vibrate(40);                    // Valid word
Vibration.vibrate([0, 30, 30, 30]);       // Repeated word (pattern)
```

**Problem**: 
- On iOS, `Vibration.vibrate()` ignores the duration parameter — it always vibrates for a fixed duration
- Vibration patterns (`[0, 30, 30, 30]`) only work on Android
- On iOS, the pattern call just triggers a single vibration

**Affected devices**: All iOS devices get the same vibration regardless of word validity.

**Fix**: Use `expo-haptics` for cross-platform haptic feedback:

```javascript
import * as Haptics from 'expo-haptics';

// Valid word
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Repeated word
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

### 6. `data-testid` vs `testID`

**Files**: Multiple (GameScreen, StartScreen, ProfileScreen, modals)

```javascript
data-testid="game-background"  // Web only
```

**Problem**: `data-testid` is a web/DOM attribute. React Native uses `testID` for testing. These attributes do nothing on iOS/Android and won't be found by React Native Testing Library.

**Fix**: Use `testID` for React Native, or both if you need web support:

```javascript
testID="game-background"
```

---

### 7. `Dimensions.get('window')` Called at Module Level in Multiple Files

**Files**: 
- `src/screens/GameScreen.js` (line 22)
- `src/components/game/LetterGrid.js` (line 14)
- `src/screens/PortugueseGameScreen.js` (line 15)
- `src/constants/responsive.js` (line 4)

**Problem**: Each file captures dimensions at import time. If these modules are imported in a different order or the app starts in a different orientation, they'll have inconsistent values.

**Fix**: Always get dimensions at render time using `useWindowDimensions()` hook or call `Dimensions.get('window')` inside functions/effects.

---

### 8. No Landscape Support (Intentional but Incomplete)

**File**: `app.config.js`

```javascript
orientation: "portrait",
```

**Problem**: The app is locked to portrait, which is fine for phones. But on tablets, users often expect landscape support. The `orientation: "portrait"` setting prevents landscape entirely.

**Affected devices**: iPad users who prefer landscape orientation.

**Fix (if you want tablet landscape)**:
```javascript
orientation: "default",  // Allow both orientations
```
Then ensure all screens handle both orientations via responsive dimensions.

**Fix (if portrait-only is intentional)**: This is fine as-is, but document it as a deliberate choice.

---

### 9. SafeAreaView Edge Handling

**Files**: All screens use `edges={["top", "left", "right", "bottom"]}`

**Problem**: Including `"bottom"` edge on screens with no bottom content can cause unnecessary padding on devices with home indicators (iPhone X+, newer Android). This pushes the game grid up unnecessarily.

**Affected devices**: All phones with gesture navigation (no physical home button).

**Fix**: Only include edges that have content near them:
```javascript
// Game screen - content fills the screen
edges={["top"]}

// Screens with bottom buttons
edges={["top", "bottom"]}
```

---

## 🟡 Lower Priority

### 10. No Dynamic Font Scaling Support

The app uses fixed font sizes everywhere. Users who set large text in their device accessibility settings won't see larger text in the app.

**Fix**: Use `PixelRatio.getFontScale()` to detect and respect user font size preferences, or use React Native Paper's `Text` component which handles this automatically.

### 11. No Dark Mode Support

The app uses `userInterfaceStyle: "light"` and hardcodes white/light backgrounds. Users with system-wide dark mode enabled will get a jarring bright app.

### 12. No Screen Reader Support

- Grid cells have no `accessibilityLabel` (screen readers can't announce letters)
- Timer has no `accessibilityLiveRegion` (score/time changes aren't announced)
- Buttons use visual-only feedback (color flashes) with no audio/haptic alternative for accessibility

### 13. Android Back Button Behavior

The game screen has `gestureEnabled: false` but doesn't handle the Android hardware back button. Pressing back during a game will navigate away without saving the score or showing a confirmation.

**Fix**: Add a `BackHandler` listener in GameScreen:
```javascript
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    // Show "are you sure?" dialog or open menu
    handleShowMenu();
    return true; // Prevent default back behavior
  });
  return () => backHandler.remove();
}, []);
```
