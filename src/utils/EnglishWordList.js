// English Word List Utility
import englishWords from "../../assets/englishWordListFinal.json";

// Create Set for efficient lookup
const englishWordSet = new Set(englishWords);

/**
 * Checks if a word is valid according to the English word list
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid
 */
export const isValidEnglishWord = (word) => {
  return englishWordSet.has(word.toLowerCase());
};

/**
 * Get total number of English words
 * @returns {number} - Total word count
 */
export const getEnglishWordCount = () => {
  return englishWords.length;
};

/**
 * Get random English word
 * @param {number} minLength - Minimum word length (default: 3)
 * @param {number} maxLength - Maximum word length (default: 12)
 * @returns {string} - Random English word
 */
export const getRandomEnglishWord = (minLength = 3, maxLength = 12) => {
  const filteredWords = englishWords.filter(
    word => word.length >= minLength && word.length <= maxLength
  );
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};
