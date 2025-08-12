import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, Animated } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

export default function GameOverModalNew({ 
  visible, 
  onPlayAgain, 
  onMainMenu, 
  onShowFoundWords,
  score = 0, 
  highScore = 0, 
  isNewHighScore = false,
  foundWords = []
}) {
  console.log('GameOverModalNew render - visible:', visible);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Animate modal appearance
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Trigger confetti for new high score
      if (isNewHighScore && confettiRef.current) {
        setTimeout(() => {
          confettiRef.current.start();
        }, 500);
      }
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, isNewHighScore]);

  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={() => {
          console.log('GameOverModalNew - onDismiss called');
          // Do nothing - prevent dismissal
        }}
        style={{ backgroundColor: 'transparent' }}
      >
        <Animated.View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 30,
          margin: 16,
          alignItems: 'center',
          width: width * 0.9,
          maxWidth: 500,
          minWidth: 320,
          alignSelf: 'center',
          transform: [{ scale: scaleAnim }]
        }}>
          {/* Confetti for new high score */}
          {isNewHighScore && (
            <ConfettiCannon
              ref={confettiRef}
              count={200}
              origin={{ x: width / 2, y: 0 }}
              autoStart={false}
              fadeOut={true}
            />
          )}

          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center'
            }}>
              Game Over!
            </Text>
            {isNewHighScore && (
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#FFD700',
                textAlign: 'center',
                marginTop: 8,
                textShadowColor: '#FFA500',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2
              }}>
                🎉 NEW HIGH SCORE! 🎉
              </Text>
            )}
          </View>

          {/* Score Section */}
          <View style={{ width: '100%', marginBottom: 30 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}>
              <Text style={{
                fontSize: 16,
                color: '#666',
                fontWeight: '500'
              }}>
                Your Score:
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isNewHighScore ? '#FFD700' : '#333',
                textShadowColor: isNewHighScore ? '#FFA500' : 'transparent',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: isNewHighScore ? 1 : 0
              }}>
                {score.toLocaleString()}
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}>
              <Text style={{
                fontSize: 16,
                color: '#666',
                fontWeight: '500'
              }}>
                High Score:
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333'
              }}>
                {Math.max(score, highScore).toLocaleString()}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}>
              <Text style={{
                fontSize: 16,
                color: '#666',
                fontWeight: '500'
              }}>
                Words Found:
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#333'
              }}>
                {foundWords.length}
              </Text>
            </View>
          </View>

          {/* Buttons - Stacked Vertically */}
          <View style={{ width: '100%', gap: 12 }}>
            <Button
              mode="contained"
              onPress={() => {
                console.log('Play Again button pressed');
                onPlayAgain && onPlayAgain();
              }}
              style={{
                borderRadius: 8,
                width: '100%',
                backgroundColor: '#6200ea'
              }}
              contentStyle={{
                height: 50,
                justifyContent: 'center'
              }}
              labelStyle={{
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              Play Again
            </Button>
            
            {foundWords.length > 0 && (
              <Button
                mode="outlined"
                onPress={() => {
                  console.log('Found Words button pressed');
                  onShowFoundWords && onShowFoundWords();
                }}
                style={{
                  borderRadius: 8,
                  width: '100%',
                  borderColor: '#2196F3',
                  borderWidth: 2
                }}
                contentStyle={{
                  height: 50,
                  justifyContent: 'center'
                }}
                labelStyle={{
                  color: '#2196F3',
                  fontSize: 16,
                  fontWeight: 'bold'
                }}
              >
                View Found Words ({foundWords.length})
              </Button>
            )}
            
            <Button
              mode="outlined"
              onPress={() => {
                console.log('Main Menu button pressed');
                onMainMenu && onMainMenu();
              }}
              style={{
                borderRadius: 8,
                width: '100%',
                borderColor: '#666',
                borderWidth: 2
              }}
              contentStyle={{
                height: 50,
                justifyContent: 'center'
              }}
              labelStyle={{
                color: '#666',
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              Main Menu
            </Button>
          </View>
        </Animated.View>
      </Dialog>
    </Portal>
  );
}
