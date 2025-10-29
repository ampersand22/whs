// Portuguese Word List Utility
import portugueseWords from "../../assets/portugueseWordListFinalNoAccent.json";

// Create Set for efficient lookup
const portugueseWordSet = new Set(portugueseWords);

/**
 * Checks if a word is valid according to the Portuguese word list
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid
 */
export const isValidPortugueseWord = (word) => {
  return portugueseWordSet.has(word.toLowerCase());
};

/**
 * Get total number of Portuguese words
 * @returns {number} - Total word count
 */
export const getPortugueseWordCount = () => {
  return portugueseWords.length;
};

/**
 * Get random Portuguese word
 * @param {number} minLength - Minimum word length (default: 3)
 * @param {number} maxLength - Maximum word length (default: 12)
 * @returns {string} - Random Portuguese word
 */
export const getRandomPortugueseWord = (minLength = 3, maxLength = 12) => {
  const filteredWords = portugueseWords.filter(
    word => word.length >= minLength && word.length <= maxLength
  );
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};
