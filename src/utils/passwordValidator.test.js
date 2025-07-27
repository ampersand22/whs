/**
 * Simple test file for password validator
 * Run this with: node passwordValidator.test.js
 */

const { validatePassword, calculatePasswordStrength } = require('./passwordValidator');

console.log('Testing Password Validator...\n');

// Test cases
const testPasswords = [
  '',
  '123',
  'password',
  'Password1',
  'Password1!',
  'MySecureP@ssw0rd123',
  'a'.repeat(130), // Too long
  'WeakPass1!',
  'VeryStr0ng!P@ssw0rd2024'
];

testPasswords.forEach((password, index) => {
  console.log(`Test ${index + 1}: "${password}"`);
  const result = validatePassword(password);
  console.log(`  Valid: ${result.isValid}`);
  console.log(`  Strength: ${result.strength}`);
  if (result.errors.length > 0) {
    console.log(`  Errors: ${result.errors.join(', ')}`);
  }
  console.log('');
});

console.log('Password Validator Tests Complete!');
