# Pre-Build & Release Checklist

Use this before every `eas build` and store submission.

---

## Before Building

### Version Numbers
- [ ] Bump `version` in `app.config.js` (e.g., "1.1.0" → "1.2.0") for new features
- [ ] Bump `ios.buildNumber` (must be unique per version for App Store)
- [ ] Bump `android.versionCode` (must always increase for Google Play)
- [ ] Update `runtimeVersion` in both `ios` and `android` sections if native code changed
- [ ] Update `version` in `package.json` to match

### Environment Variables
- [ ] Verify `.env`, `.env.development`, and `eas.json` all point to the correct Supabase project
- [ ] Confirm no hardcoded credentials in source code
- [ ] Check that `app.config.js` reads env vars correctly

### Code Quality
- [ ] No `console.log` statements in production code (search: `console.log`, `console.error`)
- [ ] No `__DEV__`-only features leaking into production
- [ ] Test the app in Expo Go or dev build before building for production

### Testing
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Game plays to completion (timer ends, game over modal shows)
- [ ] Score saves to Supabase
- [ ] Leaderboard loads and shows data
- [ ] Banner ad displays (dev build only — won't show in Expo Go)

---

## Build Commands

### iOS (TestFlight)
```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

### Android (Google Play)
```bash
eas build --platform android --profile production
# Then upload .aab manually or use:
eas submit --platform android --latest
```

---

## After Submitting

### iOS
- [ ] Check App Store Connect → TestFlight for processing status
- [ ] Answer encryption compliance question (select "No" — HTTPS only)
- [ ] Wait for Apple processing (~15-30 min)
- [ ] Test via TestFlight app on device

### Android
- [ ] Check Google Play Console → your app → release track
- [ ] Verify no new warnings
- [ ] Promote to internal testing or production when ready

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "Build number already used" (iOS) | Increment `ios.buildNumber` in `app.config.js` |
| "ios directory detected" warning | Delete `ios/` folder: `rm -rf ios` |
| Network request failed in app | Check `.env` and `eas.json` Supabase URLs |
| Worker configuration failed (EAS) | Retry — it's an EAS infrastructure issue |
| AdMob crash on simulator | Normal — ads only work on real devices/dev builds |

---

## Version History

| Version | Build | Date | Notes |
|---------|-------|------|-------|
| 1.1.0 | 17/18 | 2025-05-13 | Code review fixes, AdMob, new Supabase project |
| 1.0.2 | 16 | Previous | Last release on old Supabase |
