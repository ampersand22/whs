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
import { SafeAreaView } from "react-native-safe-area-context";
import LetterGrid from "../components/LetterGrid";
import GridHeader from "../components/GridHeader";
import WordDisplay from "../components/WordDisplay";
import { generateBoard } from "../utils/BoardGenerator";
import { WordProvider } from "../context/WordContext";
import { isValidWord, isBonusWord } from "../utils/WordList";
import { getPointsForWord, getScoringDescription } from "../utils/scoringUtils";
import { Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../auth/AuthContext";
import { getUserHighScore, scoreEvents } from "../firebase/realtimeScores";

import ScoringDisplay from "../components/ScoringDisplay";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function GameScreen() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const INITIAL_TIME = 180;

  const [board, setBoard] = useState(generateBoard());
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [foundWordsBoardNumbers, setFoundWordsBoardNumbers] = useState([]); // Track which board each word was found on
  const [resetCount, setResetCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [previewWord, setPreviewWord] = useState("");
  const [userHighScore, setUserHighScore] = useState(0);
  const [isWordRepeated, setIsWordRepeated] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Animation refs
  const wordAnim = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(1)).current;

  const backgroundImages = [
    require("../../assets/background1.png"),
    require("../../assets/background2.png"),
    require("../../assets/background3.jpg"),
    require("../../assets/background4.png"),
    require("../../assets/background5.png"),
  ];

  // Fetch user's high score when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserHighScore();
    }

    // Listen for score updates
    const handleScoreUpdate = (scoreData) => {
      console.log("GameScreen - Score update detected:", scoreData);
      fetchUserHighScore();
    };

    scoreEvents.on("scoreUpdated", handleScoreUpdate);

    return () => {
      scoreEvents.off("scoreUpdated", handleScoreUpdate);
    };
  }, [isAuthenticated]);

  const fetchUserHighScore = async () => {
    try {
      const highScore = await getUserHighScore();
      if (highScore !== null) {
        setUserHighScore(highScore);
      }
    } catch (error) {
      console.error("Error fetching user high score:", error);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOverVisible(true);
    }

    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleWordFormed = (word, isRepeated) => {
    if (word.length >= 3 && isValidWord(word.toLowerCase())) {
      setIsWordRepeated(isRepeated);

      if (!foundWords.includes(word)) {
        setFoundWords((prev) => [...prev, word]);
        setFoundWordsBoardNumbers((prev) => [...prev, resetCount]); // Track which board this word was found on

        // Check if it's a bonus word (300 points) or use new scoring system
        const points = isBonusWord(word)
          ? 300
          : getPointsForWord(word, resetCount);
        setScore((prev) => prev + points);

        // Show points earned feedback
        console.log(
          `"${word}" found on board ${resetCount + 1} for ${points} points!`
        );

        // Animate the score display for new valid words
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

        // Animate the word display for new valid words
        Animated.sequence([
          Animated.timing(wordAnim, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(wordAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (isRepeated) {
        // Word is repeated - animate the Found Words button
        Animated.sequence([
          Animated.timing(wordsButtonScale, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(wordsButtonScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  const MAX_RESETS = 5;

  const resetBoard = () => {
    if (resetCount < MAX_RESETS - 1) {
      setBoard(generateBoard());
      setResetCount((prev) => prev + 1);
      setPreviewWord("");
    }
  };

  const restartGame = () => {
    setResetCount(0);
    setScore(0);
    setFoundWords([]);
    setFoundWordsBoardNumbers([]); // Reset board numbers tracking
    setTimeLeft(INITIAL_TIME);
    setBoard(generateBoard());
    setGameOverVisible(false);
  };

  const handleAuthNavigation = () => {
    restartGame();
    navigation.navigate("Auth");
  };

  const wordsButtonScale = useRef(new Animated.Value(1)).current;

  const currentBackground =
    backgroundImages[resetCount % backgroundImages.length];

  // Check if current score is a new high score
  const isNewHighScore = score > userHighScore;

  // Calculate grid size based on screen size - INCREASED SIZE
  const gridSize = Math.min(
    screenWidth * 0.92, // 92% of screen width (increased)
    screenHeight * 0.5, // 50% of screen height (increased)
    420 // Maximum size (increased)
  );

  // Calculate logo size based on screen dimensions
  const logoWidth = Math.min(screenWidth * 0.6, 300);
  const logoHeight = logoWidth * 0.25; // Maintain aspect ratio

  return (
    <WordProvider>
      <ImageBackground
        source={currentBackground}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
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
              justifyContent: "space-between", // Distribute space evenly
              paddingBottom: 8, // Add padding at bottom
            }}
            data-testid="game-main-container"
          >
            {/* Top Section: Header */}
            <View style={{ width: "100%" }}>
              <GridHeader
                score={score}
                timeLeft={timeLeft}
                resetCount={resetCount}
                scoreAnim={scoreAnim}
                data-testid="grid-header"
              />

              {/* Scoring Information */}
              <ScoringDisplay boardNumber={resetCount} compact={true} />
            </View>

            {/* Middle Section: Letter Grid - INCREASED SIZE */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1, // Take up available space
                marginTop: 0, // Removed negative margin that was causing overlap
              }}
            >
              {/* WordHustle Logo */}
              <View
                style={{
                  alignItems: "center",
                  marginTop: 5, // Add space after header
                  marginBottom: 10,
                }}
                data-testid="logo-container"
              >
                <Image
                  source={require("../../assets/wordhustle_small.png")}
                  style={{
                    width: logoWidth,
                    height: logoHeight,
                    resizeMode: "contain",
                  }}
                  data-testid="logo-image"
                />
              </View>

              {/* Word Display Component */}
              <View style={{ width: gridSize, marginBottom: 5 }}>
                <WordDisplay
                  previewWord={previewWord}
                  isWordRepeated={isWordRepeated}
                  wordAnim={wordAnim}
                  highScore={isNewHighScore ? score : userHighScore}
                  isNewHighScore={isNewHighScore}
                  isAuthenticated={isAuthenticated}
                  isTouching={isTouching}
                />
              </View>

              <View
                style={{
                  width: gridSize,
                  height: gridSize,
                  marginBottom: 20, // Added more margin between grid and buttons
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
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </WordProvider>
  );
}
