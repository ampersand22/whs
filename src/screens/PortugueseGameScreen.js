import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LetterGrid from '../components/game/LetterGrid';
import WordPreview from '../components/game/WordPreview';
import GameHeader from '../components/game/GameHeader';
import GameControls from '../components/game/GameControls';
import GameOverModalNew from '../modals/GameOverModalNew';
import { generatePortugueseBoard } from '../utils/game/portBoardGenerator';
import { isValidPortugueseWord, getPortugueseWordCount } from '../utils/validation/PortugueseWordList';
import { getResponsiveDimensions } from '../constants/responsive';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PortugueseGameScreen = ({ navigation }) => {
  const dimensions = getResponsiveDimensions();
  const gridSize = dimensions.gridMaxWidth;

  // Game state
  const [testBoard, setTestBoard] = useState(() => generatePortugueseBoard());
  const [previewWord, setPreviewWord] = useState('');
  const [foundWords, setFoundWords] = useState([]);
  const [isTouching, setIsTouching] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [resetCount, setResetCount] = useState(0);
  const [gameOverModalVisible, setGameOverModalVisible] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && isGameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      // Game over - show modal
      setIsGameActive(false);
      setGameOverModalVisible(true);
    }
  }, [timeLeft, isGameActive]);

  const handleWordFormed = (word) => {
    if (!isGameActive) return; // Don't process words if game is over
    
    console.log('Word formed:', word);
    const isValid = isValidPortugueseWord(word);
    console.log('Is valid Portuguese word:', isValid);
    
    if (isValid && !foundWords.includes(word.toLowerCase())) {
      const newFoundWords = [...foundWords, word.toLowerCase()];
      setFoundWords(newFoundWords);
      
      // Simple scoring based on word length
      const points = word.length >= 5 ? 150 : word.length >= 4 ? 100 : 50;
      setScore(score + points);
    }
  };

  const handleResetBoard = () => {
    if (resetCount < 5 && isGameActive) {
      setTestBoard(generatePortugueseBoard());
      setResetCount(resetCount + 1);
      setPreviewWord('');
    }
  };

  const handleShowMenu = () => {
    // Menu functionality can be added here later
  };

  const handlePlayAgain = () => {
    // Reset all game state
    setTestBoard(generatePortugueseBoard());
    setScore(0);
    setTimeLeft(180);
    setResetCount(0);
    setFoundWords([]);
    setPreviewWord('');
    setGameOverModalVisible(false);
    setIsGameActive(true);
  };

  const handleMainMenu = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/background1.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView
          style={{ flex: 1 }}
          edges={['top', 'left', 'right', 'bottom']}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              paddingHorizontal: dimensions.containerPadding,
              paddingBottom: 8,
            }}
          >
            {/* Header */}
            <GameHeader
              score={score}
              timeLeft={timeLeft}
              resetCount={resetCount}
            />

            {/* Main Game Area */}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                paddingVertical: dimensions.sectionSpacing,
              }}
            >
              {/* Word Preview */}
              <View style={{ width: gridSize, marginBottom: 15 }}>
                <WordPreview
                  previewWord={previewWord}
                  resetCount={resetCount}
                  foundWords={foundWords}
                  isTouching={isTouching}
                />
              </View>

              {/* Letter Grid */}
              <View
                style={{
                  width: gridSize,
                  height: gridSize,
                  marginBottom: 20,
                }}
              >
                <LetterGrid
                  board={testBoard}
                  onWordFormed={handleWordFormed}
                  previewWord={previewWord}
                  setPreviewWord={setPreviewWord}
                  foundWords={foundWords}
                  setIsTouching={setIsTouching}
                />
              </View>

              {/* Game Controls */}
              <GameControls
                resetCount={resetCount}
                maxResets={5}
                onResetBoard={handleResetBoard}
                onShowMenu={handleShowMenu}
              />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Game Over Modal */}
      <GameOverModalNew
        visible={gameOverModalVisible}
        score={score}
        highScore={score} // For test, use current score as high score
        isNewHighScore={false}
        foundWords={foundWords}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleMainMenu}
        onShowFoundWords={() => {}} // Not implemented for test
      />
    </View>
  );
};

export default PortugueseGameScreen;
