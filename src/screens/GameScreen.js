import React, { useEffect, useCallback } from "react";
import { View, ImageBackground, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Custom hooks
import { useGameLogic } from "../hooks/useGameLogic";
import { useGameAnimations } from "../hooks/useGameAnimations";

// Components
import LetterGrid from "../components/game/LetterGrid";
import GameHeader from "../components/game/GameHeader";
import WordPreview from "../components/game/WordPreview";
import GameControls from "../components/game/GameControls";
import GameOverModalNew from "../modals/GameOverModalNew";
import GameMenuModal from "../modals/GameMenuModal";
import FoundWordsModal from "../modals/FoundWordsModal";
import BannerAdComponent from "../components/ads/BannerAdComponent";

// Utils
import { getResponsiveDimensions } from "../constants/responsive";

// Background image utility
const getBackgroundImage = (boardNumber) => {
  const backgrounds = [
    require("../../assets/background1.png"),
    require("../../assets/background2.png"),
    require("../../assets/background3.jpg"),
    require("../../assets/background4.png"),
    require("../../assets/background5.png"),
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
  const [foundWordsModalVisible, setFoundWordsModalVisible] =
    React.useState(false);
  const [gameOverModalVisible, setGameOverModalVisible] = React.useState(false);

  // Monitor game logic modal state and sync with local state
  React.useEffect(() => {
    const shouldShowModal =
      gameLogic.showGameOverModal && !foundWordsModalVisible;
    if (shouldShowModal !== gameOverModalVisible) {
      setGameOverModalVisible(shouldShowModal);
    }
  }, [
    gameLogic.showGameOverModal,
    foundWordsModalVisible,
    gameOverModalVisible,
  ]);

  // Initialize game on mount
  useEffect(() => {
    gameLogic.initializeGame();
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (gameOverModalVisible || foundWordsModalVisible) {
        return false; // Let default behavior handle it in modals
      }
      handleShowMenu(); // Show menu instead of navigating away
      return true; // Prevent default back behavior
    });
    return () => backHandler.remove();
  }, [gameOverModalVisible, foundWordsModalVisible]);

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

  const goBackToStart = useCallback(() => {
    try {
      navigation.navigate("Start");
    } catch (error) {
      try {
        navigation.goBack();
      } catch (fallbackError) {
        // Navigation failed — app may be in an unexpected state
      }
    }
  }, [navigation]);

  // Menu modal handlers
  const handleShowMenu = () => {
    setMenuModalVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuModalVisible(false);
  };

  const handleRestartGame = useCallback(async () => {
    setMenuModalVisible(false);
    gameLogic.restartGame();
  }, [gameLogic]);

  const handleBackToMenu = useCallback(async () => {
    setMenuModalVisible(false);
    goBackToStart();
  }, [goBackToStart]);

  const currentBackgroundImage = getBackgroundImage(gameLogic.resetCount);

  // Render main game screen
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={currentBackgroundImage}
        style={{ flex: 1 }}
        resizeMode="cover"
        data-testid="game-background"
      >
        <SafeAreaView
          style={{ flex: 1 }}
          edges={["top", "left", "right", "bottom"]}
          data-testid="game-safe-area"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingHorizontal: dimensions.containerPadding,
              paddingBottom: 8,
            }}
            data-testid="game-main-container"
          >
            {/* Header */}
            <GameHeader
              score={gameLogic.score}
              timeLeft={gameLogic.timeLeft}
              resetCount={gameLogic.resetCount}
            />

            {/* Main Game Area */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                paddingVertical: dimensions.sectionSpacing,
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

      {/* Banner Ad */}
      <BannerAdComponent />

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
          setGameOverModalVisible(false);
          gameLogic.restartGame();
        }}
        onMainMenu={() => {
          setGameOverModalVisible(false);
          gameLogic.setShowGameOverModal(false);
          setTimeout(() => {
            goBackToStart();
          }, 100);
        }}
        onShowFoundWords={() => {
          setGameOverModalVisible(false); // Close game over modal first
          setFoundWordsModalVisible(true); // Then show found words modal
        }}
      />

      {/* Found Words Modal */}
      <FoundWordsModal
        visible={foundWordsModalVisible}
        onClose={() => {
          setFoundWordsModalVisible(false);
          setGameOverModalVisible(true); // Return to game over modal
        }}
        foundWords={gameLogic.foundWords}
        foundWordsBoardNumbers={gameLogic.foundWordsBoardNumbers}
        score={gameLogic.score}
      />
    </View>
  );
}

export default GameScreen;
