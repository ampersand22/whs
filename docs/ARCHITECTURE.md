# Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │    Supabase     │    │   Word Lists    │
│      App        │◄──►│   PostgreSQL    │    │   (Static)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Local Storage  │    │  Real-time      │
│  (AsyncStorage) │    │  Subscriptions  │
└─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### State Management (Zustand)

```javascript
// stores/userStore.js
const useUserStore = create((set, get) => ({
  user: null,
  language: 'english',
  setUser: (user) => set({ user }),
  setLanguage: (lang) => set({ language: lang })
}))
```

### Component Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── game/           # Game-specific components  
│   └── ui/             # Reusable UI components
├── screens/            # Screen components
├── modals/             # Modal components
└── utils/              # Business logic
```

### Navigation Flow

```
StartScreen → GameScreen/PortugueseGameScreen → ProfileScreen
     ↓              ↓                    ↓
  Auth Flow    Game Logic         User Stats
```

## Backend Architecture

### Database Schema

```sql
-- Users table
users (
  id: uuid PRIMARY KEY,
  username: text UNIQUE,
  email: text,
  created_at: timestamp
)

-- Scores table  
scores (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  score: integer,
  language: text,
  created_at: timestamp
)

-- Monthly winners
monthly_winners (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  month: text,
  year: integer,
  score: integer
)
```

### Real-time Features

- **Leaderboards**: Live updates via Supabase subscriptions
- **User presence**: Track active players
- **Score sync**: Immediate score updates

## Game Logic Architecture

### Board Generation

```javascript
// Language-specific generators
generateBoard(language) → BoardGenerator → LanguageSpecificGenerator
```

### Word Validation

```javascript
// Multi-language word validation
validateWord(word, language) → WordValidator → LanguageWordList
```

### Scoring System

```javascript
// Dynamic scoring based on board and word length
calculateScore(word, boardNumber) → ScoringEngine → ScoreMultipliers
```

## Performance Considerations

- **Lazy loading**: Screens loaded on demand
- **Memoization**: React.memo for expensive components
- **Optimistic updates**: UI updates before server confirmation
- **Caching**: Word lists cached locally

## Security

- **Row Level Security**: Supabase RLS policies
- **Input validation**: Client and server-side validation
- **Rate limiting**: Prevent score manipulation
- **Profanity filtering**: Username content filtering
