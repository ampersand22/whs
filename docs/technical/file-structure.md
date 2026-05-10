# File Structure

## Current Project Structure

```
whs/
├── App.js                      # Main app component
├── index.js                    # Entry point
├── package.json                # Dependencies and scripts
├── app.config.js              # Expo configuration
├── eas.json                   # EAS Build configuration
├── .env                       # Environment variables
├── assets/                    # Static assets
│   ├── icon.png              # App icon
│   ├── splash-icon.png       # Splash screen
│   ├── englishWordListFinal.json
│   └── portugueseWordListFinalNoAccent.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthDialogs.js
│   │   │   ├── AuthenticatedView.js
│   │   │   └── UnauthenticatedView.js
│   │   ├── game/
│   │   │   ├── GameControls.js
│   │   │   ├── GameHeader.js
│   │   │   ├── LetterGrid.js
│   │   │   └── WordPreview.js
│   │   └── ui/
│   │       ├── ErrorBoundary.js
│   │       ├── Logo.js
│   │       └── MenuModal.js
│   ├── config/
│   │   └── supabase.js        # Supabase client configuration
│   ├── constants/
│   │   ├── responsive.js      # Screen size utilities
│   │   └── translations.js    # Multi-language text
│   ├── hooks/
│   │   ├── useGameAnimations.js
│   │   └── useGameLogic.js
│   ├── modals/
│   │   ├── FoundWordsModal.js
│   │   ├── GameMenuModal.js
│   │   ├── GameOverModalNew.js
│   │   ├── LanguageModal.js
│   │   ├── LeaderboardModal.js
│   │   └── ScoringInfoModal.js
│   ├── screens/
│   │   ├── GameScreen.js      # English gameplay
│   │   ├── PortugueseGameScreen.js # Portuguese gameplay
│   │   ├── ProfileScreen.js   # User profile and stats
│   │   └── StartScreen.js     # Main menu
│   ├── services/
│   │   └── userService.js     # User-related API calls
│   ├── stores/
│   │   └── userStore.js       # Global state management
│   └── utils/
│       ├── game/
│       │   ├── BoardGenerator.js      # Main board generator
│       │   ├── EnglishBoardGenerator.js
│       │   └── portBoardGenerator.js  # Portuguese generator
│       ├── scoring/
│       │   └── scoringUtils.js
│       └── validation/
│           ├── EnglishWordList.js
│           ├── PortugueseWordList.js
│           └── WordList.js
├── docs/                      # Documentation
├── ios/                       # iOS-specific files
├── sql/                       # Database schemas
└── lib/                       # External libraries
```

## Component Hierarchy

### Screen Components
```
StartScreen
├── Logo
├── AuthenticatedView
│   ├── GameControls
│   └── LanguageModal
└── UnauthenticatedView
    └── AuthDialogs

GameScreen/PortugueseGameScreen
├── GameHeader
├── LetterGrid
├── WordPreview
├── FoundWordsModal
├── GameMenuModal
├── ScoringInfoModal
└── GameOverModalNew

ProfileScreen
├── UserStats
├── LeaderboardModal
└── GameHistory
```

## File Naming Conventions

### Components
- **Screens**: `ScreenName.js` (e.g., `GameScreen.js`)
- **Components**: `ComponentName.js` (e.g., `LetterGrid.js`)
- **Modals**: `ModalName.js` (e.g., `LeaderboardModal.js`)

### Utilities
- **Services**: `serviceName.js` (e.g., `userService.js`)
- **Utils**: `utilityName.js` (e.g., `scoringUtils.js`)
- **Stores**: `storeName.js` (e.g., `userStore.js`)

### Constants
- **Config**: `configName.js` (e.g., `supabase.js`)
- **Constants**: `constantType.js` (e.g., `translations.js`)

## Import Patterns

### Absolute Imports (Recommended)
```javascript
import GameScreen from '../screens/GameScreen'
import { calculateScore } from '../utils/scoring/scoringUtils'
import useUserStore from '../stores/userStore'
```

### Component Imports
```javascript
// Screen imports
import StartScreen from './src/screens/StartScreen'

// Component imports  
import LetterGrid from './src/components/game/LetterGrid'

// Utility imports
import { generateBoard } from './src/utils/game/BoardGenerator'
```

## Asset Organization

```
assets/
├── icons/
│   ├── icon.png              # App icon (1024x1024)
│   └── adaptive-icon.png     # Android adaptive icon
├── images/
│   ├── backgrounds/          # Background images
│   ├── splash-icon.png       # Splash screen icon
│   └── logos/               # Logo variations
├── data/
│   ├── englishWordListFinal.json
│   └── portugueseWordListFinalNoAccent.json
└── fonts/                   # Custom fonts (if any)
```

## Build Output Structure

```
dist/                        # Web build output
├── assets/                  # Compiled assets
├── _expo/                   # Expo-specific files
└── metadata.json           # Build metadata

.expo/                       # Expo cache and config
├── devices.json            # Connected devices
└── web/                    # Web-specific cache
```

## Development Files

```
.git/                        # Git repository
.expo/                       # Expo development files
node_modules/               # Dependencies
docs/                       # Documentation
sql/                        # Database schemas
ios/                        # iOS native code
android/                    # Android native code (if ejected)
```
