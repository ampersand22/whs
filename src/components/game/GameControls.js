import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { getTranslation } from '../../constants/translations';

const GameControls = ({ 
  resetCount, 
  maxResets, 
  onResetBoard, 
  onShowMenu,
  language = "english"
}) => {
  return (
    <View style={{ alignItems: 'center', gap: 10, marginBottom: 10 }}>
      {/* Main game controls row */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Button
          mode="contained"
          onPress={onResetBoard}
          disabled={resetCount >= maxResets - 1}
          buttonColor="#6200ea"
          textColor="white"
          data-testid="reset-board-button"
        >
          {getTranslation("newBoard", language)} ({resetCount + 1}/{maxResets})
        </Button>

        <Button
          mode="contained"
          onPress={onShowMenu}
          buttonColor="#6200ea"
          textColor="white"
          data-testid="menu-button"
        >
          {getTranslation("gameMenu", language)}
        </Button>
      </View>
    </View>
  );
};

export default GameControls;
