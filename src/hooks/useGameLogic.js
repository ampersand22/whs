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
    setBoard(generateBoard());

    if (user) {
      try {
        const highScore = await getUserHighScore(user.id);
        setUserHighScore(highScore);
      } catch (error) {
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
  }, [showGameOverModal]);

  // Debug effect to log current state values
  useEffect(() => {
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
      }
    } else if (word.length >= 3) {
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
    
    // Set modal state first and ensure it's rendered before doing async operations
    setShowGameOverModal(true);
    setGameOverVisible(true);
    
    
    // Wait for the next tick to ensure state has been applied and modal is rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (user) {
      try {
        
        // Only use processGameCompletion since saveUserScore does the same thing
        const gameData = {
          score: score,
          timeLeft: timeLeft,
          wordCount: foundWords.length,
          wordsFound: foundWords,
          gameDuration: INITIAL_TIME - timeLeft,
        };

        const result = await processGameCompletion(gameData);

        if (result.success) {

          if (score > userHighScore) {
            setUserHighScore(score);
          }
        } else {
        }
      } catch (error) {
      }
    }
    
  };

  const restartGame = () => {
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
