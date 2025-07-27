import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useUserStore from '../stores/userStore';

// Import the actual components and utilities
import LetterGrid from "../components/LetterGrid";
import { generateBoard } from "../utils/BoardGenerator";
import { isValidWord, isBonusWord } from "../utils/WordList";
import { getPointsForWord, getScoringDescription } from "../utils/scoringUtils";
import { saveUserScore, getUserHighScore } from "../utils/userScores";

// Placeholder imports - these components need to be created or imported
// import GridHeader from "../components/GridHeader";
// import WordDisplay from "../components/WordDisplay";
// import { WordProvider } from "../context/WordContext";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Placeholder components until real ones are available
const ScoringDisplay = ({ resetCount }) => (
  <View 
    style={{ 
      backgroundColor: 'rgba(255,255,255,0.8)', 
      borderRadius: 8, 
      padding: 8, 
      margin: 10,
      alignItems: 'center'
    }}
    data-testid="scoring-display"
  >
    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
      {getScoringDescription(resetCount)}
    </Text>
    <Text style={{ fontSize: 10, color: '#666' }}>
      3-4 letters: {getPointsForWord('abc', resetCount)}pts • 5 letters: {getPointsForWord('abcde', resetCount)}pts • 6+ letters: {getPointsForWord('abcdef', resetCount)}pts
    </Text>
    <Text style={{ fontSize: 10, color: '#FF6B35', fontWeight: 'bold' }}>
      Bonus words: +300 points!
    </Text>
  </View>
);

const PlaceholderGridHeader = ({ score, timeLeft, resetCount }) => (
  <View 
    style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 15,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 10,
      margin: 10
    }}
    data-testid="grid-header"
  >
    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} data-testid="score-display">
      Score: {score}
    </Text>
    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} data-testid="time-display">
      Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
    </Text>
    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }} data-testid="board-display">
      Board: {resetCount + 1}/5
    </Text>
  </View>
);

const PlaceholderWordDisplay = ({ previewWord }) => {
  // Check if current preview word is valid
  const isValid = previewWord.length >= 3 && isValidWord(previewWord.toLowerCase());
  const isBonus = previewWord.length >= 3 && isBonusWord(previewWord.toLowerCase());
  
  // Determine display color
  let textColor = '#333';
  
  if (previewWord.length >= 3) {
    if (isValid) {
      textColor = '#4CAF50'; // Green for valid words (no special color for bonus)
    } else {
      textColor = '#f44336'; // Red for invalid
    }
  }

  // Calculate total points (including bonus silently)
  let totalPoints = 0;
  if (previewWord.length >= 3 && isValid) {
    totalPoints = getPointsForWord(previewWord, 0);
    if (isBonus) {
      totalPoints += 300; // Add bonus points silently
    }
  }

  return (
    <View 
      style={{ 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        borderRadius: 10, 
        padding: 15, 
        marginBottom: 10,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      data-testid="word-display"
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>
        {previewWord || ''}
      </Text>
      {previewWord.length >= 3 && isValid && (
        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
          {totalPoints} points
        </Text>
      )}
    </View>
  );
};

export default function GameScreen() {
  const navigation = useNavigation();
  const { user, processGameCompletion } = useUserStore();
  const INITIAL_TIME = 180; // 3 minutes

  // Game state
  const [board, setBoard] = useState(generateBoard()); // Use actual board generator
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [foundWordsBoardNumbers, setFoundWordsBoardNumbers] = useState([]);
  const [resetCount, setResetCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [previewWord, setPreviewWord] = useState("");
  const [userHighScore, setUserHighScore] = useState(0);
  const [isWordRepeated, setIsWordRepeated] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);

  // Animation refs
  const wordAnim = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const wordsButtonScale = useRef(new Animated.Value(1)).current;

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setBoard(generateBoard()); // Generate 5x5 board
    
    // Load user's high score from database
    if (user) {
      try {
        const highScore = await getUserHighScore(user.id);
        setUserHighScore(highScore);
        console.log(`User high score loaded: ${highScore}`);
      } catch (error) {
        console.error('Error loading user high score:', error);
        setUserHighScore(0);
      }
    }
  };

  // Game timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleGameEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleWordFormed = (word, isRepeated) => {
    // Validate word length and check if it's a valid word
    if (word.length >= 3 && isValidWord(word.toLowerCase())) {
      setIsWordRepeated(isRepeated);

      if (!foundWords.includes(word.toLowerCase())) {
        // Add word to found words list (store in lowercase for consistency)
        setFoundWords((prev) => [...prev, word.toLowerCase()]);
        setFoundWordsBoardNumbers((prev) => [...prev, resetCount]);

        // Calculate points using advanced scoring system
        let points = getPointsForWord(word, resetCount);
        
        // Check if it's a bonus word and add bonus points (silently)
        if (isBonusWord(word.toLowerCase())) {
          points += 300; // Bonus word extra points (no text/acknowledgment)
        }
        
        setScore((prev) => prev + points);

        console.log(`"${word}" (${word.length} letters) on board ${resetCount + 1} = ${points} points`);

        // Animate score
        Animated.sequence([
          Animated.timing(scoreAnim, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scoreAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else if (word.length >= 3) {
      // Word is long enough but not valid
      console.log(`"${word}" is not a valid word`);
    }
  };

  const MAX_RESETS = 5;

  const resetBoard = () => {
    if (resetCount < MAX_RESETS - 1) {
      setBoard(generateBoard()); // Generate new 5x5 board
      setResetCount((prev) => prev + 1);
      setPreviewWord("");
    }
  };

  const handleGameEnd = async () => {
    setGameOverVisible(true);
    
    // Save game results to database using both methods for redundancy
    if (user) {
      try {
        // Method 1: Use userScores utility (simpler interface)
        const scoreId = await saveUserScore(
          user, 
          score, 
          timeLeft, 
          foundWords, 
          INITIAL_TIME - timeLeft
        );

        // Method 2: Use userStore processGameCompletion (for leaderboard updates)
        const gameData = {
          score: score,
          timeLeft: timeLeft,
          wordCount: foundWords.length,
          wordsFound: foundWords,
          gameDuration: INITIAL_TIME - timeLeft
        };

        const result = await processGameCompletion(gameData);
        
        if (scoreId && result.success) {
          console.log('Game results saved successfully via both methods');
          
          // Update local high score if this is a new high score
          if (score > userHighScore) {
            setUserHighScore(score);
          }
        } else {
          console.log('Game results saved with some issues');
        }
      } catch (error) {
        console.error('Error saving game results:', error);
      }
    }
  };

  const restartGame = () => {
    setResetCount(0);
    setScore(0);
    setFoundWords([]);
    setFoundWordsBoardNumbers([]);
    setTimeLeft(INITIAL_TIME);
    setPreviewWord("");
    setIsWordRepeated(false);
    setIsTouching(false);
    setGameOverVisible(false);
    
    // Reinitialize the game (this will also reload high score)
    initializeGame();
  };

  const goBackToStart = () => {
    navigation.goBack();
  };

  // Calculate grid size based on screen size
  const gridSize = Math.min(
    screenWidth * 0.92,
    screenHeight * 0.5,
    420
  );

  // Check if current score is a new high score
  const isNewHighScore = score > userHighScore;

  // Use placeholder background for now
  const currentBackground = { backgroundColor: '#4a90e2' }; // Placeholder background

  if (gameOverVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} data-testid="game-over-screen">
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Card style={{ padding: 20 }} data-testid="game-over-card">
            <Card.Content style={{ alignItems: 'center' }}>
              <Title style={{ fontSize: 28, marginBottom: 20 }} data-testid="game-over-title">
                Game Over!
              </Title>
              
              <Paragraph style={{ fontSize: 18, marginBottom: 10 }} data-testid="final-score">
                Final Score: {score}
              </Paragraph>
              
              <Paragraph style={{ fontSize: 16, marginBottom: 10 }} data-testid="words-found">
                Words Found: {foundWords.length}
              </Paragraph>
              
              {isNewHighScore && (
                <Paragraph style={{ fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginBottom: 10 }} data-testid="new-high-score">
                  🎉 New High Score! 🎉
                </Paragraph>
              )}
              
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <Button 
                  mode="contained" 
                  onPress={restartGame}
                  data-testid="play-again-button"
                >
                  Play Again
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={goBackToStart}
                  data-testid="back-to-start-button"
                >
                  Back to Start
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    // TODO: Replace with WordProvider when available
    // <WordProvider>
    <View style={{ flex: 1 }}>
      <View
        style={[
          {
            flex: 1,
            width: "100%",
            height: "100%",
          },
          currentBackground
        ]}
        data-testid="game-background"
      >
        <SafeAreaView
          style={{
            flex: 1,
            width: "100%",
          }}
          edges={["top", "left", "right"]}
          data-testid="game-safe-area"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingBottom: 8,
            }}
            data-testid="game-main-container"
          >
            {/* Top Section: Header */}
            <View style={{ width: "100%" }}>
              <PlaceholderGridHeader
                score={score}
                timeLeft={timeLeft}
                resetCount={resetCount}
                data-testid="grid-header"
              />
            </View>

            {/* Middle Section: Letter Grid */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                marginTop: 0,
              }}
            >
              {/* Word Display Component */}
              <View style={{ width: gridSize, marginBottom: 15 }}>
                <PlaceholderWordDisplay
                  previewWord={previewWord}
                  data-testid="word-display"
                />
              </View>

              <View
                style={{
                  width: gridSize,
                  height: gridSize,
                  marginBottom: 20,
                }}
                data-testid="letter-grid-container"
              >
                <LetterGrid
                  board={board}
                  onWordFormed={handleWordFormed}
                  previewWord={previewWord}
                  setPreviewWord={setPreviewWord}
                  foundWords={foundWords}
                  setIsTouching={setIsTouching}
                  data-testid="letter-grid"
                />
              </View>

              {/* Game Controls */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <Button 
                  mode="outlined" 
                  onPress={resetBoard}
                  disabled={resetCount >= MAX_RESETS - 1}
                  data-testid="reset-board-button"
                >
                  New Board ({resetCount + 1}/{MAX_RESETS})
                </Button>
                
                <Button 
                  mode="text" 
                  onPress={goBackToStart}
                  data-testid="quit-game-button"
                >
                  Quit Game
                </Button>
              </View>

  if (gameOverVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} data-testid="game-over-screen">
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Card style={{ padding: 20 }} data-testid="game-over-card">
            <Card.Content style={{ alignItems: 'center' }}>
              <Title style={{ fontSize: 28, marginBottom: 20 }} data-testid="game-over-title">
                Game Over!
              </Title>
              
              <Paragraph style={{ fontSize: 18, marginBottom: 10 }} data-testid="final-score">
                Final Score: {score}
              </Paragraph>
              
              <Paragraph style={{ fontSize: 16, marginBottom: 10 }} data-testid="words-found">
                Words Found: {foundWords.length}
              </Paragraph>
              
              {isNewHighScore && (
                <Paragraph style={{ fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginBottom: 10 }} data-testid="new-high-score">
                  🏆 New High Score! 🏆
                </Paragraph>
              )}
              
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <Button 
                  mode="contained" 
                  onPress={restartGame}
                  data-testid="play-again-button"
                >
                  Play Again
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={goBackToStart}
                  data-testid="back-to-start-button"
                >
                  Back to Start
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaView>
    );
  }
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
    // </WordProvider>
  );
}
