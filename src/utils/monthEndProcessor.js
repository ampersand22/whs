/**
 * Month-End Processing Utility
 * This would typically be implemented as a Firebase Cloud Function
 * but can be used for manual testing and development
 */

import { determineMonthlyWinner, getPreviousMonth } from '../firebase/monthlyScores';

/**
 * Process the end of month - determine winner for previous month
 * This should be called on the 1st of each month
 * @returns {Promise<Object|null>} Winner data or null if no scores
 */
export const processMonthEnd = async () => {
  try {
    console.log('🔄 Starting month-end processing...');
    
    const previousMonth = getPreviousMonth();
    console.log('📅 Processing month:', previousMonth);
    
    // Determine and save the winner for the previous month
    const winner = await determineMonthlyWinner(previousMonth);
    
    if (winner) {
      console.log('🏆 Monthly winner determined:', winner.displayName, 'with score:', winner.score);
      return winner;
    } else {
      console.log('📊 No scores found for month:', previousMonth);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error processing month end:', error);
    throw error;
  }
};

/**
 * Check if month-end processing is needed
 * @returns {boolean} True if processing is needed
 */
export const isMonthEndProcessingNeeded = () => {
  const now = new Date();
  const dayOfMonth = now.getDate();
  
  // Process on the 1st of the month
  return dayOfMonth === 1;
};

/**
 * Get the next scheduled processing date
 * @returns {Date} Next processing date
 */
export const getNextProcessingDate = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
};

/**
 * Manual trigger for testing purposes
 * Processes the previous month regardless of current date
 * @returns {Promise<Object|null>} Winner data or null
 */
export const manualMonthEndProcess = async () => {
  console.log('🔧 Manual month-end processing triggered...');
  return await processMonthEnd();
};
