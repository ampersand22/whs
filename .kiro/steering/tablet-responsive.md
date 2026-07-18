# Tablet & Responsive Design Guidelines

## Overview
This app supports both phones and tablets (iPad). All new UI components must account for tablet screen sizes.

## Tablet Detection
Use the existing utility from `src/constants/responsive.js`:

```js
import { useWindowDimensions } from "react-native";
import { isTablet } from "../constants/responsive"; // adjust relative path

const { width, height } = useWindowDimensions();
const tablet = isTablet(width, height);
```

## Font Sizes
All text must scale up on tablet. Use conditional sizing:

| Element | Phone | Tablet |
|---------|-------|--------|
| Headings / Titles | 20-22px | 28-34px |
| Body text | 14px | 18px |
| Labels / captions | 12px | 16px |
| Button text | 16px | 22-28px |
| Stat values | 18px | 26-30px |

## Buttons (react-native-paper)
React-native-paper `Button` clips text when `labelStyle` increases fontSize beyond the internal height. Always follow this pattern:

```jsx
<Button
  style={{ minHeight: tablet ? 90 : 48, justifyContent: 'center' }}
  contentStyle={{ minHeight: tablet ? 90 : 48, paddingVertical: tablet ? 16 : 0 }}
  labelStyle={{ fontSize: tablet ? 28 : 16, lineHeight: tablet ? 28 * 1.4 : undefined }}
>
```

Key rules:
- Use `minHeight` instead of `height` so buttons can grow
- Add `paddingVertical` to `contentStyle` on tablet for breathing room
- Always set `lineHeight` on `labelStyle` for tablet (fontSize * 1.4) to prevent clipping
- Add `justifyContent: 'center'` to the button style

## Layout
- On tablet, center content vertically and horizontally with `justifyContent: 'center'` and `alignItems: 'center'`
- Constrain content width with `maxWidth` (420-600px) so it doesn't stretch edge-to-edge
- Increase spacing between elements (margins, gaps) by ~50-100% on tablet

## Dialogs / Modals
- Set `maxWidth: 600` and `alignSelf: 'center'` and `width: '90%'` on tablet
- Scale all text inside modals using the font size table above
- Increase `maxHeight` on ScrollViews inside modals (500 → 600+ on tablet)

## Logo
The `Logo` component at `src/components/ui/Logo.js` accepts a `size` prop ("small", "medium", "large"). Use "large" on tablet.

## General Pattern
Every component that renders visible UI should:
1. Import `useWindowDimensions` from react-native
2. Import `isTablet` from constants/responsive
3. Define tablet-specific values (font sizes, heights, spacing)
4. Apply them conditionally

```jsx
const { width, height } = useWindowDimensions();
const tablet = isTablet(width, height);
const fontSize = tablet ? 18 : 14;
```
