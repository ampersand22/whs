# 🚀 Worrzle - App Store Build Preparation Guide

## ✅ **Pre-Build Checklist**

### **1. App Configuration Updates**

#### **Update app.config.js:**
```javascript
export default {
  expo: {
    name: "Worrzle",
    slug: "worzzle",
    version: "1.0.0", // ✅ Ready
    orientation: "portrait", // ✅ Good for word games
    icon: "./assets/icon.png", // ✅ Check icon quality
    
    // Add these for app stores:
    description: "A competitive word-finding game. Find words on a 5x5 letter grid and compete monthly for the highest score!",
    keywords: ["word game", "puzzle", "competition", "leaderboard", "words"],
    primaryColor: "#6B46C1",
    
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.worzzle", // ⚠️ CHANGE THIS
      buildNumber: "1",
      infoPlist: {
        NSUserTrackingUsageDescription: "This app uses advertising ID for personalized ads."
      }
    },
    
    android: {
      package: "com.yourcompany.worzzle", // ⚠️ CHANGE THIS
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6B46C1"
      },
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    
    plugins: [
      "expo-dev-client",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX", // ⚠️ REPLACE WITH REAL
          iosAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX", // ⚠️ REPLACE WITH REAL
        }
      ]
    ]
  }
};
```

### **2. Environment Variables**

#### **Update .env file:**
```bash
# Production Supabase credentials
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_anon_key
EXPO_PUBLIC_SUPABASE_URL=your_production_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### **3. AdMob Setup** ⚠️ **CRITICAL**

#### **Replace Test Ad IDs:**
In `src/components/AdManager.js`, replace test IDs with your real AdMob IDs:

```javascript
// Current (TEST IDs):
const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.BANNER 
  : Platform.select({
      ios: 'ca-app-pub-3940256099942544/2934735716', // TEST ID
      android: 'ca-app-pub-3940256099942544/6300978111', // TEST ID
    });

// Change to (REAL IDs):
const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.BANNER 
  : Platform.select({
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // YOUR REAL iOS ID
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // YOUR REAL ANDROID ID
    });
```

### **4. Asset Verification**

#### **Check all required assets exist:**
- ✅ `assets/icon.png` (1024x1024)
- ✅ `assets/adaptive-icon.png` (1024x1024)
- ✅ `assets/splash-icon.png` (1284x2778 for iOS)
- ✅ `assets/favicon.png` (48x48)

### **5. Code Quality & Testing**

#### **Remove development code:**
- ✅ Remove console.log statements (optional)
- ✅ Remove test/debug buttons (already done)
- ✅ Clean up unused files (script ready)

#### **Test thoroughly:**
- ✅ Authentication (sign up, sign in, sign out)
- ✅ Game mechanics (word finding, scoring, timer)
- ✅ Leaderboards and profile
- ✅ Ad display (banner and interstitial)
- ✅ Database operations

### **6. Legal & Compliance**

#### **Privacy Policy & Terms:**
You'll need to create and host:
- Privacy Policy (required for app stores)
- Terms of Service
- Data usage disclosure (for ads)

## 🏗️ **Build Commands**

### **For iOS (requires Mac):**
```bash
# Install EAS CLI if not already installed
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS App Store
eas build --platform ios --profile production
```

### **For Android:**
```bash
# Build for Google Play Store
eas build --platform android --profile production

# Or build both platforms
eas build --platform all --profile production
```

### **Alternative: Local builds**
```bash
# For development builds
npx expo run:ios
npx expo run:android
```

## 📋 **App Store Submission Requirements**

### **iOS App Store:**
- Apple Developer Account ($99/year)
- App Store Connect setup
- Privacy Policy URL
- App description, keywords, screenshots
- Age rating questionnaire

### **Google Play Store:**
- Google Play Console account ($25 one-time)
- Privacy Policy URL
- App description, screenshots
- Content rating questionnaire
- Target API level compliance

## 🔧 **Final Steps Before Build**

1. **Update bundle identifiers** in app.config.js
2. **Replace AdMob test IDs** with real ones
3. **Set production Supabase credentials**
4. **Test on physical devices**
5. **Run cleanup script** to remove unused files
6. **Commit all changes** to git
7. **Create build** with EAS

## 📱 **Testing Checklist**

### **Core Functionality:**
- [ ] User registration/login works
- [ ] Game starts and timer works correctly
- [ ] Word validation works (valid/invalid words)
- [ ] Scoring system calculates correctly
- [ ] Bonus words give +300 points
- [ ] Game over modal shows correct stats
- [ ] Leaderboard displays properly
- [ ] Profile screen shows accurate data
- [ ] Ads display without crashing

### **Edge Cases:**
- [ ] Network connectivity issues
- [ ] App backgrounding/foregrounding
- [ ] Memory management during long sessions
- [ ] Different screen sizes/orientations

## 🚨 **Critical Items to Change**

1. **Bundle Identifiers:** `com.yourcompany.worzzle` → your actual bundle ID
2. **AdMob IDs:** Replace ALL test IDs with your real AdMob unit IDs
3. **Supabase:** Ensure production database is set up and credentials are correct
4. **Privacy Policy:** Create and host before submission

## 📞 **Need Help?**

- Expo Documentation: https://docs.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Policies: https://play.google.com/about/developer-content-policy/
