# Google AdMob Integration Guide

## Overview

This document outlines the complete integration of Google AdMob into the Worrzle React Native app. AdMob will provide monetization through banner ads, interstitial ads, and rewarded video ads.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Dependencies](#dependencies)
3. [Configuration](#configuration)
4. [Ad Types](#ad-types)
5. [Implementation](#implementation)
6. [Testing](#testing)
7. [Privacy & Compliance](#privacy--compliance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### AdMob Account Setup
1. Create Google AdMob account at https://admob.google.com
2. Create new app in AdMob console
3. Generate App IDs for iOS and Android
4. Create ad units for each ad type needed

### Required Information
- **iOS App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`
- **Android App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`
- **Banner Ad Unit IDs** (iOS/Android)
- **Interstitial Ad Unit IDs** (iOS/Android)
- **Rewarded Ad Unit IDs** (iOS/Android)

## Dependencies

### Package Installation
```bash
# Primary AdMob package (recommended)
npm install react-native-google-mobile-ads

# Alternative (older but stable)
npm install expo-ads-admob
```

### Version Compatibility
- **react-native-google-mobile-ads**: v12.0.0+
- **expo-ads-admob**: v14.0.0+ (if using Expo managed workflow)

## Configuration

### 1. Environment Variables (.env)
```env
# AdMob App IDs
ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX

# Banner Ad Unit IDs
ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Interstitial Ad Unit IDs
ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Rewarded Ad Unit IDs
ADMOB_REWARDED_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
ADMOB_REWARDED_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Test Ad Unit IDs (for development)
ADMOB_TEST_BANNER_ID=ca-app-pub-3940256099942544/6300978111
ADMOB_TEST_INTERSTITIAL_ID=ca-app-pub-3940256099942544/1033173712
ADMOB_TEST_REWARDED_ID=ca-app-pub-3940256099942544/5224354917
```

### 2. app.config.js
```javascript
import "dotenv/config";

export default {
  expo: {
    name: "Worrzle",
    slug: "worrzle",
    // ... existing config
    plugins: [
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: process.env.ADMOB_ANDROID_APP_ID,
          iosAppId: process.env.ADMOB_IOS_APP_ID,
        }
      ]
    ],
    ios: {
      // ... existing config
      infoPlist: {
        GADApplicationIdentifier: process.env.ADMOB_IOS_APP_ID,
        NSUserTrackingUsageDescription: "This app uses advertising ID for personalized ads and analytics to improve your gaming experience.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      // ... existing config
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "com.google.android.gms.permission.AD_ID"
      ]
    },
    extra: {
      // ... existing extra config
      admobIosAppId: process.env.ADMOB_IOS_APP_ID,
      admobAndroidAppId: process.env.ADMOB_ANDROID_APP_ID,
      admobBannerIdIos: process.env.ADMOB_BANNER_ID_IOS,
      admobBannerIdAndroid: process.env.ADMOB_BANNER_ID_ANDROID,
      admobInterstitialIdIos: process.env.ADMOB_INTERSTITIAL_ID_IOS,
      admobInterstitialIdAndroid: process.env.ADMOB_INTERSTITIAL_ID_ANDROID,
      admobRewardedIdIos: process.env.ADMOB_REWARDED_ID_IOS,
      admobRewardedIdAndroid: process.env.ADMOB_REWARDED_ID_ANDROID,
    }
  }
};
```

### 3. eas.json
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "env": {
        "SUPABASE_URL": "https://mnuduacsnqdrypkzkfzi.supabase.co",
        "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "ADMOB_IOS_APP_ID": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
        "ADMOB_ANDROID_APP_ID": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
        "ADMOB_BANNER_ID_IOS": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        "ADMOB_BANNER_ID_ANDROID": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        "ADMOB_INTERSTITIAL_ID_IOS": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        "ADMOB_INTERSTITIAL_ID_ANDROID": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        "ADMOB_REWARDED_ID_IOS": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        "ADMOB_REWARDED_ID_ANDROID": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
      }
    },
    "production": {
      "distribution": "store",
      "env": {
        // Same environment variables as preview
      }
    }
  }
}
```

## Ad Types

### 1. Banner Ads
- **Placement**: Bottom of StartScreen, top of GameScreen
- **Size**: Smart banner (adaptive)
- **Behavior**: Always visible, non-intrusive
- **Revenue**: Lower per impression, consistent

### 2. Interstitial Ads
- **Placement**: Between games, after game over
- **Timing**: Every 3-5 games to avoid annoyance
- **Behavior**: Full-screen, dismissible
- **Revenue**: Higher per impression

### 3. Rewarded Video Ads
- **Placement**: GameOverModal for bonus points
- **Behavior**: Optional, user-initiated
- **Reward**: Extra points, extra lives, board resets
- **Revenue**: Highest per impression

## Implementation

### Core Ad Configuration (src/utils/adConfig.js)
```javascript
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get ad unit IDs from app config
const getAdUnitId = (adType) => {
  const platform = Platform.OS;
  const configKey = `admob${adType}Id${platform === 'ios' ? 'Ios' : 'Android'}`;
  return Constants.expoConfig?.extra?.[configKey];
};

export const AdConfig = {
  // Test IDs for development
  TEST_IDS: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
  
  // Production IDs
  BANNER_ID: getAdUnitId('Banner'),
  INTERSTITIAL_ID: getAdUnitId('Interstitial'),
  REWARDED_ID: getAdUnitId('Rewarded'),
  
  // Use test IDs in development
  getBannerId: () => __DEV__ ? AdConfig.TEST_IDS.banner : AdConfig.BANNER_ID,
  getInterstitialId: () => __DEV__ ? AdConfig.TEST_IDS.interstitial : AdConfig.INTERSTITIAL_ID,
  getRewardedId: () => __DEV__ ? AdConfig.TEST_IDS.rewarded : AdConfig.REWARDED_ID,
};
```

### Banner Ad Component (src/components/AdBanner.js)
```javascript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdConfig } from '../utils/adConfig';

const AdBanner = ({ style, size = BannerAdSize.SMART_BANNER }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  const handleAdLoaded = () => {
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdError = (error) => {
    console.log('Banner ad error:', error);
    setAdError(true);
    setAdLoaded(false);
  };

  // Don't render if ad failed to load
  if (adError) {
    return null;
  }

  return (
    <View style={[styles.container, style, !adLoaded && styles.hidden]}>
      <BannerAd
        unitId={AdConfig.getBannerId()}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});

export default AdBanner;
```

### Ad Manager Utility (src/utils/adManager.js)
```javascript
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

class AdManager {
  static instance = null;
  
  constructor() {
    if (AdManager.instance) {
      return AdManager.instance;
    }
    
    this.initialized = false;
    AdManager.instance = this;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await mobileAds().initialize();
      
      // Configure ad settings
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });

      this.initialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

export default new AdManager();
```

## Testing

### Development Testing
1. Use test ad unit IDs during development
2. Test on physical devices (ads don't show in simulators)
3. Verify ad loading and error handling
4. Test different screen sizes and orientations

### Test Ad Unit IDs
```javascript
// Use these IDs during development
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};
```

### Production Testing
1. Use real ad unit IDs in production builds
2. Test with limited live traffic
3. Monitor ad performance in AdMob console
4. Verify revenue tracking

## Privacy & Compliance

### iOS App Tracking Transparency
```xml
<!-- ios/Worrzle/Info.plist -->
<key>NSUserTrackingUsageDescription</key>
<string>This app uses advertising ID for personalized ads and analytics to improve your gaming experience.</string>
```

### GDPR Compliance
- Implement consent management for EU users
- Provide privacy policy link
- Allow users to opt-out of personalized ads

### Privacy Policy Requirements
- Disclose ad networks used (Google AdMob)
- Explain data collection practices
- Provide opt-out mechanisms

## Troubleshooting

### Common Issues

#### 1. Ads Not Loading
- **Cause**: Incorrect ad unit IDs, network issues
- **Solution**: Verify IDs, check network connectivity, use test IDs

#### 2. App Crashes on Ad Load
- **Cause**: Missing native dependencies, configuration errors
- **Solution**: Rebuild app, verify plugin configuration

#### 3. Revenue Not Tracking
- **Cause**: Test IDs in production, AdMob account issues
- **Solution**: Use production IDs, verify AdMob account setup

#### 4. iOS Build Failures
- **Cause**: Missing Info.plist entries, pod installation issues
- **Solution**: Add required plist entries, run `pod install`

### Debug Commands
```bash
# Clear Metro cache
npx expo start --clear

# Rebuild with clean cache
eas build --platform ios --profile preview --clear-cache

# Check native dependencies
npx expo install --fix
```

## Performance Considerations

### Memory Management
- Properly dispose of ad instances
- Handle ad loading states
- Implement error boundaries

### User Experience
- Don't show ads too frequently
- Provide loading states
- Handle ad failures gracefully
- Respect user preferences

### Revenue Optimization
- Test different ad placements
- Monitor fill rates and eCPM
- A/B test ad frequencies
- Optimize for user retention vs. revenue

## Implementation Phases

### Phase 1: Banner Ads (Easiest)
1. Install dependencies
2. Configure basic setup
3. Add banner to StartScreen
4. Test and deploy

### Phase 2: Interstitial Ads
1. Create interstitial component
2. Add to game flow
3. Implement frequency controls
4. Test user experience

### Phase 3: Rewarded Ads
1. Create rewarded ad component
2. Integrate with game rewards
3. Add to GameOverModal
4. Test reward mechanics

### Phase 4: Optimization
1. Analytics integration
2. A/B testing
3. Performance monitoring
4. Revenue optimization

## Resources

- [Google AdMob Documentation](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://docs.page/invertase/react-native-google-mobile-ads)
- [Expo AdMob Documentation](https://docs.expo.dev/versions/latest/sdk/admob/)
- [AdMob Policy Guidelines](https://support.google.com/admob/answer/6128543)
