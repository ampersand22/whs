import React from 'react';
import { View, Text } from 'react-native';
import { isValidWord } from '../utils/WordList';
import { getResponsiveDimensions, isTablet } from '../utils/responsive';

const WordPreview = ({ previewWord, resetCount = 0, foundWords = [], isTouching = false }) => {
  const dimensions = getResponsiveDimensions();
  
  // Check if current preview word is valid
  const isValid =
    previewWord.length >= 3 && isValidWord(previewWord.toLowerCase());
  const isRepeated = 
    previewWord.length >= 3 && foundWords.includes(previewWord.toLowerCase());

  // Determine display color
  let textColor = '#333'; // Default black while forming

  if (previewWord.length >= 3) {
    if (isTouching) {
      textColor = '#333'; // Black while touching
    } else if (isRepeated) {
      textColor = '#ff0000'; // Red for repeated words
    } else if (isValid) {
      textColor = '#4CAF50'; // Green for valid new words
    } else {
      textColor = '#f44336'; // Red for invalid words
    }
  }

  return (
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: isTablet() ? 12 : 10,
        padding: dimensions.containerPadding,
        marginBottom: 10,
        minHeight: isTablet() ? 60 : 50,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      data-testid="word-preview"
    >
      <Text style={{ 
        fontSize: dimensions.subtitleFontSize, 
        fontWeight: 'bold', 
        color: textColor 
      }}>
        {previewWord || ''}
      </Text>
    </View>
  );
};

export default WordPreview;
