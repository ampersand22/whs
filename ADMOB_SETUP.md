# AdMob Setup Guide for Worzzle

This guide will help you set up Google AdMob to monetize your Worzzle app.

## 1. Create Google AdMob Account

1. Go to [AdMob](https://admob.google.com/)
2. Sign in with your Google account
3. Create a new AdMob account
4. Accept the AdMob Terms & Conditions

## 2. Create Your App in AdMob

1. In AdMob console, click "Apps" → "Add App"
2. Choose "Add your app manually" (since it's not published yet)
3. Enter app details:
   - **App name**: Worzzle
   - **Platform**: iOS and/or Android
   - **App category**: Games

## 3. Create Ad Units

Create these ad units for your app:

### Banner Ad Unit
- **Ad format**: Banner
- **Ad unit name**: Worzzle Banner
- **Ad size**: Smart banner

### Interstitial Ad Unit
- **Ad format**: Interstitial
- **Ad unit name**: Worzzle Interstitial

### Rewarded Ad Unit (Optional)
- **Ad format**: Rewarded
- **Ad unit name**: Worzzle Rewarded

## 4. Update Configuration Files

### Update `.env` file:
```bash
# Replace with your actual AdMob IDs
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_REWARDED_ID=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

### Update `app.config.js`:
```javascript
plugins: [
  [
    "expo-ads-admob",
    {
      androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID,
      iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID,
    }
  ]
]
```

### Update `src/components/AdManager.js`:
```javascript
const AD_UNIT_IDS = {
  banner: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID,
  interstitial: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID,
  rewarded: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID
};
```

## 5. Ad Implementation Details

### Current Ad Strategy:
- **Banner Ads**: Displayed on Start Screen and Game Screen
- **Interstitial Ads**: Shown every 3 games completed
- **Frequency**: Configurable in `AdManager.js` (currently every 3 games)

### Ad Placement:
- **Start Screen**: Banner ad at bottom
- **Game Screen**: Banner ads at top and bottom
- **Game Over**: Interstitial ad before restarting or going back to menu

## 6. Testing

The current setup uses test ad unit IDs. These will show test ads that won't generate revenue but are safe for testing.

### Test Ad Unit IDs (currently in use):
- **Banner**: `ca-app-pub-3940256099942544/6300978111`
- **Interstitial**: `ca-app-pub-3940256099942544/1033173712`
- **Rewarded**: `ca-app-pub-3940256099942544/5224354917`

## 7. Revenue Optimization Tips

1. **Ad Frequency**: Don't show ads too frequently (current: every 3 games)
2. **Ad Placement**: Banner ads are less intrusive than interstitials
3. **User Experience**: Balance monetization with user experience
4. **A/B Testing**: Test different ad frequencies and placements

## 8. Going Live

Before publishing:

1. Replace all test ad unit IDs with your real ones
2. Remove test device ID from `AdManager.js`
3. Test thoroughly on real devices
4. Submit app for review in app stores

## 9. Expected Revenue

Revenue depends on:
- **Daily Active Users (DAU)**
- **Ad impressions per user**
- **Click-through rate (CTR)**
- **Cost per mille (CPM)**

Typical mobile game CPM ranges from $1-5, so with 1000 daily ad impressions, you might earn $1-5 per day.

## 10. Compliance

Ensure your app complies with:
- Google AdMob policies
- App Store guidelines
- COPPA (if targeting children)
- GDPR (for EU users)

## Support

For issues:
- Check AdMob documentation
- Review Expo AdMob documentation
- Test with different ad unit IDs
- Monitor AdMob console for policy violations
