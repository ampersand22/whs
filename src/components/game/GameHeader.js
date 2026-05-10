import React from 'react';
import { View, Text } from 'react-native';
import { getResponsiveDimensions, isTablet } from '../../constants/responsive';
import { getTranslation } from '../../constants/translations';

const GameHeader = ({ score, timeLeft, resetCount, language = "english" }) => {
  const dimensions = getResponsiveDimensions();
  
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: dimensions.containerPadding / 2,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: isTablet() ? 12 : 10,
        marginVertical: 5,
        marginTop: 15,
      }}
      data-testid="grid-header"
    >
      {/* First row: Score and Board */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      }}>
        <Text
          style={{
            color: "white",
            fontSize: dimensions.subtitleFontSize,
            fontWeight: "bold",
          }}
          data-testid="score-display"
        >
          {getTranslation("score", language)}: {score}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: dimensions.subtitleFontSize,
            fontWeight: "bold",
          }}
          data-testid="board-display"
        >
          {getTranslation("board", language)}: {resetCount + 1}/5
        </Text>
      </View>
      
      {/* Second row: Timer (left aligned) */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}>
        <Text
          style={{
            color: "white",
            fontSize: dimensions.subtitleFontSize,
            fontWeight: "bold",
          }}
          data-testid="time-display"
        >
          {getTranslation("time", language)}: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};

export default GameHeader;
