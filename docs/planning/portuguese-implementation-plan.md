# Portuguese Language Implementation Plan

## Current State Analysis

### Existing Architecture

- **Font System**: Uses React Native Paper with MD3LightTheme (default system fonts)
- **Character Support**: Currently limited to English A-Z characters
- **Word Validation**: Currently uses English Scrabble word list (`wordListScrabble.json`)
- **Board Generation**: Uses English alphabet (A-Z) with special handling for Q/Qu
- **Word Lists**:
  - Main: `wordListScrabble.json` (2.6MB, English)
  - Bonus: `wordListBonus.json` (154 bytes, minimal)
  - Portuguese: `portugueseWordList.json` (18KB, 1653 words with accents)
  - Portuguese No Accent: `portWordListNoAccent.json` (18KB, 1653 words)

### Key Components to Modify

1. **Character Display System** - Ensure Portuguese characters render properly
2. **WordList.js** - Word validation logic
3. **BoardGenerator.js** - Letter distribution and board generation
4. **Game Logic** - Language-aware gameplay
5. **User Interface** - Language selection and display

## Implementation Strategy

### Phase 1: Portuguese Character Display (PRIORITY)

### Phase 1: Portuguese Character Display (PRIORITY)

#### 1.1 Font Configuration and Testing

**Current State**: React Native Paper uses system fonts which should support Portuguese characters by default.

**Action Items**:
1. **Test Current Character Support**:
   ```javascript
   // Test component to verify character rendering
   const PortugueseCharacterTest = () => {
     const testChars = "aáàâãeéêiíoóòôõuúçAÁÀÂÃEÉÊIÍOÓÒÔÕUÚÇ";
     return (
       <View>
         <Text style={{ fontSize: 24 }}>{testChars}</Text>
         <Text style={{ fontSize: 18 }}>Test words: término, coração, ação</Text>
       </View>
     );
   };
   ```

2. **Font Fallback Configuration** (if needed):
   ```javascript
   // Enhanced theme in App.js
   const theme = {
     ...MD3LightTheme,
     colors: {
       ...MD3LightTheme.colors,
       primary: "rgb(103, 80, 164)",
       onPrimary: "rgb(255, 255, 255)",
     },
     fonts: {
       ...MD3LightTheme.fonts,
       // Ensure Portuguese character support
       default: {
         fontFamily: 'System', // iOS/Android system fonts support Portuguese
       }
     }
   };
   ```

3. **Character Set Definition**:
   ```javascript
   // New file: src/config/portugueseCharacters.js
   export const PORTUGUESE_CHARACTERS = {
     vowels: ['a', 'á', 'à', 'â', 'ã', 'e', 'é', 'ê', 'i', 'í', 'o', 'ó', 'ò', 'ô', 'õ', 'u', 'ú'],
     consonants: ['b', 'c', 'ç', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
     all: 'aáàâãeéêiíoóòôõuúbcçdfghjklmnpqrstvwxyzAÁÀÂÃEÉÊIÍOÓÒÔÕUÚBCÇDFGHJKLMNPQRSTVWXYZ',
     accented: ['á', 'à', 'â', 'ã', 'é', 'ê', 'í', 'ó', 'ò', 'ô', 'õ', 'ú', 'ç'],
     rare: ['k', 'w', 'y', 'z', 'x']
   };
   ```

#### 1.2 Letter Grid Display Enhancement

**Update LetterGrid Component**:
```javascript
// Enhanced src/components/LetterGrid.js
import { PORTUGUESE_CHARACTERS } from '../config/portugueseCharacters';

// Ensure proper character rendering in grid cells
const renderLetter = (letter) => {
  return (
    <Text style={[
      styles.letterText,
      { 
        fontSize: 20, // Ensure size accommodates accents
        lineHeight: 24, // Proper spacing for accented characters
        textAlign: 'center'
      }
    ]}>
      {letter}
    </Text>
  );
};
```

#### 1.3 Word Display Testing

**Test Portuguese Words in UI**:
- Found words modal
- Score display
- Game over modal
- Word preview component

### Phase 2: Core Language Infrastructure

```javascript
// New file: src/config/languages.js
export const LANGUAGES = {
  EN: "english",
  PT: "portuguese",
};

export const LANGUAGE_CONFIG = {
  english: {
    code: "EN",
    name: "English",
    vowels: "AEIOU",
    consonants: "BCDFGHJKLMNPQRSTVWXYZ",
    specialLetters: ["Q"], // Q becomes Qu
    rareLetters: ["Z", "X", "J"],
    wordLists: {
      main: "wordListScrabble.json",
      bonus: "wordListBonus.json",
    },
  },
  portuguese: {
    code: "PT",
    name: "Português",
    vowels: "AEIOUÁÀÂÃÉÊÍÓÔÕÚ",
    consonants: "BCDFGHJKLMNPQRSTVWXYZÇ",
    specialLetters: ["Ç"],
    rareLetters: ["Z", "X", "W", "K", "Y"],
    wordLists: {
      main: "portugueseWordList.json",
      bonus: "wordListBonus.json", // Can be expanded later
    },
  },
};
```

#### 1.2 Enhanced Word List Manager

```javascript
// Enhanced src/utils/WordList.js
class WordListManager {
  constructor() {
    this.wordSets = {};
    this.bonusWordSets = {};
    this.currentLanguage = "english";
  }

  async loadLanguage(language) {
    // Load word lists for specific language
    // Handle both accented and non-accented versions
  }

  isValidWord(word, language = this.currentLanguage) {
    // Check both accented and non-accented versions
  }

  normalizeWord(word, language) {
    // Remove accents for comparison while preserving display
  }
}
```

#### 1.3 Portuguese Board Generator

```javascript
// Enhanced src/utils/BoardGenerator.js
export const generatePortugueseBoard = () => {
  const vowels = "AEIOUÁÀÂÃÉÊÍÓÔÕÚ";
  const consonants = "BCDFGHJKLMNPQRSTVWXYZÇ";
  const rareLetters = ["Z", "X", "W", "K", "Y"];

  // Portuguese-specific letter distribution
  const letterFrequency = {
    A: 14.63,
    E: 12.57,
    O: 10.73,
    S: 7.81,
    R: 6.53,
    I: 6.18,
    N: 5.05,
    D: 4.99,
    M: 4.74,
    U: 4.63,
    T: 4.34,
    C: 3.88,
    L: 2.78,
    P: 2.52,
    V: 1.67,
    G: 1.3,
    H: 1.28,
    Q: 1.2,
    B: 1.04,
    F: 1.02,
    Z: 0.47,
    J: 0.4,
    X: 0.21,
    K: 0.02,
    Y: 0.01,
    W: 0.01,
  };

  // Generate board with Portuguese letter distribution
};
```

### Phase 2: User Interface Integration

#### 2.1 Language Selection Component

```javascript
// New file: src/components/LanguageSelector.js
export const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Language / Idioma</Text>
      <SegmentedButtons
        value={currentLanguage}
        onValueChange={onLanguageChange}
        buttons={[
          { value: "english", label: "English" },
          { value: "portuguese", label: "Português" },
        ]}
      />
    </View>
  );
};
```

#### 2.2 User Store Enhancement

```javascript
// Enhanced src/stores/userStore.js
const useUserStore = create((set, get) => ({
  // ... existing state
  language: "english",

  setLanguage: (language) => {
    set({ language });
    // Persist to AsyncStorage
    // Reload word lists
  },

  // ... existing methods
}));
```

### Phase 3: Game Logic Updates

#### 3.1 Language-Aware Game Hook

```javascript
// Enhanced src/hooks/useGameLogic.js
export const useGameLogic = () => {
  const { language } = useUserStore();

  // Use language-specific board generator
  const generateLanguageBoard = () => {
    return language === "portuguese"
      ? generatePortugueseBoard()
      : generateBoard();
  };

  // Use language-specific word validation
  const handleWordFormed = (word, isRepeated) => {
    if (word.length >= 3 && isValidWord(word, language)) {
      // ... rest of logic
    }
  };
};
```

#### 3.2 Accent Handling Strategy

- **Display**: Show words with original accents
- **Input**: Accept both accented and non-accented input
- **Validation**: Check against both versions
- **Storage**: Store original accented version

### Phase 4: Data Management

#### 4.1 Word List Optimization

```javascript
// New file: src/utils/PortugueseWordProcessor.js
export class PortugueseWordProcessor {
  static removeAccents(word) {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  static createSearchableVersion(word) {
    return {
      original: word,
      searchable: this.removeAccents(word).toLowerCase(),
      length: word.length,
    };
  }
}
```

#### 4.2 Enhanced Word Lists Structure

```json
// assets/portugueseWordListEnhanced.json
{
  "metadata": {
    "language": "portuguese",
    "version": "1.0",
    "wordCount": 1653,
    "lastUpdated": "2024-10-28"
  },
  "words": [
    {
      "original": "término",
      "normalized": "termino",
      "length": 7,
      "category": "common"
    }
  ]
}
```

### Phase 5: Testing Strategy

#### 5.1 Unit Tests

- Word validation with accents
- Board generation with Portuguese letters
- Language switching functionality
- Accent normalization

#### 5.2 Integration Tests

- Complete game flow in Portuguese
- Language persistence
- Score calculation with Portuguese words

#### 5.3 User Testing

- Portuguese native speakers
- Accent input methods
- Performance with larger character sets

## Implementation Timeline

### Week 1: Character Display Foundation (PRIORITY)

**Day 1-2: Character Support Testing**
- [ ] Create Portuguese character test component
- [ ] Test all Portuguese characters in current UI
- [ ] Verify character rendering in LetterGrid
- [ ] Test word display in modals and components

**Day 3-4: Font and Display Optimization**
- [ ] Configure font fallbacks if needed
- [ ] Optimize character spacing and sizing
- [ ] Test on iOS and Android devices
- [ ] Ensure accessibility support for Portuguese characters

**Day 5-7: Character Set Integration**
- [ ] Create Portuguese character configuration
- [ ] Update LetterGrid to handle Portuguese characters
- [ ] Test character display in all game components
- [ ] Document character support status

### Week 2: Language Infrastructure

- [ ] Create language configuration system
- [ ] Implement basic Portuguese word validation
- [ ] Set up language selection UI
- [ ] Test language switching functionality

### Week 3: Core Features

- [ ] Portuguese board generator with proper letter frequency
- [ ] Enhanced word list manager
- [ ] Accent handling and normalization system
- [ ] Integration testing

### Week 4: Integration & Polish

- [ ] Update game logic for multi-language support
- [ ] User preference persistence
- [ ] UI translations and localization
- [ ] Comprehensive testing and bug fixes

## Technical Considerations

### Performance

- **Word List Loading**: Lazy load language-specific word lists
- **Memory Usage**: Optimize word set storage for mobile devices
- **Search Performance**: Use efficient data structures for word lookup

### User Experience

- **Language Detection**: Auto-detect system language as default
- **Seamless Switching**: Allow language change without losing game progress
- **Visual Feedback**: Clear indication of current language

### Accessibility

- **Screen Readers**: Proper pronunciation of Portuguese words
- **Font Support**: Ensure accent characters display correctly
- **Input Methods**: Support various Portuguese keyboard layouts

## File Structure Changes

```
src/
├── config/
│   ├── languages.js          # New: Language configurations
│   └── supabase.js           # Existing
├── utils/
│   ├── WordList.js           # Enhanced: Multi-language support
│   ├── BoardGenerator.js     # Enhanced: Portuguese board generation
│   ├── PortugueseWordProcessor.js  # New: Accent handling
│   └── ...existing files
├── components/
│   ├── LanguageSelector.js   # New: Language selection UI
│   └── ...existing files
└── stores/
    └── userStore.js          # Enhanced: Language preference
```

## Risk Mitigation

### Data Integrity

- Validate Portuguese word list quality
- Implement fallback mechanisms
- Regular word list updates

### Performance Issues

- Monitor memory usage with larger character sets
- Optimize word lookup algorithms
- Implement progressive loading

### User Adoption

- Gradual rollout with feature flags
- User feedback collection
- A/B testing for UI changes

## Success Metrics

- Portuguese word validation accuracy > 99%
- Game performance maintained (< 100ms word lookup)
- User language preference persistence: 100%
- Zero crashes related to accent handling
- Positive user feedback from Portuguese speakers

## Future Enhancements

### Additional Languages

- Spanish support
- French support
- Extensible architecture for more languages

### Advanced Features

- Language-specific bonus words
- Cultural word categories
- Regional dialect support

### Community Features

- User-contributed word lists
- Language-specific leaderboards
- Multilingual tournaments
