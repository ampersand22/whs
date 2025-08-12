import { useState, useEffect, useRef } from 'react';
import { generateBoard } from '../utils/BoardGenerator';
import { isValidWord, isBonusWord } from '../utils/WordList';
import { getPointsForWord } from '../utils/scoringUtils';
import { saveUserScore, getUserHighScore } from '../utils/userScores';
import useUserStore from '../stores/userStore';

export const useGameLogic = () => {
  const { user, processGameCompletion } = useUserStore();
  const INITIAL_TIME = 180; // 3 minutes
  const MAX_RESETS = 5;

  // Game state
  const [board, setBoard] = useState(generateBoard());
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [foundWordsBoardNumbers, setFoundWordsBoardNumbers] = useState([]);
  const [resetCount, setResetCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [previewWord, setPreviewWord] = useState('');
  const [userHighScore, setUserHighScore] = useState(0);
  const [isWordRepeated, setIsWordRepeated] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false); // Simple boolean state

  // Initialize game
  const initializeGame = async () => {
    console.log('initializeGame called');
    console.trace('initializeGame call stack:');
    setBoard(generateBoard());

    if (user) {
      try {
        const highScore = await getUserHighScore(user.id);
        setUserHighScore(highScore);
        console.log(`User high score loaded: ${highScore}`);
      } catch (error) {
        console.error('Error loading user high score:', error);
        setUserHighScore(0);
      }
    }
  };

  // Game timer effect
  useEffect(() => {
    // Don't run timer if game is over
    if (gameOverVisible || showGameOverModal) {
      return;
    }

    if (timeLeft <= 0) {
      console.log('Timer hit 0, calling handleGameEnd');
      handleGameEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer is about to hit 0, don't decrement further
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOverVisible, showGameOverModal]);

  // Debug effect to track showGameOverModal changes
  useEffect(() => {
    console.log('showGameOverModal changed to:', showGameOverModal);
  }, [showGameOverModal]);

  // Debug effect to log current state values
  useEffect(() => {
    console.log('Current state - gameOverVisible:', gameOverVisible, 'showGameOverModal:', showGameOverModal);
  }, [gameOverVisible, showGameOverModal]);

  const handleWordFormed = (word, isRepeated) => {
    if (word.length >= 3 && isValidWord(word.toLowerCase())) {
      setIsWordRepeated(isRepeated);

      if (!foundWords.includes(word.toLowerCase())) {
        setFoundWords((prev) => [...prev, word.toLowerCase()]);
        setFoundWordsBoardNumbers((prev) => [...prev, resetCount]);

        let points = getPointsForWord(word, resetCount);

        if (isBonusWord(word.toLowerCase())) {
          points += 300;
        }

        setScore((prev) => prev + points);

        console.log(
          `"${word}" (${word.length} letters) on board ${
            resetCount + 1
          } = ${points} points`
        );
      }
    } else if (word.length >= 3) {
      console.log(`"${word}" is not a valid word`);
    }
  };

  const resetBoard = () => {
    if (resetCount < MAX_RESETS - 1) {
      setBoard(generateBoard());
      setResetCount((prev) => prev + 1);
      setPreviewWord('');
    }
  };

  const handleGameEnd = async () => {
    console.log('handleGameEnd called - setting showGameOverModal to true');
    console.log('Current showGameOverModal before setting:', showGameOverModal);
    
    // Set modal state first and ensure it's rendered before doing async operations
    setShowGameOverModal(true);
    setGameOverVisible(true);
    
    console.log('State setters called for showGameOverModal');
    
    // Wait for the next tick to ensure state has been applied and modal is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('After 100ms delay - modal should be visible now');
    
    if (user) {
      try {
        console.log('Starting game save process...');
        
        // Only use processGameCompletion since saveUserScore does the same thing
        const gameData = {
          score: score,
          timeLeft: timeLeft,
          wordCount: foundWords.length,
          wordsFound: foundWords,
          gameDuration: INITIAL_TIME - timeLeft,
        };

        console.log('Calling processGameCompletion...');
        const result = await processGameCompletion(gameData);
        console.log('processGameCompletion result:', result);

        if (result.success) {
          console.log('Game results saved successfully');

          if (score > userHighScore) {
            console.log('New high score! Updating from', userHighScore, 'to', score);
            setUserHighScore(score);
          }
        } else {
          console.log('Game results saved with issues:', result.error);
        }
      } catch (error) {
        console.error('Error saving game results:', error);
      }
    }
    
    console.log('handleGameEnd completed, modal should stay visible');
  };

  const restartGame = () => {
    console.log('restartGame called - resetting all game state');
    setResetCount(0);
    setScore(0);
    setFoundWords([]);
    setFoundWordsBoardNumbers([]);
    setTimeLeft(INITIAL_TIME);
    setPreviewWord('');
    setIsWordRepeated(false);
    setIsTouching(false);
    setGameOverVisible(false);
    setShowGameOverModal(false); // Reset modal state
    initializeGame();
  };

  // Temporary method for testing - manually end the timer
  const endTimer = () => {
    console.log('endTimer called - current timeLeft:', timeLeft);
    console.log('endTimer called - setting timeLeft to 0 and calling handleGameEnd directly');
    setTimeLeft(0);
    handleGameEnd(); // Call directly instead of relying on timer effect
  };

  return {
    // State
    board,
    score,
    foundWords,
    foundWordsBoardNumbers,
    resetCount,
    timeLeft,
    previewWord,
    userHighScore,
    isWordRepeated,
    isTouching,
    gameOverVisible,
    showGameOverModal, // Simple modal state
    
    // Actions
    handleWordFormed,
    resetBoard,
    handleGameEnd,
    restartGame,
    initializeGame,
    endTimer, // Temporary for testing
    setPreviewWord,
    setIsTouching,
    
    // Constants
    INITIAL_TIME,
    MAX_RESETS,
    
    // Computed
    isNewHighScore: score > userHighScore,
  };
};
