# Word Hustle 3C - Tech Stack and Architecture Guide

## Technology Stack Overview

Word Hustle 3C is built using modern React Native technologies with Firebase as the backend. This document explains each technology choice and how they work together.

## Frontend Technologies

### React Native (v0.79.2)
**What it is**: A framework for building native mobile apps using React
**Why we use it**: 
- Write once, run on both iOS and Android
- Large community and ecosystem
- Good performance for our game type
- Easy to learn if you know React

**Key Files**:
- `App.js` - Main app component
- `src/screens/` - All app screens
- `src/components/` - Reusable UI components

### Expo (v53.0.9)
**What it is**: A platform and set of tools for React Native development
**Why we use it**:
- Simplified development workflow
- Easy testing on devices
- Built-in services (push notifications, updates)
- Simplified deployment process

**Key Files**:
- `app.json` - Expo configuration
- `expo.json` - Additional Expo settings

### React Navigation (v7.1.10)
**What it is**: Navigation library for React Native
**Why we use it**:
- Standard navigation solution
- Supports different navigation patterns
- Good performance and customization

**Implementation**:
```javascript
// App.js - Navigation setup
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### React Native Paper (v5.14.5)
**What it is**: Material Design components for React Native
**Why we use it**:
- Consistent, professional UI components
- Follows Material Design guidelines
- Good accessibility support
- Customizable theming

**Common Components Used**:
- `Surface` - Card-like containers
- `Button` - Styled buttons
- `TextInput` - Form inputs
- `Modal` - Popup dialogs

### React Context API
**What it is**: Built-in React state management
**Why we use it**:
- No additional dependencies
- Perfect for our app's complexity level
- Easy to understand and maintain

**Implementation**:
```javascript
// src/auth/AuthContext.js
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## Backend Technologies

### Firebase (v11.9.0)
**What it is**: Google's mobile and web application development platform
**Why we use it**:
- Real-time database perfect for leaderboards
- Built-in authentication
- Scalable and reliable
- Easy integration with React Native

### Firebase Authentication
**Purpose**: User registration, login, and session management
**Features**:
- Email/password authentication
- Secure token management
- Password reset functionality
- User profile management

**Implementation**:
```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Configuration from Firebase console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Firebase Realtime Database
**Purpose**: Store game scores, leaderboards, and user data
**Why Realtime Database (not Firestore)**:
- Real-time updates perfect for live leaderboards
- Simple data structure fits our needs
- Lower latency for frequent updates
- Cost-effective for our use case

**Data Structure**:
```json
{
  "scores": {
    "userId1": {
      "currentScore": 1500,
      "highScore": 2000,
      "gamesPlayed": 25,
      "lastPlayed": "2024-01-15T10:30:00Z"
    }
  },
  "leaderboards": {
    "monthly": {
      "2024-01": {
        "userId1": { "score": 2000, "displayName": "Player1" },
        "userId2": { "score": 1800, "displayName": "Player2" }
      }
    }
  }
}
```

## Development Tools

### Expo CLI
**Purpose**: Development server, building, and deployment
**Key Commands**:
```bash
expo start          # Start development server
expo start --ios    # Run on iOS simulator
expo start --android # Run on Android emulator
expo build          # Build for app stores
```

### Metro Bundler
**What it is**: JavaScript bundler for React Native (built into Expo)
**Purpose**: 
- Bundles JavaScript code
- Handles hot reloading
- Optimizes for mobile performance

### Jest Testing Framework
**Purpose**: Unit testing and integration testing
**Configuration**: `package.json` and individual `.test.js` files

**Example Test**:
```javascript
// src/utils/scoringUtils.test.js
import { getPointsForWord } from './scoringUtils';

describe('Scoring System', () => {
  test('calculates points for short words correctly', () => {
    expect(getPointsForWord('CAT', 1)).toBe(100);
    expect(getPointsForWord('DOG', 2)).toBe(70);
  });
});
```

## Third-Party Libraries

### React Native Gesture Handler (v2.24.0)
**Purpose**: Advanced touch and gesture handling
**Used for**: Letter grid touch interactions, smooth dragging

### React Native Reanimated (v3.17.4)
**Purpose**: High-performance animations
**Used for**: Smooth UI transitions, game animations

### React Native Vector Icons (v10.2.0)
**Purpose**: Icon library
**Used for**: UI icons, buttons, navigation elements

### React Native SVG (v15.11.2)
**Purpose**: SVG rendering support
**Used for**: Custom graphics, scalable icons

### Bad Words (v4.0.0)
**Purpose**: Content filtering
**Used for**: Username validation, preventing inappropriate content

### React Native Confetti Cannon (v1.5.2)
**Purpose**: Celebration animations
**Used for**: Game completion celebrations, achievements

## Architecture Patterns

### Component Architecture

```
App.js (Root)
├── AuthProvider (Context)
├── NavigationContainer
└── Stack.Navigator
    ├── StartScreen
    ├── GameScreen
    │   ├── GridHeader
    │   ├── LetterGrid
    │   ├── WordDisplay
    │   ├── ActionButtons
    │   └── ScoringDisplay
    ├── AuthScreen
    │   └── EmailPasswordAuth
    └── ProfileScreen
```

### State Management Pattern

**Global State** (React Context):
- User authentication status
- User profile information
- App-wide settings

**Local State** (useState):
- Game state (score, timer, found words)
- UI state (modals, loading states)
- Form inputs

**Server State** (Firebase):
- User scores and statistics
- Leaderboard data
- User profiles

### Data Flow Pattern

```
User Action → Component → Local State Update → UI Update
                      ↓
                 Firebase Service → Database Update → Real-time Sync
```

## File Structure Explained

```
word_3c/
├── App.js                 # Root component, navigation setup
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── assets/               # Images, fonts, static files
│   ├── icon.png         # App icon
│   ├── splash.png       # Splash screen
│   └── backgrounds/     # Game backgrounds
├── src/
│   ├── auth/            # Authentication logic
│   │   ├── AuthContext.js      # Auth state management
│   │   ├── AuthService.js      # Auth utility functions
│   │   └── EmailPasswordAuth.js # Login/signup component
│   ├── components/      # Reusable UI components
│   │   ├── LetterGrid.js       # Main game grid
│   │   ├── GridHeader.js       # Timer, score display
│   │   ├── WordDisplay.js      # Current word display
│   │   ├── ActionButtons.js    # Game control buttons
│   │   └── Leaderboard.js      # Leaderboard component
│   ├── context/         # React Context providers
│   │   └── WordContext.js      # Game state context
│   ├── firebase/        # Firebase configuration and services
│   │   ├── initFirebase.js     # Firebase initialization
│   │   ├── config.js           # Firebase exports
│   │   ├── realtimeScores.js   # Score management
│   │   └── monthlyScores.js    # Monthly leaderboards
│   ├── modals/          # Modal components
│   │   ├── GameOverModal.js    # End game modal
│   │   ├── FoundWordsModal.js  # Words list modal
│   │   └── HowToPlayModal.js   # Instructions modal
│   ├── screens/         # Main app screens
│   │   ├── StartScreen.js      # Home/menu screen
│   │   ├── GameScreen.js       # Main game screen
│   │   ├── AuthScreen.js       # Login/signup screen
│   │   ├── ProfileScreen.js    # User profile screen
│   │   └── SettingsScreen.js   # App settings
│   └── utils/           # Utility functions and helpers
│       ├── BoardGenerator.js   # Letter grid generation
│       ├── WordList.js         # Dictionary management
│       ├── scoringUtils.js     # Score calculations
│       ├── gameUtils.js        # Game logic helpers
│       ├── passwordValidator.js # Password validation
│       └── contentModerator.js # Content filtering
└── docs/               # Documentation (this folder)
```

## Performance Considerations

### Optimization Strategies

**React Native Performance**:
- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` for heavy calculations
- Avoid inline functions in render methods
- Use `FlatList` for large lists (leaderboards)

**Firebase Performance**:
- Use database indexing for queries
- Implement offline persistence
- Batch database writes when possible
- Use database rules for security and performance

**Memory Management**:
- Clean up timers and listeners in `useEffect` cleanup
- Optimize image sizes and formats
- Use lazy loading for non-critical components

### Bundle Size Optimization

```javascript
// Use specific imports instead of entire libraries
import { signInWithEmailAndPassword } from 'firebase/auth';
// Instead of: import * as firebase from 'firebase';

// Use React.lazy for code splitting
const ProfileScreen = React.lazy(() => import('./src/screens/ProfileScreen'));
```

## Development Environment

### Required Tools
- **Node.js** (v18+): JavaScript runtime
- **npm/yarn**: Package manager
- **Expo CLI**: Development tools
- **Android Studio**: Android development
- **Xcode** (Mac only): iOS development

### Development Workflow

1. **Local Development**:
   ```bash
   npm start              # Start Expo dev server
   ```

2. **Testing**:
   ```bash
   npm test              # Run Jest tests
   npm run test:watch    # Watch mode for tests
   ```

3. **Building**:
   ```bash
   expo build:android    # Build Android APK
   expo build:ios        # Build iOS IPA
   ```

4. **Deployment**:
   ```bash
   expo publish          # Publish to Expo
   expo upload:android   # Upload to Google Play
   expo upload:ios       # Upload to App Store
   ```

## Security Considerations

### Client-Side Security
- Input validation on all user inputs
- Sanitization of user-generated content
- Secure storage of sensitive data
- Protection against common attacks (XSS, injection)

### Firebase Security
- Database security rules
- Authentication token validation
- Rate limiting for API calls
- Monitoring for suspicious activity

### Code Security
- Environment variables for sensitive config
- No hardcoded secrets in source code
- Regular dependency updates
- Code review process

## Scalability Considerations

### Current Architecture Limits
- Single Firebase project (can scale to millions of users)
- Real-time database (good for current needs)
- Client-side game logic (reduces server load)

### Future Scaling Options
- Migrate to Firestore for complex queries
- Add Cloud Functions for server-side logic
- Implement caching strategies
- Consider CDN for static assets

## Troubleshooting Common Issues

### Development Issues
- **Metro bundler cache**: `expo start --clear`
- **Node modules**: Delete `node_modules`, run `npm install`
- **iOS simulator**: Reset simulator, restart Xcode
- **Android emulator**: Check SDK installation, restart emulator

### Firebase Issues
- **Connection errors**: Check internet, Firebase config
- **Authentication errors**: Verify Firebase project settings
- **Database errors**: Check security rules, data structure

### Performance Issues
- **Slow rendering**: Use React DevTools to identify bottlenecks
- **Memory leaks**: Check for uncleaned listeners and timers
- **Large bundle size**: Analyze with `expo bundle-analyzer`

---

**For developers**: Understanding this tech stack is crucial for effective development. Each technology was chosen for specific reasons, and understanding these choices will help you make better development decisions.
