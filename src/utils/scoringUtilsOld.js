// import { ref, push } from "firebase/database";
// import { database } from "../firebase/config"; // Fixed import path

// /**
//  * Advanced Scoring Matrix
//  * Based on word length and board number
//  */
// const SCORING_MATRIX = {
//   // 3-4 letter words
//   'short': {
//     1: 100,  // Board 1
//     2: 70,   // Board 2
//     3: 50,   // Boards 3-5
//     4: 50,
//     5: 50
//   },
//   // 5 letter words
//   'medium': {
//     1: 150,  // Board 1
//     2: 110,  // Board 2
//     3: 75,   // Boards 3-5
//     4: 75,
//     5: 75
//   },
//   // 6-7 letter words
//   'long': {
//     1: 180,  // Board 1
//     2: 130,  // Board 2
//     3: 100,  // Boards 3-5
//     4: 100,
//     5: 100
//   },
//   // 8+ letter words
//   'extraLong': {
//     1: 225,  // Board 1
//     2: 175,  // Board 2
//     3: 125,  // Boards 3-5
//     4: 125,
//     5: 125
//   }
// };

// /**
//  * Determine word length category
//  * @param {number} wordLength - Length of the word
//  * @returns {string} Category: 'short', 'medium', 'long', or 'extraLong'
//  */
// const getWordLengthCategory = (wordLength) => {
//   if (wordLength >= 3 && wordLength <= 4) {
//     return 'short';
//   } else if (wordLength === 5) {
//     return 'medium';
//   } else if (wordLength >= 6 && wordLength <= 7) {
//     return 'long';
//   } else if (wordLength >= 8) {
//     return 'extraLong';
//   } else {
//     // Words shorter than 3 letters (shouldn't happen in normal gameplay)
//     return 'short';
//   }
// };

// /**
//  * Calculate points based on word length and board number
//  * @param {string} word - The word that was found
//  * @param {number} boardNumber - Current board number (0-based, so 0 = first board)
//  * @returns {number} Points for the word
//  */
// export const getPointsForWord = (word, boardNumber) => {
//   if (!word || typeof word !== 'string') {
//     console.warn('Invalid word provided to getPointsForWord:', word);
//     return 0;
//   }

//   const wordLength = word.length;
//   const lengthCategory = getWordLengthCategory(wordLength);

//   // Convert 0-based board number to 1-based for scoring matrix
//   const boardKey = Math.max(1, Math.min(5, boardNumber + 1));

//   const points = SCORING_MATRIX[lengthCategory][boardKey];

//   console.log(`Scoring: "${word}" (${wordLength} letters) on board ${boardNumber + 1} = ${points} points`);

//   return points;
// };

// /**
//  * Legacy function for backward compatibility
//  * @deprecated Use getPointsForWord instead
//  * @param {number} resetCount - The number of board resets (0-based)
//  * @returns {number} Points for the word (using old system)
//  */
// export const getPointsPerWord = (resetCount) => {
//   console.warn('getPointsPerWord is deprecated. Use getPointsForWord instead.');
//   switch (resetCount) {
//     case 0:
//       return 100;
//     case 1:
//       return 70;
//     case 2:
//       return 50;
//     default:
//       return 50;
//   }
// };

// /**
//  * Get scoring breakdown for display purposes
//  * @param {number} boardNumber - Current board number (0-based)
//  * @returns {Object} Scoring breakdown by word length
//  */
// export const getScoringBreakdown = (boardNumber) => {
//   const boardKey = Math.max(1, Math.min(5, boardNumber + 1));

//   return {
//     boardNumber: boardNumber + 1,
//     scoring: {
//       '3-4 letters': SCORING_MATRIX.short[boardKey],
//       '5 letters': SCORING_MATRIX.medium[boardKey],
//       '6-7 letters': SCORING_MATRIX.long[boardKey],
//       '8+ letters': SCORING_MATRIX.extraLong[boardKey]
//     }
//   };
// };

// /**
//  * Calculate potential maximum score for a board
//  * This is useful for showing players what they could achieve
//  * @param {Array} possibleWords - Array of all possible words on the board
//  * @param {number} boardNumber - Current board number (0-based)
//  * @returns {number} Maximum possible score
//  */
// export const calculateMaxPossibleScore = (possibleWords, boardNumber) => {
//   if (!Array.isArray(possibleWords)) {
//     return 0;
//   }

//   return possibleWords.reduce((total, word) => {
//     return total + getPointsForWord(word, boardNumber);
//   }, 0);
// };

// /**
//  * Get scoring multiplier description for UI
//  * @param {number} boardNumber - Current board number (0-based)
//  * @returns {string} Description of current scoring multipliers
//  */
// export const getScoringDescription = (boardNumber) => {
//   const breakdown = getScoringBreakdown(boardNumber);
//   const boardNum = breakdown.boardNumber;

//   if (boardNum === 1) {
//     return "🔥 First Board - Maximum Points!";
//   } else if (boardNum === 2) {
//     return "⚡ Second Board - High Points!";
//   } else {
//     return `📊 Board ${boardNum} - Standard Points`;
//   }
// };

// /**
//  * Save the user's score to Firebase Realtime Database.
//  * @param {Object} user - The authenticated user object from Firebase.
//  * @param {number} score - The user's score to save.
//  */
// export const saveScoreToDatabase = (user, score) => {
//   if (user) {
//     const scoreData = {
//       userId: user.uid,
//       displayName: user.displayName,
//       score,
//       timestamp: new Date().toISOString(),
//     };

//     const userScoresRef = ref(database, `scores/${user.uid}`);
//     push(userScoresRef, scoreData)
//       .then(() => {
//         console.log("Score saved successfully!");
//       })
//       .catch((error) => {
//         console.error("Error saving score:", error);
//       });
//   } else {
//     console.error("User not authenticated. Cannot save score.");
//   }
// };

// /**
//  * Analyze scoring efficiency for a game session
//  * @param {Array} foundWords - Array of words found during the game
//  * @param {Array} boardNumbers - Array of board numbers when each word was found
//  * @returns {Object} Scoring analysis
//  */
// export const analyzeScoring = (foundWords, boardNumbers) => {
//   if (!Array.isArray(foundWords) || !Array.isArray(boardNumbers)) {
//     return { totalScore: 0, breakdown: {}, efficiency: 0 };
//   }

//   let totalScore = 0;
//   const breakdown = {
//     short: { count: 0, points: 0 },
//     medium: { count: 0, points: 0 },
//     long: { count: 0, points: 0 },
//     extraLong: { count: 0, points: 0 }
//   };

//   foundWords.forEach((word, index) => {
//     const boardNumber = boardNumbers[index] || 0;
//     const points = getPointsForWord(word, boardNumber);
//     const category = getWordLengthCategory(word.length);

//     totalScore += points;
//     breakdown[category].count++;
//     breakdown[category].points += points;
//   });

//   // Calculate efficiency (average points per word)
//   const efficiency = foundWords.length > 0 ? totalScore / foundWords.length : 0;

//   return {
//     totalScore,
//     breakdown,
//     efficiency: Math.round(efficiency),
//     wordCount: foundWords.length
//   };
// };
