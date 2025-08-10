import React from 'react';
import { View, Text } from 'react-native';

const FoundWordsList = ({ foundWords, gridSize }) => {
  if (foundWords.length === 0) return null;

  return (
    <View
      style={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 10,
        padding: 10,
        maxWidth: gridSize,
      }}
      data-testid="found-words-container"
    >
      <Text
        style={{ fontWeight: 'bold', marginBottom: 5 }}
        data-testid="found-words-title"
      >
        Found Words ({foundWords.length}):
      </Text>
      <Text data-testid="found-words-list">
        {foundWords.map((word) => word.toUpperCase()).join(', ')}
      </Text>
    </View>
  );
};

export default FoundWordsList;
