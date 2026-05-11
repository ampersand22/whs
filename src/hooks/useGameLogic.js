import { useState, useEffect, useRef } from 'react';
import { generateBoard } from '../utils/game/BoardGenerator';
import { isValidWord, isBonusWord } from '../utils/validation/WordList';
import { getPointsForWord } from '../utils/scoring/scoringUtils';
import { getUserHighScore } from '../services/userService';
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
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  // Timer refs to prevent Android issues
  const timerRef = useRef(null);
  const gameEndedRef = useRef(false);
  
  // Refs to hold current state values for use in timer callbacks (avoids stale closures)
  const scoreRef = useRef(score);
  const foundWordsRef = useRef(foundWords);
  const timeLeftRef = useRef(timeLeft);
  const userHighScoreRef = useRef(userHighScore);

  // Keep refs in sync with state
  scoreRef.current = score;
  foundWordsRef.current = foundWords;
  timeLeftRef.current = timeLeft;
  userHighScoreRef.current = userHighScore;

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

  // Game timer effect - robust implementation for Android
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Don't start timer if game is over
    if (gameOverVisible || showGameOverModal || gameEndedRef.current) {
      return;
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 || gameEndedRef.current) {
          // Game should end
          if (!gameEndedRef.current) {
            setTimeout(() => handleGameEnd(), 100);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameOverVisible, showGameOverModal]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
    // Prevent multiple calls using ref (state may be stale in timer callback)
    if (gameEndedRef.current) {
      return;
    }
    
    gameEndedRef.current = true;
    
    // Clear timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Set modal state
    setShowGameOverModal(true);
    setGameOverVisible(true);
    
    // Read current values from refs (avoids stale closure)
    const currentScore = scoreRef.current;
    const currentFoundWords = foundWordsRef.current;
    const currentTimeLeft = timeLeftRef.current;
    const currentHighScore = userHighScoreRef.current;
    
    // Save score
    if (user && currentScore > 0) {
      try {
        const gameData = {
          score: currentScore,
          timeLeft: currentTimeLeft,
          wordCount: currentFoundWords.length,
          wordsFound: currentFoundWords,
          gameDuration: INITIAL_TIME - currentTimeLeft,
        };

        console.log('[DEBUG] Saving game score:', JSON.stringify(gameData));
        const result = await processGameCompletion(gameData);
        console.log('[DEBUG] processGameCompletion result:', JSON.stringify(result));

        if (result.success) {
          if (currentScore > currentHighScore) {
            setUserHighScore(currentScore);
          }
        }
      } catch (error) {
        console.log('[DEBUG] Error saving game score:', error.message);
      }
    } else {
      console.log('[DEBUG] Skipping score save - user:', !!user, 'score:', currentScore);
    }
  };

  const restartGame = () => {
    // Clear timer and reset refs
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    gameEndedRef.current = false;
    
    setResetCount(0);
    setScore(0);
    setFoundWords([]);
    setFoundWordsBoardNumbers([]);
    setTimeLeft(INITIAL_TIME);
    setPreviewWord('');
    setIsWordRepeated(false);
    setIsTouching(false);
    setGameOverVisible(false);
    setShowGameOverModal(false);
    initializeGame();
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
    showGameOverModal,
    
    // Actions
    handleWordFormed,
    resetBoard,
    handleGameEnd,
    restartGame,
    initializeGame,
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
