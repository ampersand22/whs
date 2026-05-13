# Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.4 + Expo SDK 54 |
| State Management | Zustand + AsyncStorage persistence |
| Backend | Supabase (Auth + PostgreSQL + RPC) |
| Navigation | React Navigation (Stack) |
| UI Library | React Native Paper (Material Design 3) |
| Ads | Google AdMob (react-native-google-mobile-ads) |
| Build/Deploy | EAS Build + EAS Submit |

## Project Structure

```
App.js                          # Entry point, navigation, providers
src/
├── components/
│   ├── ads/
│   │   └── BannerAdComponent.js    # AdMob banner wrapper
│   ├── auth/
│   │   ├── AuthenticatedView.js    # Logged-in start screen
│   │   ├── UnauthenticatedView.js  # Login/signup screen
│   │   ├── AuthDialogs.js          # Sign up/in modals
│   │   └── dialogs/                # Individual dialog components
│   ├── game/
│   │   ├── LetterGrid.js           # 5x5 touch-based word grid
│   │   ├── GameHeader.js           # Score, timer, board count
│   │   ├── GameControls.js         # Reset board, menu buttons
│   │   └── WordPreview.js          # Current word being formed
│   └── ui/
│       ├── ErrorBoundary.js        # App-level error catch
│       ├── Logo.js                 # App logo component
│       └── MenuModal.js            # Settings/menu modal
├── config/
│   └── supabase.js                 # Supabase client initialization
├── constants/
│   ├── responsive.js               # Device detection, responsive sizing
│   └── translations.js             # i18n strings
├── hooks/
│   ├── useGameLogic.js             # Core game state and timer
│   └── useGameAnimations.js        # Word/score animations
├── modals/
│   ├── GameOverModalNew.js         # End-of-game results
│   ├── GameMenuModal.js            # Pause menu
│   ├── FoundWordsModal.js          # List of found words
│   ├── LeaderboardModal.js         # Monthly leaderboard
│   ├── LanguageModal.js            # Language selection (disabled)
│   └── ScoringInfoModal.js         # Scoring explanation
├── screens/
│   ├── StartScreen.js              # Main menu / auth
│   ├── GameScreen.js               # English game
│   ├── PortugueseGameScreen.js     # Portuguese game (disabled)
│   └── ProfileScreen.js            # User profile / settings
├── services/
│   └── userService.js              # Supabase API helpers
├── stores/
│   └── userStore.js                # Zustand store (auth, stats)
└── utils/
    ├── game/
    │   ├── BoardGenerator.js       # Board generation router
    │   ├── EnglishBoardGenerator.js # English letter distribution
    │   └── portBoardGenerator.js   # Portuguese letter distribution
    ├── scoring/
    │   └── scoringUtils.js         # Scoring matrix and calculations
    └── validation/
        ├── WordList.js             # Language-aware word validation
        ├── EnglishWordList.js      # English dictionary (Set)
        └── PortugueseWordList.js   # Portuguese dictionary (Set)
```

## Data Flow

```
User Action → LetterGrid (touch) → useGameLogic (state) → Supabase (persist)
                                         ↓
                                   GameScreen (render)
                                         ↓
                                   GameOverModal → processGameCompletion RPC
```

## Supabase Schema

### Tables
- `whs-users` — User profiles, high scores, stats
- `whs-game_scores` — Individual game results
- `whs-monthly_leaderboards` — Aggregated monthly rankings
- `whs-monthly_winners` — Monthly competition winners
- `whs-user_stars` — Achievement stars

### RPC Functions
- `process_game_completion` — Saves score, updates stats, updates leaderboard (SECURITY DEFINER)
- `get_enhanced_leaderboard` — Returns ranked leaderboard for a given month (SECURITY DEFINER)
- `update_monthly_leaderboard` — Called internally by process_game_completion

## Build Profiles

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| development | Dev client with hot reload | Internal |
| development-simulator | iOS simulator builds | Internal |
| preview | Testing builds | Internal |
| production | App Store / Google Play | Store |

## Environment Variables

| Variable | Used By |
|----------|---------|
| `SUPABASE_URL` | app.config.js → supabase.js |
| `SUPABASE_ANON_KEY` | app.config.js → supabase.js |
| `EXPO_PUBLIC_SUPABASE_URL` | Fallback for client access |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Fallback for client access |
