# Deployment Guide

## Build Configuration

### EAS Build Setup
```json
// eas.json
{
  "cli": {
    "version": ">= 0.52.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### App Configuration
```javascript
// app.config.js
export default {
  expo: {
    name: "Worrzle",
    slug: "worrzle",
    version: "1.0.2",
    platforms: ["ios", "android"],
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6750a4"
    }
  }
}
```

## Environment Variables

### Production Environment
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Build Secrets
```bash
# Set EAS secrets
eas secret:create --scope project --name SUPABASE_URL --value "your-url"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your-key"
```

## Build Commands

### Development Build
```bash
# iOS development build
eas build --platform ios --profile development

# Android development build  
eas build --platform android --profile development
```

### Production Build
```bash
# iOS production build
eas build --platform ios --profile production

# Android production build
eas build --platform android --profile production

# Both platforms
eas build --platform all --profile production
```

## App Store Deployment

### iOS App Store
1. **Build for production**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

3. **Required assets**
   - App icon (1024x1024)
   - Screenshots for all device sizes
   - App Store description
   - Privacy policy URL

### Google Play Store
1. **Build for production**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Play Store**
   ```bash
   eas submit --platform android
   ```

3. **Required assets**
   - Feature graphic (1024x500)
   - Screenshots for phones and tablets
   - Store listing description
   - Privacy policy

## Pre-deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Error boundaries implemented
- [ ] Performance optimizations applied

### Configuration
- [ ] Environment variables set correctly
- [ ] App version incremented
- [ ] Build profiles configured
- [ ] Signing certificates valid

### Testing
- [ ] Tested on physical devices
- [ ] Network connectivity edge cases handled
- [ ] Offline functionality verified
- [ ] Performance tested on low-end devices

### Store Requirements
- [ ] App icons generated for all sizes
- [ ] Screenshots captured
- [ ] Store descriptions written
- [ ] Privacy policy updated
- [ ] Age rating determined

## Monitoring and Analytics

### Crash Reporting
```javascript
// Sentry integration (if added)
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: 'your-sentry-dsn'
})
```

### Performance Monitoring
- Monitor app startup time
- Track API response times
- Monitor memory usage
- Track user engagement metrics

## Rollback Strategy

### Emergency Rollback
1. **Disable updates**
   ```bash
   eas update --branch production --message "Rollback to stable"
   ```

2. **Revert to previous build**
   - Use EAS Build dashboard
   - Promote previous stable build
   - Monitor for stability

### Gradual Rollout
- Start with 5% of users
- Monitor crash rates and feedback
- Gradually increase to 100%
- Rollback if issues detected

## Post-deployment

### Monitoring
- Check crash rates in first 24 hours
- Monitor user reviews and ratings
- Track key performance metrics
- Verify all features working correctly

### Updates
- Use EAS Updates for JavaScript-only changes
- Plan regular update cycles
- Maintain backward compatibility
- Test updates thoroughly before release
