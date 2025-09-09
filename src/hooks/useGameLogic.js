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
    // Don't start timer if game is over
    if (gameOverVisible || showGameOverModal || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Timer reached 0, trigger game end
          setTimeout(() => handleGameEnd(), 0);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOverVisible, showGameOverModal]); // Remove timeLeft from dependencies

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
    // Prevent multiple calls
    if (gameOverVisible || showGameOverModal) {
      return;
    }
    
    // Set modal state first
    setShowGameOverModal(true);
    setGameOverVisible(true);
    
    // Ensure score is saved even if user is not authenticated
    if (user && score > 0) {
      try {
        const gameData = {
          score: score,
          timeLeft: timeLeft,
          wordCount: foundWords.length,
          wordsFound: foundWords,
          gameDuration: INITIAL_TIME - timeLeft,
        };

        console.log('Saving game score:', gameData);
        const result = await processGameCompletion(gameData);

        if (result.success) {
          console.log('Score saved successfully');
          if (score > userHighScore) {
            setUserHighScore(score);
          }
        } else {
          console.error('Failed to save score:', result.error);
        }
      } catch (error) {
        console.error('Error saving game score:', error);
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
    setShowGameOverModal,
    
    // Constants
    INITIAL_TIME,
    MAX_RESETS,
    
    // Computed
    isNewHighScore: score > userHighScore,
  };
};
