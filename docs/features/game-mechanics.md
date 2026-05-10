# Game Mechanics

## Core Gameplay

### Letter Grid
- **Size**: 5x5 grid of letters
- **Generation**: Language-specific letter frequency distribution
- **Interaction**: Swipe to connect adjacent letters (horizontal, vertical, diagonal)

### Word Formation Rules
- **Minimum length**: 3 letters
- **Path constraints**: Each letter can only be used once per word
- **Adjacent only**: Letters must be connected (no jumping)
- **Validation**: Words checked against language-specific dictionaries

### Game Flow
1. Player selects language (English/Portuguese)
2. Board generates with optimized letter distribution
3. Player finds words by swiping through letters
4. Valid words are scored and added to found words list
5. Game continues until player chooses to submit score

## Scoring System

### Base Points by Word Length

| Word Length | Board 1 | Board 2 | Boards 3-5 |
|-------------|---------|---------|------------|
| 3-4 letters | 100     | 70      | 50         |
| 5 letters   | 150     | 110     | 75         |
| 6-7 letters | 180     | 130     | 100        |
| 8+ letters  | 225     | 175     | 125        |

### Board Progression
- **Board 1**: Full points (new players)
- **Board 2**: 70% of base points
- **Boards 3+**: 50% of base points (experienced players)

### Score Calculation
```javascript
const score = basePoints[wordLength] * boardMultiplier[boardNumber]
```

## Multi-Language Support

### English
- **Letter distribution**: Optimized for English word frequency
- **Dictionary**: Comprehensive English word list
- **Special handling**: Common prefixes/suffixes weighted

### Portuguese
- **Letter distribution**: Brazilian Portuguese frequency
- **Dictionary**: Portuguese word list with accent handling
- **Character mapping**: Accented characters normalized for input

## Competition System

### Monthly Tournaments
- **Duration**: Calendar month
- **Reset**: Leaderboards reset on 1st of each month
- **Winners**: Top player earns a star ⭐
- **Persistence**: Stars accumulate across months

### Leaderboard Rankings
- **Real-time**: Live updates via database subscriptions
- **Filtering**: Separate rankings by language
- **Display**: Top 10 players with scores and usernames

## User Progression

### Profile Statistics
- **High Score**: Personal best score
- **Games Played**: Total number of games
- **Stars Earned**: Monthly competition wins
- **Average Score**: Performance metric
- **Favorite Language**: Most played language

### Achievement System (Future)
- Word length achievements
- Score milestones
- Consecutive game streaks
- Language mastery levels
