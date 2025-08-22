# Banner Ad Implementation Plan

## Overview
This document outlines the step-by-step implementation of banner ads only - the simplest and least intrusive ad type for the Worrzle app.

## Why Start with Banner Ads?
- ✅ **Least intrusive** - doesn't interrupt gameplay
- ✅ **Always visible** - consistent revenue stream
- ✅ **Simple implementation** - no complex timing logic
- ✅ **Low risk** - minimal impact on user experience
- ✅ **Easy testing** - immediate visual feedback

## Implementation Steps

### Step 1: Prerequisites Setup
**Time Estimate: 30 minutes**

#### 1.1 AdMob Account Setup
- [ ] Create Google AdMob account at https://admob.google.com
- [ ] Create new app: "Worrzle" 
- [ ] Get iOS App ID: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`
- [ ] Create Banner Ad Unit for iOS
- [ ] Get Banner Ad Unit ID: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

#### 1.2 Environment Variables
Add to `.env` file:
```env
# AdMob Configuration
ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# Test IDs for development
ADMOB_TEST_BANNER_ID=ca-app-pub-3940256099942544/6300978111
```

### Step 2: Install Dependencies
**Time Estimate: 15 minutes**

```bash
cd /Users/captain/Desktop/dev/whs
npm install react-native-google-mobile-ads
```

### Step 3: Configuration Files
**Time Estimate: 20 minutes**

#### 3.1 Update app.config.js
```javascript
// Add to existing app.config.js
export default {
  expo: {
    // ... existing config
    plugins: [
      [
        "react-native-google-mobile-ads",
        {
          iosAppId: process.env.ADMOB_IOS_APP_ID,
        }
      ]
    ],
    ios: {
      // ... existing ios config
      infoPlist: {
        // ... existing infoPlist
        GADApplicationIdentifier: process.env.ADMOB_IOS_APP_ID,
        NSUserTrackingUsageDescription: "This app uses advertising ID for personalized ads and analytics to improve your gaming experience.",
      },
    },
    extra: {
      // ... existing extra config
      admobIosAppId: process.env.ADMOB_IOS_APP_ID,
      admobBannerIdIos: process.env.ADMOB_BANNER_ID_IOS,
      admobTestBannerId: process.env.ADMOB_TEST_BANNER_ID,
    }
  }
};
```

#### 3.2 Update eas.json
```json
{
  "build": {
    "preview": {
      "env": {
        // ... existing env vars
        "ADMOB_IOS_APP_ID": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
        "ADMOB_BANNER_ID_IOS": "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX",
        "ADMOB_TEST_BANNER_ID": "ca-app-pub-3940256099942544/6300978111"
      }
    }
  }
}
```

### Step 4: Create Ad Components
**Time Estimate: 45 minutes**

#### 4.1 Create Ad Configuration Utility
**File: `src/utils/adConfig.js`**
```javascript
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const AdConfig = {
  // Test ID for development
  TEST_BANNER_ID: 'ca-app-pub-3940256099942544/6300978111',
  
  // Production banner ID
  BANNER_ID: Constants.expoConfig?.extra?.admobBannerIdIos,
  
  // Get appropriate banner ID based on environment
  getBannerId: () => {
    if (__DEV__) {
      return AdConfig.TEST_BANNER_ID;
    }
    return AdConfig.BANNER_ID || AdConfig.TEST_BANNER_ID;
  },
  
  // Check if ads are properly configured
  isConfigured: () => {
    return !!Constants.expoConfig?.extra?.admobIosAppId;
  }
};
```

#### 4.2 Create Ad Manager
**File: `src/utils/adManager.js`**
```javascript
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

class AdManager {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return true;

    try {
      await mobileAds().initialize();
      
      // Configure ad settings
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });

      this.initialized = true;
      console.log('✅ AdMob initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ AdMob initialization failed:', error);
      return false;
    }
  }

  isInitialized() {
    return this.initialized;
  }
}

export default new AdManager();
```

#### 4.3 Create Banner Ad Component
**File: `src/components/AdBanner.js`**
```javascript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdConfig } from '../utils/adConfig';
import AdManager from '../utils/adManager';

const { width: screenWidth } = Dimensions.get('window');

const AdBanner = ({ 
  style, 
  size = BannerAdSize.ADAPTIVE_BANNER,
  testID = 'ad-banner'
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [managerReady, setManagerReady] = useState(false);

  useEffect(() => {
    initializeAds();
  }, []);

  const initializeAds = async () => {
    if (!AdConfig.isConfigured()) {
      console.log('⚠️ AdMob not configured, skipping banner ad');
      setAdError(true);
      return;
    }

    const success = await AdManager.initialize();
    setManagerReady(success);
  };

  const handleAdLoaded = () => {
    console.log('✅ Banner ad loaded successfully');
    setAdLoaded(true);
    setAdError(false);
  };

  const handleAdError = (error) => {
    console.log('❌ Banner ad error:', error);
    setAdError(true);
    setAdLoaded(false);
  };

  // Don't render if not configured or failed to load
  if (!managerReady || adError || !AdConfig.isConfigured()) {
    return null;
  }

  return (
    <View 
      style={[
        styles.container, 
        style, 
        !adLoaded && styles.loading
      ]}
      testID={testID}
    >
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
    width: screenWidth,
  },
  loading: {
    height: 50, // Placeholder height while loading
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default AdBanner;
```

### Step 5: Integration into StartScreen
**Time Estimate: 30 minutes**

#### 5.1 Update StartScreen.js
Add banner ad to the bottom of the StartScreen:

```javascript
// Add import at top
import AdBanner from '../components/AdBanner';

// In the StartScreen component, add banner at the bottom:
return (
  <View style={{ flex: 1 }}>
    {/* ... existing StartScreen content ... */}
    
    {/* Add banner ad at bottom */}
    <View style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', // Dark background for contrast
      paddingVertical: 5,
    }}>
      <AdBanner 
        testID="start-screen-banner"
        style={{ marginBottom: 5 }}
      />
    </View>
    
    {/* ... existing modals ... */}
  </View>
);
```

#### 5.2 Adjust Layout for Banner
Update the copyright footer in AuthenticatedView and UnauthenticatedView:

```javascript
// In both components, add bottom padding to account for banner
{/* Copyright Footer */}
<View
  style={{
    marginTop: "auto",
    paddingTop: 20,
    paddingBottom: 70, // Add space for banner ad
    alignItems: "center",
  }}
>
```

### Step 6: Testing
**Time Estimate: 30 minutes**

#### 6.1 Local Testing
```bash
# Clear cache and start
npx expo start --clear

# Test on physical device (ads don't show in simulator)
# Should see test banner ads at bottom of StartScreen
```

#### 6.2 Build Testing
```bash
# Build with test ads
eas build --platform ios --profile preview

# Install and test on device
# Verify banner appears and doesn't break layout
```

### Step 7: Production Deployment
**Time Estimate: 15 minutes**

#### 7.1 Replace Test IDs
Update `.env` and `eas.json` with real AdMob IDs:
```env
ADMOB_IOS_APP_ID=ca-app-pub-YOUR_REAL_APP_ID~XXXXXXXXXX
ADMOB_BANNER_ID_IOS=ca-app-pub-YOUR_REAL_BANNER_ID/XXXXXXXXXX
```

#### 7.2 Final Build
```bash
eas build --platform ios --profile preview
```

## Expected Results

### Visual Impact
- Banner ad appears at bottom of StartScreen
- ~50px height, full width
- Dark background for contrast
- Doesn't interfere with existing UI

### Technical Impact
- App size increase: ~2-3MB
- Minimal performance impact
- No gameplay interruption
- Graceful fallback if ads fail

### Revenue Expectations
- **Fill Rate**: 85-95% (how often ads load)
- **eCPM**: $0.50-$2.00 (revenue per 1000 impressions)
- **Daily Revenue**: Depends on user count and session frequency

## Rollback Plan

If issues arise, banner ads can be easily disabled:

```javascript
// In AdBanner.js, add kill switch
const AD_ENABLED = false; // Set to false to disable

if (!AD_ENABLED) {
  return null;
}
```

## Success Metrics

### Technical Metrics
- [ ] Banner loads successfully on 90%+ of app opens
- [ ] No crashes related to ad loading
- [ ] App performance remains smooth
- [ ] Layout doesn't break on different screen sizes

### Business Metrics
- [ ] Ad impressions tracking in AdMob console
- [ ] Revenue generation within 24-48 hours
- [ ] User retention remains stable
- [ ] No significant increase in app uninstalls

## Next Steps After Banner Success

Once banner ads are working well:
1. **Monitor for 1-2 weeks** - ensure stability
2. **Analyze performance** - check fill rates and revenue
3. **Consider interstitial ads** - between games
4. **Add rewarded ads** - for bonus points
5. **Optimize placement** - A/B test positions

## Files That Will Be Modified

### New Files
- `src/utils/adConfig.js`
- `src/utils/adManager.js` 
- `src/components/AdBanner.js`

### Modified Files
- `app.config.js` - Add AdMob plugin and configuration
- `eas.json` - Add environment variables
- `.env` - Add AdMob IDs
- `src/screens/StartScreen.js` - Add banner ad
- `src/components/AuthenticatedView.js` - Adjust padding
- `src/components/UnauthenticatedView.js` - Adjust padding

### Total Implementation Time
**Estimated: 3-4 hours** (including testing and deployment)

This plan focuses solely on banner ads to minimize complexity and risk while establishing the foundation for future ad implementations.
