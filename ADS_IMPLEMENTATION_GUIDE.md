# Ads Implementation Guide for Worzzle

## Current Status
✅ **App Structure Ready**: All ad placement code is in place
✅ **AdManager Component**: Created with placeholder functionality
✅ **Ad Placement**: Strategic locations identified (StartScreen, GameScreen)
❌ **Actual Ads**: Disabled to prevent crashes during development

## Why Ads Are Currently Disabled

The native ad modules (Google Mobile Ads) require either:
1. **Expo Development Build** (custom native code)
2. **Ejected Expo project** (bare React Native)
3. **Different ad solution** (web-based ads)

Since you're using Expo managed workflow, native ad modules cause crashes.

## Options to Enable Ads

### Option 1: Expo Development Build (Recommended)
```bash
# Create development build with custom native code
npx expo install expo-dev-client
npx expo run:android  # or expo run:ios
```

**Pros**: 
- Full native module support
- Better performance
- More ad options

**Cons**: 
- Requires more setup
- Need to rebuild when adding native modules

### Option 2: Use Web-Based Ads
```bash
# Install web-compatible ad solution
npm install react-native-webview
```

**Pros**: 
- Works with Expo managed workflow
- No native modules needed

**Cons**: 
- Lower revenue potential
- Less reliable

### Option 3: Eject to Bare React Native
```bash
npx expo eject
```

**Pros**: 
- Full control over native code
- All ad solutions available

**Cons**: 
- Lose Expo managed benefits
- More complex deployment

## Quick Enable Instructions

When you're ready to enable ads:

### 1. Update app.config.js
```javascript
plugins: [
  [
    "expo-ads-admob",
    {
      androidAppId: "your-real-app-id",
      iosAppId: "your-real-app-id",
    }
  ]
]
```

### 2. Update AdManager.js
Replace the placeholder AdManager with the real implementation:

```javascript
import { 
  AdMobBanner, 
  AdMobInterstitial, 
  setTestDeviceIDAsync 
} from 'expo-ads-admob';

// Your real ad unit IDs
const AD_UNIT_IDS = {
  banner: 'ca-app-pub-YOUR-ID/banner',
  interstitial: 'ca-app-pub-YOUR-ID/interstitial',
};
```

### 3. Enable Banner Ads
In `AdManager.js`, uncomment the banner ad component:

```javascript
export const BannerAd = ({ style }) => {
  return (
    <View style={[{ alignItems: 'center', marginVertical: 10 }, style]}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={AD_UNIT_IDS.banner}
        servePersonalizedAds={true}
      />
    </View>
  );
};
```

## Revenue Expectations

Once ads are enabled:
- **Banner ads**: $0.50-2.00 per 1000 views
- **Interstitial ads**: $2.00-8.00 per 1000 views
- **Daily revenue**: $1-10 with 1000+ daily users

## Current Ad Placement

Your app already has ads strategically placed:
- ✅ StartScreen: Banner at bottom
- ✅ GameScreen: Banners at top and bottom
- ✅ Game Over: Interstitial before major actions
- ✅ Smart frequency: Every 3 games

## Next Steps

1. **Test your app** without ads first
2. **Get users** and validate the game experience
3. **Choose ad implementation** method above
4. **Set up AdMob account** and get real ad unit IDs
5. **Enable ads** using this guide

The foundation is ready - you just need to choose when and how to implement the actual ad serving!
