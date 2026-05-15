/**
 * Validate a display name
 * @param {string} name - The display name to validate
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateDisplayName = (name) => {
  const trimmed = name?.trim();

  if (!trimmed || trimmed.length === 0) {
    return { valid: false, error: 'Display name cannot be empty.' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Display name must be at least 3 characters.' };
  }

  if (trimmed.length > 20) {
    return { valid: false, error: 'Display name must be 20 characters or less.' };
  }

  if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmed)) {
    return { valid: false, error: 'Display name can only contain letters, numbers, spaces, hyphens, and underscores.' };
  }

  return { valid: true, error: null };
};
