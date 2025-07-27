# Word Hustle 3C - Game Mechanics Explained

## Overview

Word Hustle 3C is a fast-paced word-finding game where players trace paths through a letter grid to form words within a time limit. Understanding these mechanics is crucial for development and testing.

## Core Game Flow

### 1. Game Start
- Player sees a 4x4 grid of random letters
- 3-minute countdown timer begins
- Score starts at 0
- Empty found words list

### 2. Word Formation
- Player touches and drags across adjacent letters
- Letters must be connected (horizontally, vertically, or diagonally)
- Minimum word length: 3 letters
- Maximum word length: No limit (but grid size limits practical maximum)
- Same letter position cannot be used twice in one word

### 3. Word Validation
- Word must exist in our dictionary (see `src/utils/WordList.js`)
- Word must be at least 3 letters long
- Word cannot be repeated in the same game session
- Profanity is filtered out

### 4. Scoring System
- Points awarded based on word length and current board number
- Longer words = more points
- Earlier boards = more points
- Bonus words give extra points

## Detailed Mechanics

### Letter Grid Generation

**File**: `src/utils/BoardGenerator.js`

```javascript
// Grid is 4x4 with weighted letter distribution
const LETTER_WEIGHTS = {
  'A': 8, 'E': 12, 'I': 9, 'O': 8, 'U': 4,  // Vowels
  'R': 6, 'N': 6, 'T': 6, 'L': 4, 'S': 4,   // Common consonants
  // ... more letters with different weights
};
```

**Key Features**:
- Vowels are more common to ensure playable boards
- Some letters (Q, X, Z) are rarer
- Each position gets a random letter based on weights
- New board generated after each game

### Word Path Validation

**File**: `src/components/LetterGrid.js`

**Rules**:
1. **Adjacent Only**: Next letter must be horizontally, vertically, or diagonally adjacent
2. **No Revisiting**: Can't use the same grid position twice in one word
3. **Connected Path**: Must form a continuous path through the grid

**Example Valid Paths**:
```
Grid positions (0-15):
[ 0] [ 1] [ 2] [ 3]
[ 4] [ 5] [ 6] [ 7]
[ 8] [ 9] [10] [11]
[12] [13] [14] [15]

Valid: 0→1→2 (horizontal)
Valid: 0→4→8 (vertical)  
Valid: 0→5→10 (diagonal)
Invalid: 0→2→4 (not adjacent)
Invalid: 0→1→0 (revisiting position)
```

### Scoring System

**File**: `src/utils/scoringUtils.js`

#### Base Scoring Matrix
```javascript
const SCORING_MATRIX = {
  'short': {      // 3-4 letters
    1: 100,       // Board 1
    2: 70,        // Board 2  
    3: 50,        // Boards 3-5
  },
  'medium': {     // 5 letters
    1: 150,
    2: 110,
    3: 75,
  },
  'long': {       // 6-7 letters
    1: 180,
    2: 130,
    3: 100,
  },
  'extraLong': {  // 8+ letters
    1: 225,
    2: 175,
    3: 125,
  }
};
```

#### Bonus System
- **Bonus Words**: Special words give 50% extra points
- **Word Length Bonus**: Exponential increase for longer words
- **Speed Bonus**: (Future feature) Extra points for quick word finding

#### Example Scoring
```
Word: "GAME" (4 letters, Board 1)
- Base score: 100 points (short word, board 1)
- If bonus word: 150 points (100 + 50%)
- Total: 100-150 points
```

### Time Management

**File**: `src/screens/GameScreen.js`

```javascript
const INITIAL_TIME = 180; // 3 minutes in seconds

// Timer counts down every second
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Game over
        setGameOverModalVisible(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}, []);
```

**Time Display**:
- Shows as MM:SS format
- Changes color as time runs low
- Red warning when under 30 seconds

### Board Progression

**Multi-Board System**:
1. **Board 1**: Highest point values, easiest letter distribution
2. **Board 2**: Medium point values, standard distribution  
3. **Boards 3-5**: Lower point values, harder letter combinations

**Board Transition**:
- Automatic after each game
- Player can manually reset to Board 1
- Board number affects scoring multiplier

### Word Dictionary

**File**: `src/utils/WordList.js`

**Dictionary Sources**:
- **Main Dictionary**: 6-letter words from Scrabble dictionary
- **Bonus Words**: Special high-value words
- **7-Letter Words**: Extended word list for longer words

**Validation Process**:
```javascript
export const isValidWord = (word) => {
  const upperWord = word.toUpperCase();
  
  // Check main dictionaries
  if (wordListSix.includes(upperWord)) return true;
  if (wordListSeven.includes(upperWord)) return true;
  if (bonusWords.includes(upperWord)) return true;
  
  return false;
};
```

### Content Moderation

**File**: `src/utils/contentModerator.js`

**Features**:
- Profanity filtering for usernames
- Bad word detection in found words
- Customizable word lists
- Real-time validation

## Game States

### 1. Pre-Game
- Show start screen
- Display leaderboards
- User authentication

### 2. Active Game
- Timer running
- Grid interactive
- Real-time word validation
- Score updates

### 3. Game Over
- Timer at 0
- Final score calculation
- Leaderboard update
- Game statistics display

### 4. Post-Game
- Score submission to Firebase
- Leaderboard ranking
- Option to play again

## User Interface Elements

### Game Screen Components

**GridHeader** (`src/components/GridHeader.js`):
- Timer display
- Current score
- Board number
- Settings access

**LetterGrid** (`src/components/LetterGrid.js`):
- 4x4 letter display
- Touch/drag interaction
- Visual feedback for selection
- Path highlighting

**WordDisplay** (`src/components/WordDisplay.js`):
- Current word being formed
- Word validation status
- Visual feedback

**ActionButtons** (`src/components/ActionButtons.js`):
- Submit word
- Clear current word
- Game controls

**ScoringDisplay** (`src/components/ScoringDisplay.js`):
- Points for current word
- Scoring explanation
- Bonus indicators

## Technical Implementation Notes

### Touch Handling
```javascript
// Touch events for word formation
onTouchStart: (event) => {
  // Start word formation
  const position = getTouchPosition(event);
  startWord(position);
}

onTouchMove: (event) => {
  // Continue word formation
  const position = getTouchPosition(event);
  addLetterToWord(position);
}

onTouchEnd: (event) => {
  // Complete word formation
  submitCurrentWord();
}
```

### State Management
- **Local State**: Current game data (score, words, timer)
- **Context**: User authentication, global settings
- **Firebase**: Persistent scores, leaderboards

### Performance Considerations
- **Debounced Touch**: Prevent excessive touch events
- **Memoized Components**: Reduce unnecessary re-renders
- **Optimized Grid**: Efficient letter position calculations

## Testing the Game

### Manual Testing Checklist
1. **Grid Generation**: Letters appear correctly
2. **Word Formation**: Touch/drag works smoothly
3. **Word Validation**: Valid words accepted, invalid rejected
4. **Scoring**: Points calculated correctly
5. **Timer**: Counts down properly, game ends at 0
6. **Leaderboards**: Scores submit and display correctly

### Common Edge Cases
- **Very Short Words**: 1-2 letters should be rejected
- **Repeated Words**: Same word twice should be rejected
- **Invalid Paths**: Non-adjacent letters should be rejected
- **Timer Edge**: Game should end exactly at 0 seconds
- **Network Issues**: Game should work offline, sync when online

## Future Enhancements

### Planned Features
- **Power-ups**: Special abilities during gameplay
- **Daily Challenges**: Special boards with unique rules
- **Multiplayer**: Real-time competition
- **Achievements**: Unlock system for milestones

### Potential Improvements
- **Adaptive Difficulty**: Adjust based on player skill
- **Custom Dictionaries**: Player-specific word lists
- **Replay System**: Review past games
- **Statistics**: Detailed performance analytics

---

**For developers**: Understanding these mechanics is essential for debugging, testing, and adding new features. Always test edge cases and ensure the game feels fair and responsive.
