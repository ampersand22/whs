/**
 * Tests for Content Moderation Utility
 * Run with: npm test contentModerator.test.js
 */

import { validateUsername, suggestAlternativeUsernames } from './contentModerator';

describe('Username Content Moderation', () => {
  test('should accept valid usernames', () => {
    const validUsernames = [
      'GoodUser123',
      'player_one',
      'word-master',
      'GameFan2024',
      'puzzle_solver'
    ];

    validUsernames.forEach(username => {
      const result = validateUsername(username);
      expect(result.isValid).toBe(true);
      expect(result.reason).toBeNull();
    });
  });

  test('should reject usernames that are too short', () => {
    const result = validateUsername('ab');
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('Username must be at least 3 characters long');
  });

  test('should reject usernames that are too long', () => {
    const longUsername = 'a'.repeat(21);
    const result = validateUsername(longUsername);
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('Username must be 20 characters or less');
  });

  test('should reject usernames with invalid characters', () => {
    const invalidUsernames = [
      'user@name',
      'user name',
      'user#123',
      'user$money',
      'user%test'
    ];

    invalidUsernames.forEach(username => {
      const result = validateUsername(username);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Username can only contain letters, numbers, underscores, and dashes');
    });
  });

  test('should reject offensive usernames', () => {
    // Note: Using mild examples for testing - the bad-words library will catch more
    const offensiveUsernames = [
      'damn123',
      'hell_user',
      // Add more test cases as needed, but be mindful of what you commit to version control
    ];

    offensiveUsernames.forEach(username => {
      const result = validateUsername(username);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Username contains inappropriate content');
    });
  });

  test('should handle empty or null usernames', () => {
    expect(validateUsername('').isValid).toBe(false);
    expect(validateUsername(null).isValid).toBe(false);
    expect(validateUsername(undefined).isValid).toBe(false);
  });

  test('should suggest alternative usernames', () => {
    const suggestions = suggestAlternativeUsernames('baduser');
    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);
    
    // All suggestions should be valid
    suggestions.forEach(suggestion => {
      const result = validateUsername(suggestion);
      expect(result.isValid).toBe(true);
    });
  });
});
