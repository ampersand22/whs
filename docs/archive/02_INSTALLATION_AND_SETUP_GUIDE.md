# Word Hustle 3C - Installation and Setup Guide

## Prerequisites

### For All Developers

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** or **yarn** (npm comes with Node.js)
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

### Platform-Specific Requirements

#### For iOS Development (Mac Only)
- **Xcode** (latest version from Mac App Store)
- **iOS Simulator** (included with Xcode)
- **CocoaPods**: `sudo gem install cocoapods`

#### For Android Development (Mac/Windows)
- **Android Studio**: https://developer.android.com/studio
- **Android SDK** (installed through Android Studio)
- **Android Emulator** (set up through Android Studio)

## Project Setup

### 1. Clone the Repository
```bash
git clone [REPOSITORY_URL]
cd word_3c
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory (if not already present):
```env
# Firebase configuration will be provided separately
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
```

**Note**: Firebase credentials will be shared securely through our team communication channel.

## Development Commands

### Start Development Server
```bash
# Start Expo development server
npm start
# or
expo start
```

### Platform-Specific Development

#### iOS (Mac only)
```bash
npm run ios
# or
expo start --ios
```

#### Android (Mac/Windows)
```bash
npm run android
# or
expo start --android
```

#### Web (for testing)
```bash
npm run web
# or
expo start --web
```

## IDE Setup Recommendations

### Visual Studio Code (Recommended)
Install these extensions:
- **ES7+ React/Redux/React-Native snippets**
- **React Native Tools**
- **Expo Tools**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### VS Code Settings
Add to your VS Code settings.json:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## Testing Your Setup

### 1. Start the Development Server
```bash
npm start
```

### 2. Test on Device/Emulator
- **Physical Device**: Install Expo Go app and scan QR code
- **iOS Simulator**: Press 'i' in terminal or click "Run on iOS simulator"
- **Android Emulator**: Press 'a' in terminal or click "Run on Android device/emulator"

### 3. Verify Core Features
- App loads without errors
- Navigation between screens works
- Game screen displays letter grid
- Authentication screens are accessible

## Troubleshooting Common Issues

### Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear
```

### Node Modules Issues
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### iOS Simulator Issues
```bash
# Reset iOS Simulator
xcrun simctl erase all
```

### Android Emulator Issues
- Ensure Android SDK is properly installed
- Check that ANDROID_HOME environment variable is set
- Verify emulator is running before starting Expo

### Firebase Connection Issues
- Verify Firebase configuration in `.env` file
- Check internet connection
- Ensure Firebase project is properly set up

## Development Workflow

### 1. Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Start development
npm start

# Make changes and test
# Commit changes when ready
git add .
git commit -m "Description of changes"
git push origin your-branch-name
```

### 2. Branch Management
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/feature-name**: Individual feature development

### 3. Code Style
- Use Prettier for formatting
- Follow React Native best practices
- Write descriptive commit messages
- Add comments for complex logic

## Getting Help

### Team Communication
- **Daily standups**: Share progress and blockers
- **Code reviews**: All changes require review before merging
- **Documentation**: Update docs when adding new features

### External Resources
- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/docs/getting-started
- **Firebase Documentation**: https://firebase.google.com/docs

### Common Commands Reference
```bash
# Development
npm start                 # Start Expo dev server
npm run ios              # Run on iOS
npm run android          # Run on Android
npm run web              # Run on web

# Maintenance
npx expo install         # Install compatible packages
npx expo doctor          # Check for common issues
npx expo upgrade         # Upgrade Expo SDK
```

---

**Next Steps**: After setup, read the Game Mechanics documentation to understand how the game works.
