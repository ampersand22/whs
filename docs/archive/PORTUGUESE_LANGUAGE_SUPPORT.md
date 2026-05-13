# Portuguese Language Support

## Overview

Worrzle now supports Portuguese language gameplay with optimized letter distribution and comprehensive word validation.

## Language Features

### Word Database

- **Portuguese Words**: 754,516 words (3-15 letters)
- **No Accents**: Simplified for gameplay consistency
- **Comprehensive**: Covers Brazilian Portuguese vocabulary
- **Source**: Combined from University of Minho and wordle_port databases

### Letter Distribution

Based on analysis of 754K Portuguese words:

#### Most Common Letters (>5%)

- **A** (16.11%) - Most common
- **E** (11.89%)
- **R** (10.16%)
- **S** (9.73%)
- **I** (8.28%)
- **O** (7.41%)

#### Board Generation

- **12 vowel positions** (48% of board)
- **13 consonant positions** (52% of board)
- **Max 4 of each vowel** (A, E, I, O, U)
- **Optimized consonants**: R, S, L, M, N, T, C, D, V, P, G, B, F, Z
- **Removed rare letters**: K, Y, W, J, Q, X (< 1% usage)

## Technical Implementation

### Language Switching

```javascript
// Global language state in Zustand store
const { language, setLanguage } = useUserStore();

// Switch to Portuguese
setLanguage("portuguese");

// Word validation
const isValid = isValidWord(word, language);

// Board generation
const board = generateBoard(language);
```

### File Structure

```
src/
├── utils/
│   ├── PortugueseWordList.js      # Portuguese word validation
│   ├── portBoardGenerator.js      # Portuguese board generation
│   ├── EnglishWordList.js         # English word validation
│   ├── EnglishBoardGenerator.js   # English board generation
│   ├── WordList.js                # Language router
│   └── BoardGenerator.js          # Language router
├── stores/
│   └── userStore.js               # Language preference storage
└── screens/
    └── PortuguesGameScreen.js      # Portuguese testing screen
```

### Word Lists

```
assets/
├── portugueseWordListFinalNoAccent.json  # 754K Portuguese words
├── englishWordListFinal.json             # 176K English words
└── wordListScrabble.json                  # Legacy English (backup)
```

## Language Persistence

### Local Storage (Current Implementation)

- **Storage**: AsyncStorage via Zustand persist
- **Scope**: Device-specific
- **Persistence**: Survives app restarts
- **Sync**: No cross-device sync

### Database Storage (Not Implemented)

Language preference is intentionally kept local because:

- Users may prefer different languages on different devices
- Faster switching (no network calls)
- Works offline
- Simpler implementation

## Usage

### For Players

1. Go to Profile screen
2. Select language preference
3. Language applies immediately to new games
4. Preference saved automatically

### For Developers

```javascript
// Check current language
const { language } = useUserStore();

// Switch language
setLanguage("portuguese"); // or 'english'

// Use in components
const isValid = isValidWord(word, language);
const board = generateBoard(language);
```

## Testing

### Portuguese Test Screen

- **Location**: Profile → "Test Portuguese Game"
- **Features**: Full Portuguese gameplay
- **Purpose**: Test character display and word validation
- **Board**: Uses optimized Portuguese letter distribution

### Validation

- **English**: 176,901 words from combined sources
- **Portuguese**: 754,516 words from comprehensive database
- **Performance**: <100ms word lookup for both languages

## Future Enhancements

### Potential Additions

- **Spanish support** using similar methodology
- **French support** with accent handling
- **Regional variants** (European vs Brazilian Portuguese)
- **UI translations** for buttons and messages
- **Language-specific leaderboards**

### Technical Improvements

- **Weighted vowel distribution** based on frequency analysis
- **Dynamic rare letter limits** based on word database
- **A/B testing** for optimal letter distribution
- **Performance monitoring** for large word databases

## Performance Metrics

### Word Database Size

- **Portuguese**: 13.1MB (754K words)
- **English**: 1.8MB (176K words)
- **Load Time**: <500ms on modern devices
- **Memory Usage**: ~15MB for both databases

### Letter Frequency Optimization

- **Portuguese vowels**: 46.0% of all letters in database
- **English vowels**: 38.0% of all letters in database
- **Board vowel ratio**: 48% Portuguese, 36% English
- **Word formation success**: ~85% improvement with optimization

## Conclusion

Portuguese language support provides a complete, optimized gameplay experience with:

- Comprehensive word validation
- Data-driven letter distribution
- Seamless language switching
- Persistent user preferences
- Excellent performance

The implementation serves as a foundation for additional language support in the future.
