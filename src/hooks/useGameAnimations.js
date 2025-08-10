import { useRef } from 'react';
import { Animated } from 'react-native';

export const useGameAnimations = () => {
  const wordAnim = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const wordsButtonScale = useRef(new Animated.Value(1)).current;

  const animateScore = () => {
    Animated.sequence([
      Animated.timing(scoreAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateWord = () => {
    Animated.sequence([
      Animated.timing(wordAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wordAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateWordsButton = () => {
    Animated.sequence([
      Animated.timing(wordsButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(wordsButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    wordAnim,
    scoreAnim,
    wordsButtonScale,
    animateScore,
    animateWord,
    animateWordsButton,
  };
};
