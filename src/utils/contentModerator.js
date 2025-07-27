/**
 * Content Moderation Utility
 * Filters usernames for offensive content - USERNAMES ONLY
 * Game content (words in gameplay) are NOT filtered to allow legitimate words
 */

import Filter from 'bad-words';

// Initialize the bad words filter for usernames
const usernameFilter = new Filter();

// Add additional offensive terms specific to usernames if needed
// usernameFilter.addWords('additional', 'terms', 'here');

// You can also remove words that might be legitimate in your game context
// but you want to keep restricted for usernames
// usernameFilter.removeWords('word1', 'word2');

// Leetspeak and character substitution mappings
const CHAR_SUBSTITUTIONS = {
  '@': 'a', '4': 'a', '3': 'e', '1': 'i', '!': 'i',
  '0': 'o', '5': 's', '7': 't', '+': 't', '$': 's'
};

/**
 * Normalize text by replacing common character substitutions
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
  let normalized = text.toLowerCase();
  
  // Replace character substitutions
  Object.keys(CHAR_SUBSTITUTIONS).forEach(char => {
    const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    normalized = normalized.replace(regex, CHAR_SUBSTITUTIONS[char]);
  });
  
  // Remove spaces, dots, underscores, dashes
  normalized = normalized.replace(/[\s._-]/g, '');
  
  return normalized;
}

/**
 * Check if username contains offensive content
 * @param {string} username - Username to check
 * @returns {Object} - Result object with isValid boolean and reason string
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { isValid: false, reason: 'Username is required' };
  }

  // Basic length and character validation
  if (username.length < 3) {
    return { isValid: false, reason: 'Username must be at least 3 characters long' };
  }

  if (username.length > 20) {
    return { isValid: false, reason: 'Username must be 20 characters or less' };
  }

  // Check for valid characters only (letters, numbers, underscores, dashes)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, reason: 'Username can only contain letters, numbers, underscores, and dashes' };
  }

  // Use bad-words library to check for offensive content
  if (usernameFilter.isProfane(username)) {
    return { isValid: false, reason: 'Username contains inappropriate content' };
  }

  // Additional check for leetspeak and character substitutions
  const normalizedUsername = normalizeText(username);
  if (usernameFilter.isProfane(normalizedUsername)) {
    return { isValid: false, reason: 'Username contains inappropriate content' };
  }
  
  return { isValid: true, reason: null };
}

/**
 * Check for offensive character sequences and combinations
 * @param {string} text - Normalized text to check
 * @returns {boolean} - True if offensive content found
 */
function containsOffensiveSequence(text) {
  // Additional custom checks can be added here if needed
  // For now, we rely primarily on the bad-words library
  return false;
}

/**
 * Suggest alternative usernames if the original is rejected
 * @param {string} originalUsername - The rejected username
 * @returns {Array} - Array of suggested alternative usernames
 */
export function suggestAlternativeUsernames(originalUsername) {
  const suggestions = [];
  const baseUsername = originalUsername.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
  
  // Generate some alternatives
  for (let i = 1; i <= 3; i++) {
    suggestions.push(`${baseUsername}${Math.floor(Math.random() * 1000)}`);
    suggestions.push(`${baseUsername}_${i}`);
  }
  
  // Filter suggestions to ensure they're also valid
  return suggestions.filter(suggestion => validateUsername(suggestion).isValid);
}

/**
 * Check if username is available (you'll need to implement this with your Firebase)
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} - True if available
 */
export async function isUsernameAvailable(username) {
  // TODO: Implement Firebase check for username availability
  // This would query your Firebase database to see if the username is already taken
  return true; // Placeholder
}
