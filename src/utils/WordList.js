// utils/WordList.js

import scrabbleWordList from "../../assets/wordListScrabble.json";
import bonusWordList from "../../assets/wordListBonus.json";

// Normalize word lists to lowercase for consistent comparison
const normalizedScrabbleWordList = scrabbleWordList.map((word) => word.toLowerCase());
const normalizedBonusWordList = bonusWordList.map((word) => word.toLowerCase());

// Create Sets for efficient lookup
const wordSet = new Set(normalizedScrabbleWordList);
const bonusWordSet = new Set(normalizedBonusWordList);

/**
 * Checks if a word is valid according to the Scrabble word list
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid
 */
export const isValidWord = (word) => {
  return wordSet.has(word.toLowerCase());
};

/**
 * Checks if a word is a bonus word
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is a bonus word
 */
export const isBonusWord = (word) => {
  return bonusWordSet.has(word.toLowerCase());
};
