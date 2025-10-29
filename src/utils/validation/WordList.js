// utils/WordList.js

import { isValidEnglishWord } from "./EnglishWordList";
import { isValidPortugueseWord } from "./PortugueseWordList";

/**
 * Checks if a word is valid according to the current language
 * @param {string} word - The word to check
 * @param {string} language - The language to check against ('english' or 'portuguese')
 * @returns {boolean} - True if the word is valid
 */
export const isValidWord = (word, language = "english") => {
  if (language === "portuguese") {
    return isValidPortugueseWord(word);
  }
  return isValidEnglishWord(word);
};

/**
 * Legacy function for backward compatibility
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is valid in English
 */
export const isValidEnglishWordLegacy = (word) => {
  return isValidEnglishWord(word);
};

/**
 * Checks if a word is a bonus word (placeholder for future implementation)
 * @param {string} word - The word to check
 * @returns {boolean} - Always returns false for now
 */
export const isBonusWord = (word) => {
  return false;
};
