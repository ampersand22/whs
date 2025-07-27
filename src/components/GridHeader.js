import React from "react";
import { Text, View, Dimensions, Image, Animated } from "react-native";
import { Surface } from "react-native-paper";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function GridHeader({ score, timeLeft, resetCount, scoreAnim }) {
  // Calculate responsive sizes - increased sizes
  const containerPadding = Math.max(4, screenHeight * 0.005);
  const rowMargin = Math.max(6, screenHeight * 0.01);
  const boxWidth = Math.min(screenWidth * 0.28, 130); // Increased max width
  const boxPadding = Math.max(6, screenHeight * 0.008); // Increased padding
  const fontSize = Math.min(20, screenWidth / 22); // Increased font size

  // Logo dimensions
  const logoWidth = Math.min(screenWidth * 0.5, 200); // 50% of screen width, max 200px
  const logoHeight = logoWidth * 0.27; // Maintain aspect ratio

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View
      style={{
        width: "100%",
        marginBottom: containerPadding,
        paddingHorizontal: Math.max(5, screenWidth * 0.01),
      }}
      data-testid="grid-header"
    >
      {/* Board Count, Score, Timer Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: rowMargin,
          flexWrap: "wrap",
        }}
        data-testid="score-timer-row"
      >
        {/* Board Count */}
        <Surface
          style={{
            width: boxWidth,
            paddingVertical: boxPadding,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 4,
            borderWidth: 2,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "center",
            margin: 2,
          }}
          data-testid="board-box"
        >
          <Text
            style={{
              fontSize: fontSize,
              fontWeight: "bold",
              color: "#009688",
              textAlign: "center",
            }}
            data-testid="board-text"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Board {resetCount + 1}/5
          </Text>
        </Surface>

        {/* Score - with animation */}
        <Animated.View
          style={{
            transform: [{ scale: scoreAnim || 1 }],
            width: boxWidth,
            margin: 2,
          }}
        >
          <Surface
            style={{
              width: "100%",
              paddingVertical: boxPadding,
              borderRadius: 10,
              backgroundColor: "white",
              elevation: 4,
              borderWidth: 2,
              borderColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-testid="score-box"
          >
            <Text
              style={{
                fontSize: fontSize,
                fontWeight: "bold",
                color: "#6200ea",
                textAlign: "center",
              }}
              data-testid="score-text"
            >
              {score}
            </Text>
          </Surface>
        </Animated.View>

        {/* Timer */}
        <Surface
          style={{
            width: boxWidth,
            paddingVertical: boxPadding,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 4,
            borderWidth: 2,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "center",
            margin: 2,
          }}
          data-testid="timer-box"
        >
          <Text
            style={{
              fontSize: fontSize,
              fontWeight: "bold",
              color: "#ff6b6b",
              textAlign: "center",
            }}
            data-testid="time-text"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatTime(timeLeft)}
          </Text>
        </Surface>
      </View>
    </View>
  );
}
