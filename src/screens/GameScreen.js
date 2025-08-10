import React, { useEffect, useState } from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// Custom hooks
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameAnimations } from '../hooks/useGameAnimations';

// Components
import LetterGrid from '../components/LetterGrid';
import GameHeader from '../components/GameHeader';
import WordPreview from '../components/WordPreview';
import GameControls from '../components/GameControls';
import GameOverScreen from '../components/GameOverScreen';
import GameMenuModal from '../modals/GameMenuModal';

// Utils
import { getResponsiveDimensions } from '../utils/responsive';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Background image utility
const getBackgroundImage = (boardNumber) => {
  const backgrounds = [
    require('../../assets/background1.png'),
    require('../../assets/background2.png'),
    require('../../assets/background3.jpg'),
    require('../../assets/background4.png'),
    require('../../assets/background5.png'),
  ];
  
  const index = Math.min(boardNumber, backgrounds.length - 1);
  return backgrounds[index];
};

function GameScreen() {
  const navigation = useNavigation();
  const dimensions = getResponsiveDimensions();
  const gridSize = dimensions.gridMaxWidth;

  // Custom hooks
  const gameLogic = useGameLogic();
  const animations = useGameAnimations();

  // Local state for menu modal
  const [menuModalVisible, setMenuModalVisible] = React.useState(false);

  // Initialize game on mount
  useEffect(() => {
    gameLogic.initializeGame();
  }, []);

  // Enhanced word formed handler with animations
  const handleWordFormed = (word, isRepeated) => {
    gameLogic.handleWordFormed(word, isRepeated);
    if (word.length >= 3) {
      animations.animateWord();
      if (!isRepeated) {
        animations.animateScore();
      }
    }
  };

  const goBackToStart = () => {
    navigation.goBack();
  };

  // Menu modal handlers
  const handleShowMenu = () => {
    setMenuModalVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuModalVisible(false);
  };

  const handleRestartGame = () => {
    setMenuModalVisible(false);
    gameLogic.restartGame();
  };

  const handleBackToMenu = () => {
    setMenuModalVisible(false);
    goBackToStart();
  };

  const currentBackgroundImage = getBackgroundImage(gameLogic.resetCount);

  // Render game over screen
  if (gameLogic.gameOverVisible) {
    return (
      <GameOverScreen
        score={gameLogic.score}
        foundWords={gameLogic.foundWords}
        isNewHighScore={gameLogic.isNewHighScore}
        onPlayAgain={gameLogic.restartGame}
        onBackToStart={goBackToStart}
      />
    );
  }

  // Render main game screen
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={currentBackgroundImage}
        style={{
          flex: 1,
          width: screenWidth,
          height: screenHeight,
          position: 'absolute',
          top: 0,
          left: 0
        }}
        resizeMode="cover"
        data-testid="game-background"
      >
        <SafeAreaView
          style={{ flex: 1, width: '100%' }}
          edges={['top', 'left', 'right']}
          data-testid="game-safe-area"
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingBottom: 8,
            }}
            data-testid="game-main-container"
          >
            {/* Header */}
            <View style={{ width: '100%' }}>
              <GameHeader
                score={gameLogic.score}
                timeLeft={gameLogic.timeLeft}
                resetCount={gameLogic.resetCount}
              />
            </View>

            {/* Main Game Area */}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: 0,
              }}
            >
              {/* Word Preview */}
              <View style={{ width: gridSize, marginBottom: 15 }}>
                <WordPreview
                  previewWord={gameLogic.previewWord}
                  resetCount={gameLogic.resetCount}
                  foundWords={gameLogic.foundWords}
                  isTouching={gameLogic.isTouching}
                />
              </View>

              {/* Letter Grid */}
              <View
                style={{
                  width: gridSize,
                  height: gridSize,
                  marginBottom: 20,
                }}
                data-testid="letter-grid-container"
              >
                <LetterGrid
                  board={gameLogic.board}
                  onWordFormed={handleWordFormed}
                  previewWord={gameLogic.previewWord}
                  setPreviewWord={gameLogic.setPreviewWord}
                  foundWords={gameLogic.foundWords}
                  setIsTouching={gameLogic.setIsTouching}
                  data-testid="letter-grid"
                />
              </View>

              {/* Game Controls */}
              <GameControls
                resetCount={gameLogic.resetCount}
                maxResets={gameLogic.MAX_RESETS}
                onResetBoard={gameLogic.resetBoard}
                onShowMenu={handleShowMenu}
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Game Menu Modal */}
      <GameMenuModal
        visible={menuModalVisible}
        onClose={handleCloseMenu}
        onRestart={handleRestartGame}
        onBackToMenu={handleBackToMenu}
      />
    </View>
  );
}

export default GameScreen;
