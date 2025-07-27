import React, { useState } from "react";
import { View, Animated } from "react-native";
import { Button, Modal, Portal, Surface, Text } from "react-native-paper";

export default function ActionButtons({
  resetBoard,
  restartGame,
  resetCount,
  setWordsModalVisible,
  wordsButtonScale,
  goToStartScreen,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const MAX_RESETS = 5;

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        marginHorizontal: 10,
        marginTop: 12,
        paddingBottom: 5,
      }}
    >
      {/* First row: Words Found and Reset Board */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}>
        <Animated.View
          style={{
            width: "48%",
            marginBottom: 10,
            height: 50,
            transform: [{ scale: wordsButtonScale }],
          }}
        >
          <Button
            mode="outlined"
            onPress={() => setWordsModalVisible(true)}
            style={{
              flex: 1,
              justifyContent: "center",
              borderColor: "white",
              borderWidth: 2,
              backgroundColor: "#6200ea",
            }}
            contentStyle={{
              height: 42,
              justifyContent: "center",
            }}
            labelStyle={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              paddingHorizontal: 8,
            }}
            uppercase={false}
            data-testid="words-found-button"
          >
            Words Found
          </Button>
        </Animated.View>

        <View style={{
          width: "48%",
          marginBottom: 10,
          height: 50,
        }}>
          <Button
            mode="outlined"
            onPress={resetBoard}
            disabled={resetCount >= MAX_RESETS - 1}
            style={{
              flex: 1,
              justifyContent: "center",
              borderColor: "white",
              borderWidth: 2,
              backgroundColor: resetCount >= MAX_RESETS - 1 ? "#a0a0a0" : "#6200ea",
            }}
            contentStyle={{
              height: 42,
              justifyContent: "center",
            }}
            labelStyle={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              paddingHorizontal: 8,
            }}
          >
            Reset Board
          </Button>
        </View>
      </View>

      {/* Second row: Menu button (centered) */}
      <View style={{
        width: "48%",
        marginTop: 10,
        height: 50,
      }}>
        <Button
          mode="outlined"
          onPress={showMenu}
          style={{
            flex: 1,
            justifyContent: "center",
            borderColor: "white",
            borderWidth: 2,
            backgroundColor: "#6200ea",
          }}
          contentStyle={{
            height: 42,
            justifyContent: "center",
          }}
          labelStyle={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
            paddingHorizontal: 8,
          }}
          icon="menu"
        >
          Menu
        </Button>
      </View>

      {/* Simple Modal Menu */}
      <Portal>
        <Modal
          visible={menuVisible}
          onDismiss={hideMenu}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <Surface style={{
            width: '90%',
            maxWidth: 400,
            padding: 20,
            borderRadius: 10,
            backgroundColor: '#333',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 20,
            }}>
              Game Menu
            </Text>
            
            <Button
              mode="outlined"
              onPress={() => {
                hideMenu();
                restartGame();
              }}
              style={{
                width: '100%',
                marginVertical: 8,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: '#6200ea',
                height: 50,
                justifyContent: 'center',
              }}
              contentStyle={{
                height: 42,
                justifyContent: "center",
              }}
              labelStyle={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
              icon="refresh"
            >
              Restart Game
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                hideMenu();
                goToStartScreen();
              }}
              style={{
                width: '100%',
                marginVertical: 8,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: '#6200ea',
                height: 50,
                justifyContent: 'center',
              }}
              contentStyle={{
                height: 42,
                justifyContent: "center",
              }}
              labelStyle={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
              icon="home"
            >
              Back To Menu
            </Button>

            <Button
              mode="outlined"
              onPress={hideMenu}
              style={{
                width: '100%',
                marginVertical: 8,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: '#444',
                height: 50,
                justifyContent: 'center',
              }}
              contentStyle={{
                height: 42,
                justifyContent: "center",
              }}
              labelStyle={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
              icon="close"
            >
              Close
            </Button>
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
}
