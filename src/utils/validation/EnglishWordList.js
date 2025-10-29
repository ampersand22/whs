// English Word List Utility
let englishWordSet = null;

/**
 * Lazy load the English word list
 */
const loadEnglishWords = async () => {
  if (!englishWordSet) {
    try {
      const englishWords = require("../../../assets/englishWordListFinal.json");
      englishWordSet = new Set(englishWords);
    } catch (error) {
      console.warn("Failed to load English word list:", error);
      englishWordSet = new Set(); // Empty set as fallback
    }
  }
  return englishWordSet;
};

/**
 * Checks if a word is valid according to the English word list
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid
 */
export const isValidEnglishWord = (word) => {
  if (!englishWordSet) {
    // Synchronously load for first use
    try {
      const englishWords = require("../../../assets/englishWordListFinal.json");
      englishWordSet = new Set(englishWords);
    } catch (error) {
      console.warn("Failed to load English word list:", error);
      return false;
    }
  }
  return englishWordSet.has(word.toLowerCase());
};
