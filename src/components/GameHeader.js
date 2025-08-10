import React from 'react';
import { View, Text } from 'react-native';
import { getResponsiveDimensions, isTablet } from '../utils/responsive';

const GameHeader = ({ score, timeLeft, resetCount }) => {
  const dimensions = getResponsiveDimensions();
  
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: dimensions.containerPadding,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: isTablet() ? 12 : 10,
        margin: 10,
      }}
      data-testid="grid-header"
    >
      <Text
        style={{ 
          color: 'white', 
          fontSize: dimensions.subtitleFontSize, 
          fontWeight: 'bold' 
        }}
        data-testid="score-display"
      >
        Score: {score}
      </Text>
      <Text
        style={{ 
          color: 'white', 
          fontSize: dimensions.subtitleFontSize, 
          fontWeight: 'bold' 
        }}
        data-testid="time-display"
      >
        Time: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </Text>
      <Text
        style={{ 
          color: 'white', 
          fontSize: dimensions.subtitleFontSize, 
          fontWeight: 'bold' 
        }}
        data-testid="board-display"
      >
        Board: {resetCount + 1}/5
      </Text>
    </View>
  );
};

export default GameHeader;
