import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, Animated, ScrollView } from "react-native";
import { Portal, Dialog, Button } from "react-native-paper";

const { width, height } = Dimensions.get('window');

export default function FoundWordsModal({ 
  visible, 
  onClose,
  foundWords = [],
  foundWordsBoardNumbers = [],
  score = 0
}) {
  
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  // Group words by length for better organization
  const wordsByLength = foundWords.reduce((acc, word, index) => {
    const length = word.length;
    const boardNumber = foundWordsBoardNumbers[index] || 0;
    
    if (!acc[length]) {
      acc[length] = [];
    }
    acc[length].push({ word, boardNumber });
    return acc;
  }, {});

  const sortedLengths = Object.keys(wordsByLength).sort((a, b) => parseInt(b) - parseInt(a));


  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onClose}
        style={{ backgroundColor: 'transparent' }}
      >
        <Animated.View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          margin: 8, // Reduced margin to allow more space
          width: width * 0.95, // Increased width
          maxWidth: 600, // Increased max width
          height: height * 0.85, // Set explicit height to 85% of screen
          alignSelf: 'center',
          transform: [{ scale: scaleAnim }]
        }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center'
            }}>
              Found Words
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#666',
              textAlign: 'center',
              marginTop: 4
            }}>
              {foundWords.length} words • {score.toLocaleString()} points
            </Text>
          </View>

          {/* Words List */}
          <ScrollView 
            style={{ 
              flex: 1, 
              height: height * 0.6, // Explicit height instead of maxHeight
              backgroundColor: '#f8f9fa' // Light background to see the scroll area
            }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ padding: 10 }}
          >
            {sortedLengths.map(length => (
              <View key={length} style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#6200ea',
                  marginBottom: 8
                }}>
                  {length} Letters ({wordsByLength[length].length} words)
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 10 // Increased gap
                }}>
                  {wordsByLength[length].map(({ word, boardNumber }, index) => (
                    <View
                      key={`${word}-${index}`}
                      style={{
                        backgroundColor: '#e3f2fd', // Light blue background
                        paddingHorizontal: 16, // Increased padding
                        paddingVertical: 12, // Increased padding
                        borderRadius: 20, // Larger border radius
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#2196F3'
                      }}
                    >
                      <Text style={{
                        fontSize: 16, // Increased font size
                        fontWeight: 'bold', // Made bold
                        color: '#1976D2', // Blue color
                        textTransform: 'uppercase'
                      }}>
                        {word}
                      </Text>
                      <Text style={{
                        fontSize: 12, // Increased font size
                        color: '#666',
                        marginLeft: 8, // Increased margin
                        backgroundColor: '#fff',
                        paddingHorizontal: 6,
                        paddingVertical: 3,
                        borderRadius: 10,
                        minWidth: 20,
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>
                        {boardNumber + 1}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            
            {foundWords.length === 0 && (
              <View style={{
                alignItems: 'center',
                paddingVertical: 40
              }}>
                <Text style={{
                  fontSize: 16,
                  color: '#666',
                  textAlign: 'center'
                }}>
                  No words found this game.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Close Button */}
          <View style={{ marginTop: 20 }}>
            <Button
              mode="contained"
              onPress={onClose}
              style={{
                borderRadius: 8,
                backgroundColor: '#6200ea'
              }}
              contentStyle={{
                height: 48,
                justifyContent: 'center'
              }}
              labelStyle={{
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              Close
            </Button>
          </View>
        </Animated.View>
      </Dialog>
    </Portal>
  );
}
