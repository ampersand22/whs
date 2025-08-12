import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const GameControls = ({ 
  resetCount, 
  maxResets, 
  onResetBoard, 
  onShowMenu,
  onEndTimer // Temporary prop for testing
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

      {/* Temporary testing button */}
      {onEndTimer && (
        <Button
          mode="contained"
          onPress={onEndTimer}
          buttonColor="#ff4444"
          textColor="white"
          style={{ marginTop: 5 }}
          data-testid="end-timer-button"
        >
          🚨 End Timer (TEST)
        </Button>
      )}
    </View>
  );
};

export default GameControls;
