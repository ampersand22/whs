import { generateEnglishBoard } from './EnglishBoardGenerator';
import { generatePortugueseBoard } from './portBoardGenerator';

/**
 * Generate a board based on the specified language
 * @param {string} language - The language ('english' or 'portuguese')
 * @returns {Array} - 5x5 board array
 */
export const generateBoard = (language = 'english') => {
  if (language === 'portuguese') {
    return generatePortugueseBoard();
  }
  return generateEnglishBoard();
};
