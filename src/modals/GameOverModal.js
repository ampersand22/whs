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
import { LinearGradient } from 'expo-linear-gradient';

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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    if (visible) {
      // Animate modal appearance
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Start pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Celebration animation for high score
      if (isNewHighScore) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(celebrationAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(celebrationAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }

      return () => {
        pulseAnimation.stop();
      };
    } else {
      // Reset animation values
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      pulseAnim.setValue(1);
      celebrationAnim.setValue(0);
    }
  }, [visible, isNewHighScore]);

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
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
            opacity: opacityAnim,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <View
            style={{
              borderRadius: 24,
              elevation: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
            }}
          >
            <View style={{ overflow: 'hidden', borderRadius: 24 }}>
              <LinearGradient
                colors={isNewHighScore ? ['#ff6b6b', '#feca57', '#48dbfb'] : ['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 32,
                  borderRadius: 24,
                }}
              >
              {/* Decorative elements */}
              <View style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }} />
              <View style={{
                position: 'absolute',
                bottom: -20,
                left: -20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }} />

              {/* Game Over Title with Emoji */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 56, marginBottom: 8 }}>
                  {isNewHighScore ? '🏆' : '🎯'}
                </Text>
                <Title
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: 8,
                    textAlign: "center",
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {isNewHighScore ? 'New Record!' : 'Game Over!'}
                </Title>
                <Text style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: 16,
                  textAlign: 'center'
                }}>
                  {isNewHighScore ? 'Congratulations! 🎉' : 'Great job playing!'}
                </Text>
              </View>

              {/* Score Display */}
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 24,
                  borderRadius: 16,
                  width: "100%",
                  marginBottom: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: 8,
                    fontWeight: '500',
                  }}
                >
                  Final Score
                </Text>
                <Text
                  style={{
                    fontSize: 42,
                    fontWeight: "bold",
                    color: "white",
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {score}
                </Text>
              </View>

              {/* New High Score Celebration */}
              {isNewHighScore && (
                <Animated.View 
                  style={{ 
                    width: "100%", 
                    marginBottom: 20,
                    transform: [{ scale: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05]
                    })}]
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      padding: 16,
                      borderRadius: 16,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "bold",
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 3,
                      }}
                    >
                      🎉 Personal Best! 🎉
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* Found Words Display */}
              {foundWords && foundWords.length > 0 && (
                <View style={{ width: "100%", marginBottom: 24 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      padding: 16,
                      borderRadius: 16,
                      maxHeight: 140,
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "white",
                        marginBottom: 12,
                        textAlign: "center",
                      }}
                    >
                      Words Found: {foundWords.length} 📝
                    </Text>
                    <ScrollView 
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 5,
                        alignItems: 'center',
                      }}
                      style={{ maxHeight: 70 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {foundWords.map((word, index) => (
                          <View key={index} style={{ marginHorizontal: 4 }}>
                            <View
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "white",
                                  fontWeight: "600",
                                }}
                              >
                                {word.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={{ width: "100%", gap: 16 }}>
                <Button
                  mode="contained"
                  onPress={handlePlayAgain}
                  buttonColor="rgba(255, 255, 255, 0.2)"
                  textColor="white"
                  style={{
                    borderRadius: 16,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                  contentStyle={{ paddingVertical: 12 }}
                  labelStyle={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  🔄 Play Again
                </Button>

                <Button
                  mode="contained"
                  onPress={handleBackToMenu}
                  buttonColor="rgba(255, 255, 255, 0.1)"
                  textColor="white"
                  style={{
                    borderRadius: 16,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  contentStyle={{ paddingVertical: 12 }}
                  labelStyle={{
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  🏠 Back to Menu
                </Button>
              </View>
            </LinearGradient>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
