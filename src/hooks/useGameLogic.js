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

  // Initialize game
  const initializeGame = async () => {
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
    if (timeLeft <= 0) {
      handleGameEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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
    setGameOverVisible(true);

    if (user) {
      try {
        const scoreId = await saveUserScore(
          user,
          score,
          timeLeft,
          foundWords,
          INITIAL_TIME - timeLeft
        );

        const gameData = {
          score: score,
          timeLeft: timeLeft,
          wordCount: foundWords.length,
          wordsFound: foundWords,
          gameDuration: INITIAL_TIME - timeLeft,
        };

        const result = await processGameCompletion(gameData);

        if (scoreId && result.success) {
          console.log('Game results saved successfully via both methods');

          if (score > userHighScore) {
            setUserHighScore(score);
          }
        } else {
          console.log('Game results saved with some issues');
        }
      } catch (error) {
        console.error('Error saving game results:', error);
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
    
    // Actions
    handleWordFormed,
    resetBoard,
    handleGameEnd,
    restartGame,
    initializeGame,
    setPreviewWord,
    setIsTouching,
    
    // Constants
    INITIAL_TIME,
    MAX_RESETS,
    
    // Computed
    isNewHighScore: score > userHighScore,
  };
};
