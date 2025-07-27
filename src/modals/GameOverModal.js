import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Animated } from "react-native";
import { 
  Text, 
  Button, 
  Surface, 
  Divider, 
  Card, 
  Title, 
  Paragraph,
  Avatar,
  Badge
} from "react-native-paper";
import useUserStore from "../stores/userStore";

export default function GameOverModal({
  visible,
  onClose,
  score,
  highScore,
  isNewHighScore,
  onSignIn,
  onBackToStart,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { isAuthenticated, userStats } = useUserStore();

  useEffect(() => {
    if (visible) {
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
      // Reset animation values
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handlePlayAgain = () => {
    onClose();
  };

  const handleBackToMenu = () => {
    if (onBackToStart) {
      onBackToStart();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
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

              {/* High Score Info */}
              {isAuthenticated && (
                <View style={{ width: "100%", marginBottom: 20 }}>
                  {isNewHighScore ? (
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
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "#666", fontSize: 16 }}>
                        Your High Score: {userStats.highScore}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Monthly Rank Info */}
              {isAuthenticated && userStats.monthlyRank && (
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Surface
                    style={{
                      backgroundColor: "#FF6B35",
                      padding: 10,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
                      Monthly Rank: #{userStats.monthlyRank}
                    </Text>
                  </Surface>
                </View>
              )}

              {/* Stars Display */}
              {isAuthenticated && userStats.totalStars > 0 && (
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <Surface
                    style={{
                      backgroundColor: "#FFD700",
                      padding: 10,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333", fontSize: 14, fontWeight: "bold" }}>
                      ⭐ {userStats.totalStars} Stars Earned
                    </Text>
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

                {/* Sign In Button for unauthenticated users */}
                {!isAuthenticated && (
                  <Button
                    mode="outlined"
                    onPress={onSignIn}
                    style={{
                      borderColor: "#4CAF50",
                      paddingVertical: 8,
                      marginTop: 10,
                    }}
                    labelStyle={{
                      color: "#4CAF50",
                      fontSize: 14,
                    }}
                  >
                    Sign In to Save Scores
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </View>
    </Modal>
  );
}
