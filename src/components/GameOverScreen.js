import React from 'react';
import { View, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Title, Paragraph, Text } from 'react-native-paper';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameOverScreen = ({ 
  score, 
  foundWords, 
  isNewHighScore, 
  onPlayAgain, 
  onBackToStart 
}) => {
  return (
    <ImageBackground
      source={require('../../assets/background1.png')}
      style={{
        flex: 1,
        width: screenWidth,
        height: screenHeight,
        position: 'absolute',
        top: 0,
        left: 0
      }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{ flex: 1 }}
        data-testid="game-over-screen"
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        >
          <Card 
            style={{ padding: 20, backgroundColor: 'rgba(255,255,255,0.95)' }} 
            data-testid="game-over-card"
          >
            <Card.Content style={{ alignItems: 'center' }}>
              <Title
                style={{ fontSize: 28, marginBottom: 20 }}
                data-testid="game-over-title"
              >
                Game Over!
              </Title>

              <Paragraph
                style={{ fontSize: 18, marginBottom: 10 }}
                data-testid="final-score"
              >
                Final Score: {score}
              </Paragraph>

              <Paragraph
                style={{ fontSize: 16, marginBottom: 10 }}
                data-testid="words-found"
              >
                Words Found: {foundWords.length}
              </Paragraph>

              {isNewHighScore && (
                <Paragraph
                  style={{
                    fontSize: 16,
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}
                  data-testid="new-high-score"
                >
                  🎉 New High Score! 🎉
                </Paragraph>
              )}

              {/* Found Words List */}
              {foundWords.length > 0 && (
                <View
                  style={{
                    backgroundColor: 'rgba(240,240,240,0.8)',
                    borderRadius: 10,
                    padding: 15,
                    marginVertical: 15,
                    maxHeight: 200,
                    width: '100%',
                  }}
                  data-testid="found-words-container"
                >
                  <Text
                    style={{ 
                      fontWeight: 'bold', 
                      marginBottom: 10, 
                      textAlign: 'center',
                      fontSize: 16 
                    }}
                    data-testid="found-words-title"
                  >
                    Your Words:
                  </Text>
                  <ScrollView style={{ maxHeight: 120 }}>
                    <Text 
                      style={{ 
                        textAlign: 'center', 
                        lineHeight: 24,
                        fontSize: 14 
                      }}
                      data-testid="found-words-list"
                    >
                      {foundWords.map((word) => word.toUpperCase()).join(' • ')}
                    </Text>
                  </ScrollView>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <Button
                  mode="contained"
                  onPress={onPlayAgain}
                  data-testid="play-again-button"
                >
                  Play Again
                </Button>

                <Button
                  mode="outlined"
                  onPress={onBackToStart}
                  data-testid="back-to-start-button"
                >
                  Back to Start
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default GameOverScreen;
