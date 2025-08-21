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
import GameOverModal from '../modals/GameOverModal';
import GameOverModalNew from '../modals/GameOverModalNew';
import GameMenuModal from '../modals/GameMenuModal';
import FoundWordsModal from '../modals/FoundWordsModal';


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
  const [foundWordsModalVisible, setFoundWordsModalVisible] = React.useState(false);
  const [gameOverModalVisible, setGameOverModalVisible] = React.useState(false);

  // Monitor game logic modal state and sync with local state
  React.useEffect(() => {
    if (gameLogic.showGameOverModal && !foundWordsModalVisible) {
      setGameOverModalVisible(true);
    } else {
      setGameOverModalVisible(false);
    }
  }, [gameLogic.showGameOverModal, foundWordsModalVisible]);

  // Initialize game on mount
  useEffect(() => {
    gameLogic.initializeGame();
  }, []);

  // Add navigation focus listener for debugging
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('GameScreen focused');
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log('GameScreen blurred - this might explain why modal disappears');
      console.log('Navigation blur event - something is navigating away from GameScreen');
    });

    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', (e) => {
      console.log('GameScreen beforeRemove event:', e.data.action);
      console.log('Something is trying to remove/navigate away from GameScreen');
    });

    return () => {
      unsubscribe();
      unsubscribeBlur();
      unsubscribeBeforeRemove();
    };
  }, [navigation]);

  // Monitor modal state changes
  useEffect(() => {
    console.log('GameScreen - showGameOverModal changed to:', gameLogic.showGameOverModal);
    if (gameLogic.showGameOverModal) {
      console.log('Modal should be visible now - checking if screen is still focused');
      
      // Add a longer delay to see if navigation happens during this time
      setTimeout(() => {
        console.log('After 2 seconds - modal should still be visible');
        console.log('Current modal state:', gameLogic.showGameOverModal);
      }, 2000);
    }
  }, [gameLogic.showGameOverModal]);

  // Add effect to monitor when component unmounts
  useEffect(() => {
    return () => {
      console.log('GameScreen component is unmounting - this explains why modal disappears');
    };
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
    console.log('goBackToStart called - this is what causes navigation to Start screen');
    console.log('Call stack:', new Error().stack);
    navigation.goBack();
  };

  // Menu modal handlers
  const handleShowMenu = () => {
    setMenuModalVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuModalVisible(false);
  };

  const handleRestartGame = async () => {
    setMenuModalVisible(false);
    

    
    gameLogic.restartGame();
  };

  const handleBackToMenu = async () => {
    console.log('handleBackToMenu called');
    setMenuModalVisible(false);
    

    
    console.log('handleBackToMenu: About to call goBackToStart');
    goBackToStart();
  };

  const currentBackgroundImage = getBackgroundImage(gameLogic.resetCount);

  // Debug: Log modal visibility state
  console.log('GameScreen render - showGameOverModal:', gameLogic.showGameOverModal, 'gameOverVisible:', gameLogic.gameOverVisible);

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

      {/* Game Over Modal - Full Featured Version */}
      <GameOverModalNew
        visible={gameOverModalVisible}
        score={gameLogic.score}
        highScore={gameLogic.userHighScore}
        isNewHighScore={gameLogic.isNewHighScore}
        foundWords={gameLogic.foundWords}
        onPlayAgain={async () => {
          console.log('Play Again pressed');
          setGameOverModalVisible(false);
          gameLogic.restartGame();
        }}
        onMainMenu={async () => {
          console.log('Main Menu pressed');
          setGameOverModalVisible(false);
          goBackToStart();
        }}
        onShowFoundWords={() => {
          console.log('Show Found Words pressed');
          console.log('GameScreen - foundWords:', gameLogic.foundWords);
          console.log('GameScreen - foundWordsBoardNumbers:', gameLogic.foundWordsBoardNumbers);
          console.log('GameScreen - score:', gameLogic.score);
          setGameOverModalVisible(false); // Close game over modal first
          setFoundWordsModalVisible(true); // Then show found words modal
        }}
      />

      {/* Found Words Modal */}
      <FoundWordsModal
        visible={foundWordsModalVisible}
        onClose={() => {
          console.log('Found Words modal closed');
          setFoundWordsModalVisible(false);
          setGameOverModalVisible(true); // Return to game over modal
        }}
        foundWords={gameLogic.foundWords}
        foundWordsBoardNumbers={gameLogic.foundWordsBoardNumbers}
        score={gameLogic.score}
      />

      {/* 
      Original Game Over Modal - Commented out for testing
      <GameOverModal
        visible={gameLogic.modalVisible}
        onClose={() => {
          // Modal should only close via Play Again or Back to Start buttons
          // This prevents accidental dismissal
        }}
        score={gameLogic.score}
        foundWords={gameLogic.foundWords}
        isNewHighScore={gameLogic.isNewHighScore}
        onPlayAgain={async () => {
          gameLogic.restartGame();
        }}
        onBackToStart={async () => {
          goBackToStart();
        }}
      />
      */}
    </View>
  );
}

export default GameScreen;
