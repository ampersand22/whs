import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const GameControls = ({ 
  resetCount, 
  maxResets, 
  onResetBoard, 
  onShowMenu 
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' }}>
      <Button
        mode="contained"
        onPress={onResetBoard}
        disabled={resetCount >= maxResets - 1}
        buttonColor="#6200ea"
        textColor="white"
        data-testid="reset-board-button"
      >
        New Board ({resetCount + 1}/{maxResets})
      </Button>

      <Button
        mode="contained"
        onPress={onShowMenu}
        buttonColor="#6200ea"
        textColor="white"
        data-testid="menu-button"
      >
        Game Menu
      </Button>
    </View>
  );
};

export default GameControls;
