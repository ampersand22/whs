// English Word List Utility
let englishWordSet = null;

// Preload the word list immediately on import (avoids delay on first word check)
try {
  const englishWords = require("../../../assets/englishWordListFinal.json");
  englishWordSet = new Set(englishWords);
} catch (error) {
  console.warn("Failed to load English word list:", error);
  englishWordSet = new Set();
}

/**
 * Checks if a word is valid according to the English word list
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid
 */
export const isValidEnglishWord = (word) => {
  return englishWordSet.has(word.toLowerCase());
};
