/**
 * Password validation utility
 * Provides comprehensive password validation with customizable rules
 */

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
};

export const SPECIAL_CHARACTERS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Validates a password against security requirements
 * @param {string} password - The password to validate
 * @param {object} requirements - Custom requirements (optional)
 * @returns {object} - Validation result with isValid boolean and errors array
 */
export const validatePassword = (password, requirements = PASSWORD_REQUIREMENTS) => {
  const errors = [];
  
  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 'none'
    };
  }

  // Check minimum length
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  }

  // Check maximum length
  if (password.length > requirements.maxLength) {
    errors.push(`Password must be no more than ${requirements.maxLength} characters long`);
  }

  // Check for uppercase letters
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letters
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (requirements.requireSpecialChars) {
    const hasSpecialChar = SPECIAL_CHARACTERS.split('').some(char => password.includes(char));
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }
  }

  // Check for common weak patterns
  const weakPatterns = [
    /(.)\1{2,}/, // Three or more repeated characters
    /123456|654321|abcdef|qwerty|password|admin/i, // Common sequences
  ];

  weakPatterns.forEach(pattern => {
    if (pattern.test(password)) {
      errors.push('Password contains common weak patterns');
    }
  });

  const strength = calculatePasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

/**
 * Calculates password strength score
 * @param {string} password - The password to analyze
 * @returns {string} - Strength level: 'weak', 'fair', 'good', 'strong'
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 'none';
  
  let score = 0;
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (new RegExp(`[${SPECIAL_CHARACTERS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) score += 1;
  
  // Complexity bonus
  if (password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
    score += 1;
  }
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'fair';
  if (score <= 6) return 'good';
  return 'strong';
};

/**
 * Gets password strength color for UI display
 * @param {string} strength - The strength level
 * @returns {string} - Color code
 */
export const getStrengthColor = (strength) => {
  switch (strength) {
    case 'weak': return '#ff4444';
    case 'fair': return '#ff8800';
    case 'good': return '#44aa44';
    case 'strong': return '#00aa00';
    default: return '#cccccc';
  }
};

/**
 * Generates password suggestions based on validation errors
 * @param {array} errors - Array of validation errors
 * @returns {array} - Array of helpful suggestions
 */
export const getPasswordSuggestions = (errors) => {
  const suggestions = [];
  
  if (errors.some(error => error.includes('characters long'))) {
    suggestions.push('Use a longer password with at least 8 characters');
  }
  
  if (errors.some(error => error.includes('uppercase'))) {
    suggestions.push('Add at least one uppercase letter (A-Z)');
  }
  
  if (errors.some(error => error.includes('lowercase'))) {
    suggestions.push('Add at least one lowercase letter (a-z)');
  }
  
  if (errors.some(error => error.includes('number'))) {
    suggestions.push('Include at least one number (0-9)');
  }
  
  if (errors.some(error => error.includes('special character'))) {
    suggestions.push('Add a special character like !@#$%^&*');
  }
  
  if (errors.some(error => error.includes('weak patterns'))) {
    suggestions.push('Avoid common patterns like "123456" or repeated characters');
  }
  
  return suggestions;
};
