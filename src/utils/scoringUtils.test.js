/**
 * Tests for Advanced Scoring System
 * Run with: npm test scoringUtils.test.js
 */

import {
  getPointsForWord,
  getScoringBreakdown,
  getScoringDescription,
  calculateMaxPossibleScore,
  analyzeScoring
} from './scoringUtils';

describe('Advanced Scoring System', () => {
  
  describe('getPointsForWord', () => {
    test('should score 3-letter words correctly', () => {
      expect(getPointsForWord('cat', 0)).toBe(100); // Board 1
      expect(getPointsForWord('dog', 1)).toBe(70);  // Board 2
      expect(getPointsForWord('run', 2)).toBe(50);  // Board 3
      expect(getPointsForWord('fun', 3)).toBe(50);  // Board 4
      expect(getPointsForWord('sun', 4)).toBe(50);  // Board 5
    });

    test('should score 4-letter words correctly', () => {
      expect(getPointsForWord('word', 0)).toBe(100); // Board 1
      expect(getPointsForWord('game', 1)).toBe(70);  // Board 2
      expect(getPointsForWord('play', 2)).toBe(50);  // Board 3
    });

    test('should score 5-letter words correctly', () => {
      expect(getPointsForWord('house', 0)).toBe(150); // Board 1
      expect(getPointsForWord('music', 1)).toBe(110); // Board 2
      expect(getPointsForWord('dance', 2)).toBe(75);  // Board 3
      expect(getPointsForWord('smile', 3)).toBe(75);  // Board 4
      expect(getPointsForWord('happy', 4)).toBe(75);  // Board 5
    });

    test('should score 6-letter words correctly', () => {
      expect(getPointsForWord('friend', 0)).toBe(180); // Board 1
      expect(getPointsForWord('family', 1)).toBe(130); // Board 2
      expect(getPointsForWord('school', 2)).toBe(100); // Board 3
    });

    test('should score 7-letter words correctly', () => {
      expect(getPointsForWord('amazing', 0)).toBe(180); // Board 1
      expect(getPointsForWord('perfect', 1)).toBe(130); // Board 2
      expect(getPointsForWord('awesome', 2)).toBe(100); // Board 3
    });

    test('should score 8+ letter words correctly', () => {
      expect(getPointsForWord('beautiful', 0)).toBe(225); // Board 1 (9 letters)
      expect(getPointsForWord('wonderful', 1)).toBe(175); // Board 2 (9 letters)
      expect(getPointsForWord('fantastic', 2)).toBe(125); // Board 3 (9 letters)
      expect(getPointsForWord('incredible', 3)).toBe(125); // Board 4 (10 letters)
    });

    test('should handle edge cases', () => {
      expect(getPointsForWord('', 0)).toBe(0);        // Empty string
      expect(getPointsForWord(null, 0)).toBe(0);      // Null
      expect(getPointsForWord(undefined, 0)).toBe(0); // Undefined
      expect(getPointsForWord('a', 0)).toBe(100);     // 1 letter (treated as short)
      expect(getPointsForWord('ab', 0)).toBe(100);    // 2 letters (treated as short)
    });

    test('should handle board numbers outside range', () => {
      expect(getPointsForWord('test', -1)).toBe(100); // Negative board (treated as board 1)
      expect(getPointsForWord('test', 10)).toBe(50);  // High board number (treated as board 5)
    });
  });

  describe('getScoringBreakdown', () => {
    test('should return correct breakdown for board 1', () => {
      const breakdown = getScoringBreakdown(0);
      expect(breakdown.boardNumber).toBe(1);
      expect(breakdown.scoring['3-4 letters']).toBe(100);
      expect(breakdown.scoring['5 letters']).toBe(150);
      expect(breakdown.scoring['6-7 letters']).toBe(180);
      expect(breakdown.scoring['8+ letters']).toBe(225);
    });

    test('should return correct breakdown for board 2', () => {
      const breakdown = getScoringBreakdown(1);
      expect(breakdown.boardNumber).toBe(2);
      expect(breakdown.scoring['3-4 letters']).toBe(70);
      expect(breakdown.scoring['5 letters']).toBe(110);
      expect(breakdown.scoring['6-7 letters']).toBe(130);
      expect(breakdown.scoring['8+ letters']).toBe(175);
    });

    test('should return correct breakdown for boards 3-5', () => {
      [2, 3, 4].forEach(boardIndex => {
        const breakdown = getScoringBreakdown(boardIndex);
        expect(breakdown.boardNumber).toBe(boardIndex + 1);
        expect(breakdown.scoring['3-4 letters']).toBe(50);
        expect(breakdown.scoring['5 letters']).toBe(75);
        expect(breakdown.scoring['6-7 letters']).toBe(100);
        expect(breakdown.scoring['8+ letters']).toBe(125);
      });
    });
  });

  describe('getScoringDescription', () => {
    test('should return appropriate descriptions', () => {
      expect(getScoringDescription(0)).toContain('First Board');
      expect(getScoringDescription(1)).toContain('Second Board');
      expect(getScoringDescription(2)).toContain('Board 3');
      expect(getScoringDescription(3)).toContain('Board 4');
      expect(getScoringDescription(4)).toContain('Board 5');
    });
  });

  describe('calculateMaxPossibleScore', () => {
    test('should calculate correct maximum score', () => {
      const words = ['cat', 'house', 'friend', 'beautiful'];
      const maxScore = calculateMaxPossibleScore(words, 0); // Board 1
      const expectedScore = 100 + 150 + 180 + 225; // 655
      expect(maxScore).toBe(expectedScore);
    });

    test('should handle empty word list', () => {
      expect(calculateMaxPossibleScore([], 0)).toBe(0);
      expect(calculateMaxPossibleScore(null, 0)).toBe(0);
      expect(calculateMaxPossibleScore(undefined, 0)).toBe(0);
    });

    test('should calculate different scores for different boards', () => {
      const words = ['test', 'hello'];
      const board1Score = calculateMaxPossibleScore(words, 0); // 100 + 150 = 250
      const board2Score = calculateMaxPossibleScore(words, 1); // 70 + 110 = 180
      const board3Score = calculateMaxPossibleScore(words, 2); // 50 + 75 = 125
      
      expect(board1Score).toBe(250);
      expect(board2Score).toBe(180);
      expect(board3Score).toBe(125);
      expect(board1Score).toBeGreaterThan(board2Score);
      expect(board2Score).toBeGreaterThan(board3Score);
    });
  });

  describe('analyzeScoring', () => {
    test('should analyze scoring correctly', () => {
      const foundWords = ['cat', 'house', 'friend', 'beautiful'];
      const boardNumbers = [0, 0, 1, 2]; // Different boards for each word
      
      const analysis = analyzeScoring(foundWords, boardNumbers);
      
      expect(analysis.totalScore).toBe(100 + 150 + 130 + 125); // 505
      expect(analysis.wordCount).toBe(4);
      expect(analysis.efficiency).toBe(Math.round(505 / 4)); // ~126
      expect(analysis.breakdown.short.count).toBe(1); // 'cat'
      expect(analysis.breakdown.medium.count).toBe(1); // 'house'
      expect(analysis.breakdown.long.count).toBe(1); // 'friend'
      expect(analysis.breakdown.extraLong.count).toBe(1); // 'beautiful'
    });

    test('should handle empty arrays', () => {
      const analysis = analyzeScoring([], []);
      expect(analysis.totalScore).toBe(0);
      expect(analysis.wordCount).toBe(0);
      expect(analysis.efficiency).toBe(0);
    });

    test('should handle mismatched array lengths', () => {
      const foundWords = ['cat', 'house'];
      const boardNumbers = [0]; // Missing board number for 'house'
      
      const analysis = analyzeScoring(foundWords, boardNumbers);
      expect(analysis.totalScore).toBe(100 + 150); // Second word defaults to board 0
      expect(analysis.wordCount).toBe(2);
    });
  });

  describe('Scoring Progression', () => {
    test('should show decreasing points as boards progress', () => {
      const testWord = 'testing'; // 7 letters
      const scores = [0, 1, 2, 3, 4].map(board => getPointsForWord(testWord, board));
      
      expect(scores).toEqual([180, 130, 100, 100, 100]);
      expect(scores[0]).toBeGreaterThan(scores[1]); // Board 1 > Board 2
      expect(scores[1]).toBeGreaterThan(scores[2]); // Board 2 > Board 3
      expect(scores[2]).toBe(scores[3]); // Board 3 = Board 4
      expect(scores[3]).toBe(scores[4]); // Board 4 = Board 5
    });

    test('should reward longer words more significantly', () => {
      const words = ['cat', 'house', 'friend', 'beautiful'];
      const board1Scores = words.map(word => getPointsForWord(word, 0));
      
      expect(board1Scores).toEqual([100, 150, 180, 225]);
      expect(board1Scores[3]).toBeGreaterThan(board1Scores[2]); // 8+ > 6-7
      expect(board1Scores[2]).toBeGreaterThan(board1Scores[1]); // 6-7 > 5
      expect(board1Scores[1]).toBeGreaterThan(board1Scores[0]); // 5 > 3-4
    });
  });
});

// Helper function for manual testing
export const testScoringSystem = () => {
  console.log('=== Scoring System Test ===');
  
  const testWords = [
    { word: 'cat', length: 3 },
    { word: 'word', length: 4 },
    { word: 'house', length: 5 },
    { word: 'friend', length: 6 },
    { word: 'amazing', length: 7 },
    { word: 'beautiful', length: 9 },
    { word: 'extraordinary', length: 13 }
  ];
  
  console.log('Board\t3-4\t5\t6-7\t8+');
  for (let board = 0; board < 5; board++) {
    const scores = [
      getPointsForWord('cat', board),
      getPointsForWord('house', board),
      getPointsForWord('friend', board),
      getPointsForWord('beautiful', board)
    ];
    console.log(`${board + 1}\t${scores[0]}\t${scores[1]}\t${scores[2]}\t${scores[3]}`);
  }
  
  console.log('\n=== Sample Game Analysis ===');
  const sampleWords = ['cat', 'house', 'friend', 'beautiful', 'word', 'amazing'];
  const sampleBoards = [0, 0, 1, 2, 1, 3];
  const analysis = analyzeScoring(sampleWords, sampleBoards);
  console.log('Total Score:', analysis.totalScore);
  console.log('Efficiency:', analysis.efficiency, 'points per word');
  console.log('Breakdown:', analysis.breakdown);
};
