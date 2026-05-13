# Game Mechanics

## Overview

Worrzle is a timed word-finding game. Players swipe across a 5x5 letter grid to form words. Games last 3 minutes with up to 5 board resets.

## Rules

1. Find words by swiping across **adjacent** letter tiles (horizontal, vertical, or diagonal)
2. Words must be **3+ letters** long
3. Each word can only be found **once** per game
4. Words must exist in the English dictionary
5. Game ends when the **3-minute timer** reaches zero

## Board Generation

- 5x5 grid (25 tiles)
- At least 9 vowels placed randomly
- Remaining 16 tiles are consonants
- No more than 3 of the same consonant
- Rare letters (Z, X, J) limited to max 3 total
- No 3+ consecutive identical letters in any direction
- "Q" is always placed as "Qu"

## Board Resets

- Players get **4 usable resets** (MAX_RESETS - 1)
- Each reset generates a fresh board
- Background image changes with each board
- Scoring decreases on later boards (incentivizes finding words on early boards)

## Scoring Matrix

Points are based on word length AND which board you're on:

| Word Length | Board 1 | Board 2 | Boards 3-5 |
|-------------|---------|---------|------------|
| 3-4 letters | 100 | 70 | 50 |
| 5 letters | 150 | 110 | 75 |
| 6-7 letters | 180 | 130 | 100 |
| 8+ letters | 225 | 175 | 125 |

### Bonus Words
- Bonus words (from a curated list) award an extra **300 points**

## Leaderboard

- Monthly competition — resets each month
- Ranked by highest single-game score
- Top players earn stars
- Leaderboard is public (all users can see rankings)

## Feedback

| Event | Feedback |
|-------|----------|
| Valid new word | Green flash + vibration |
| Repeated word | Red flash + pattern vibration |
| Invalid word | No feedback (word just clears) |
| Game over | Modal with score, high score, found words |
| New high score | Confetti animation + green highlight |
