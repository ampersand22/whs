import React from "react";
import { View, Animated, Text } from "react-native";
import { Surface } from "react-native-paper";

export default function WordDisplay({
  previewWord,
  isWordRepeated,
  wordAnim,
  highScore,
  isNewHighScore,
  isAuthenticated,
  isTouching,
}) {
  // Text is always black while touching
  // After touch ends: green for valid new words, red for repeated words
  const textColor = isTouching ? "#333" : (isWordRepeated ? "#ff0000" : "#4CAF50");

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        marginBottom: 2,
      }}
    >
      {/* Word Preview - 65% width */}
      <Animated.View
        style={{
          transform: [{ scale: wordAnim }],
          width: "65%",
        }}
      >
        <Surface
          style={{
            height: 50,
            paddingVertical: 12,
            elevation: 2,
            backgroundColor: "#f1f1f1",
            borderRadius: 0,
            justifyContent: "center",
          }}
          data-testid="word-display"
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: textColor,
              textAlign: "center",
            }}
            data-testid="word-text"
          >
            {previewWord}
          </Text>
        </Surface>
      </Animated.View>

      {/* High Score - 35% width */}
      {isAuthenticated && (
        <Surface
          style={{
            width: "35%",
            height: 50,
            paddingVertical: 6,
            paddingHorizontal: 8,
            elevation: 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 0,
            justifyContent: "center",
          }}
          data-testid="high-score-surface"
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
            }}
            data-testid="high-score-label"
          >
            High Score
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: isNewHighScore ? "#4CAF50" : "#333",
              textAlign: "center",
            }}
            data-testid="high-score-value"
          >
            {highScore}
          </Text>
        </Surface>
      )}
    </View>
  );
}
