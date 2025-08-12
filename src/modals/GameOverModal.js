import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Animated, ScrollView } from "react-native";
import { 
  Text, 
  Button, 
  Surface, 
  Divider, 
  Card, 
  Title, 
  Paragraph,
} from "react-native-paper";

export default function GameOverModal({
  visible,
  onClose,
  score,
  foundWords,
  isNewHighScore,
  onPlayAgain,
  onBackToStart,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('GameOverModal visibility changed:', visible);
    console.log('GameOverModal props:', { score, foundWords: foundWords?.length, isNewHighScore });
    
    if (visible) {
      console.log('GameOverModal: Starting animation');
      // Animate modal appearance
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      console.log('GameOverModal: Resetting animation');
      // Reset animation values
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handlePlayAgain = () => {
    onPlayAgain();
  };

  const handleBackToMenu = () => {
    onBackToStart();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        // Prevent modal from being dismissed by back button or gestures
        // Users must use Play Again or Back to Menu buttons
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              elevation: 10,
            }}
          >
            <Card.Content style={{ padding: 30, alignItems: "center" }}>
              {/* Game Over Title */}
              <Title
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#6200ea",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Game Over!
              </Title>

              {/* Score Display */}
              <Surface
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: 20,
                  borderRadius: 10,
                  width: "100%",
                  marginBottom: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: "#666",
                    marginBottom: 10,
                  }}
                >
                  Final Score
                </Text>
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#6200ea",
                  }}
                >
                  {score}
                </Text>
              </Surface>

              {/* New High Score Display */}
              {isNewHighScore && (
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Surface
                    style={{
                      backgroundColor: "#4CAF50",
                      padding: 15,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      🎉 New High Score! 🎉
                    </Text>
                  </Surface>
                </View>
              )}

              {/* Found Words Display */}
              {foundWords && foundWords.length > 0 && (
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Surface
                    style={{
                      backgroundColor: "#f5f5f5",
                      padding: 15,
                      borderRadius: 10,
                      maxHeight: 120,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: 10,
                        textAlign: "center",
                      }}
                    >
                      Words Found: {foundWords.length}
                    </Text>
                    <ScrollView 
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 5,
                        alignItems: 'center',
                      }}
                      style={{ maxHeight: 60 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {foundWords.map((word, index) => (
                          <View key={index} style={{ marginHorizontal: 4 }}>
                            <Surface
                              style={{
                                backgroundColor: "#6200ea",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 15,
                                elevation: 2,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "white",
                                  fontWeight: "500",
                                }}
                              >
                                {word.toUpperCase()}
                              </Text>
                            </Surface>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </Surface>
                </View>
              )}

              <Divider style={{ width: "100%", marginVertical: 20 }} />

              {/* Action Buttons */}
              <View style={{ width: "100%", gap: 10 }}>
                <Button
                  mode="contained"
                  onPress={handlePlayAgain}
                  style={{
                    backgroundColor: "#6200ea",
                    paddingVertical: 8,
                  }}
                  labelStyle={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Play Again
                </Button>

                <Button
                  mode="outlined"
                  onPress={handleBackToMenu}
                  style={{
                    borderColor: "#6200ea",
                    paddingVertical: 8,
                  }}
                  labelStyle={{
                    color: "#6200ea",
                    fontSize: 16,
                  }}
                >
                  Back to Menu
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </View>
    </Modal>
  );
}
