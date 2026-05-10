# Multi-Language Support

## Overview

Worrzle supports both English and Portuguese gameplay with language-specific optimizations for letter distribution, word validation, and user experience.

## Implementation Architecture

### Language Selection
```javascript
// User can switch languages from StartScreen
const [language, setLanguage] = useState('english')

// Language persisted in user store
useUserStore.getState().setLanguage(language)
```

### Board Generation

#### English Board Generator
```javascript
// Optimized letter frequency for English
const englishFrequency = {
  'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5,
  'I': 7.0, 'N': 6.7, 'S': 6.3, 'H': 6.1,
  // ... rest of alphabet
}
```

#### Portuguese Board Generator  
```javascript
// Brazilian Portuguese letter frequency
const portugueseFrequency = {
  'A': 14.6, 'E': 12.6, 'O': 10.7, 'S': 7.8,
  'R': 6.5, 'I': 6.2, 'N': 5.4, 'D': 5.0,
  // ... including Ç and accented characters
}
```

### Word Validation

#### Dictionary Management
```javascript
// Language-specific word lists
import { englishWords } from './EnglishWordList'
import { portugueseWords } from './PortugueseWordList'

const validateWord = (word, language) => {
  const wordList = language === 'portuguese' ? portugueseWords : englishWords
  return wordList.includes(word.toLowerCase())
}
```

#### Portuguese Character Handling
```javascript
// Normalize accented characters for input
const normalizePortuguese = (word) => {
  return word
    .replace(/[áàâã]/g, 'a')
    .replace(/[éê]/g, 'e')
    .replace(/[íî]/g, 'i')
    .replace(/[óôõ]/g, 'o')
    .replace(/[úû]/g, 'u')
    .replace(/ç/g, 'c')
}
```

## User Interface Adaptations

### Language-Specific Screens
- **English**: `GameScreen.js` - Standard gameplay
- **Portuguese**: `PortugueseGameScreen.js` - Localized interface

### Text Localization
```javascript
// Translation constants
const translations = {
  english: {
    startGame: 'Start Game',
    foundWords: 'Found Words',
    score: 'Score'
  },
  portuguese: {
    startGame: 'Iniciar Jogo',
    foundWords: 'Palavras Encontradas', 
    score: 'Pontuação'
  }
}
```

### UI Components
- Language selector modal
- Localized button text
- Score display formatting
- Error messages in selected language

## Database Considerations

### Score Separation
```sql
-- Scores stored with language identifier
INSERT INTO scores (user_id, score, language, created_at)
VALUES (user_id, score, 'portuguese', NOW())
```

### Leaderboard Filtering
```javascript
// Separate leaderboards by language
const getLeaderboard = async (language) => {
  const { data } = await supabase
    .from('scores')
    .select('*')
    .eq('language', language)
    .order('score', { ascending: false })
    .limit(10)
  
  return data
}
```

## Performance Optimizations

### Word List Loading
- Word lists loaded once at app startup
- Cached in memory for fast validation
- Compressed storage for mobile optimization

### Board Generation Caching
- Letter frequency calculations cached
- Board generation algorithms optimized per language
- Reduced computation time for better UX

## Future Enhancements

### Additional Languages
- Spanish support planned
- French language consideration
- Modular architecture supports easy expansion

### Advanced Features
- Language-specific achievements
- Cross-language score comparisons
- Bilingual gameplay modes
