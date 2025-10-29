// Portuguese Word List Utility
let portugueseWordSet = null;

/**
 * Checks if a word is valid according to the Portuguese word list
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid
 */
export const isValidPortugueseWord = (word) => {
  if (!portugueseWordSet) {
    // Synchronously load for first use
    try {
      const portugueseWords = require("../../../assets/portugueseWordListFinalNoAccent.json");
      portugueseWordSet = new Set(portugueseWords);
    } catch (error) {
      console.warn("Failed to load Portuguese word list:", error);
      return false;
    }
  }
  return portugueseWordSet.has(word.toLowerCase());
};
