import { supabase } from '../config/supabase';

/**
 * Save a user's game score to Supabase
 * @param {Object} user - The authenticated user object
 * @param {number} score - The score to save
 * @param {number} timeLeft - Time remaining when game ended
 * @param {Array} foundWords - Array of words found during the game
 * @param {number} gameDuration - Total game duration in seconds
 * @returns {Promise} - Promise that resolves when score is saved
 */
export const saveUserScore = async (user, score, timeLeft, foundWords, gameDuration = 300) => {
  if (!user) {
    return null;
  }

  try {
    // Get user's display name from whs-users table
    const { data: userData, error: userError } = await supabase
      .from('whs-users')
      .select('display_name')
      .eq('id', user.id)
      .single();

    if (userError) {
      return null;
    }

    const displayName = userData?.display_name || user.email?.split('@')[0] || 'Anonymous Player';

    // Use the stored procedure to process game completion
    const { data, error } = await supabase
      .rpc('process_game_completion', {
        p_user_id: user.id,
        p_display_name: displayName,
        p_score: score,
        p_time_left: timeLeft,
        p_word_count: foundWords.length,
        p_words_found: foundWords,
        p_game_duration: gameDuration
      });

    if (error) {
      return null;
    }

    return data?.[0]?.game_score_id || null;
  } catch (error) {
    return null;
  }
};

/**
 * Get a user's high score
 * @param {string} userId - The user ID
 * @returns {Promise<number>} - Promise that resolves to the user's high score
 */
export const getUserHighScore = async (userId) => {
  if (!userId) {
    return 0;
  }

  try {
    const { data, error } = await supabase
      .from('whs-users')
      .select('high_score')
      .eq('id', userId)
      .single();
    
    if (error) {
      return 0;
    }

    return data?.high_score || 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Get a user's recent scores
 * @param {string} userId - The user ID
 * @param {number} limit - Maximum number of scores to retrieve
 * @returns {Promise<Array>} - Promise that resolves to the user's recent scores
 */
export const getUserRecentScores = async (userId, limit = 10) => {
  if (!userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('whs-game_scores')
      .select('score, time_left, word_count, words_found, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get the monthly leaderboard
 * @param {number} year - Year for the leaderboard
 * @param {number} month - Month for the leaderboard (1-12)
 * @param {number} limit - Maximum number of entries to retrieve
 * @returns {Promise<Array>} - Promise that resolves to the leaderboard entries
 */
export const getMonthlyLeaderboard = async (year, month, limit = 10) => {
  try {
    const { data, error } = await supabase
      .rpc('get_enhanced_leaderboard', {
        p_year: year,
        p_month: month,
        p_limit: limit
      });
    
    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get current month's leaderboard
 * @param {number} limit - Maximum number of entries to retrieve
 * @returns {Promise<Array>} - Promise that resolves to the current leaderboard entries
 */
export const getCurrentLeaderboard = async (limit = 10) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  return getMonthlyLeaderboard(currentYear, currentMonth, limit);
};

/**
 * Get user's monthly rank
 * @param {string} userId - The user ID
 * @param {number} year - Year for the ranking
 * @param {number} month - Month for the ranking (1-12)
 * @returns {Promise<number|null>} - Promise that resolves to the user's rank or null
 */
export const getUserMonthlyRank = async (userId, year, month) => {
  if (!userId) {
    return null;
  }

  try {
    const leaderboard = await getMonthlyLeaderboard(year, month, 1000);
    const userEntry = leaderboard.find(entry => entry.user_id === userId);
    
    return userEntry?.rank || null;
  } catch (error) {
    return null;
  }
};

/**
 * Get user's stars/achievements
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Promise that resolves to the user's stars
 */
export const getUserStars = async (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('whs-user_stars')
      .select('year, month, star_type, awarded_at')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    
    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
};
