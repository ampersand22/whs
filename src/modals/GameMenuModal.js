import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Animated,
  Pressable,
} from "react-native";
import { 
  Portal, 
  Text, 
  Title, 
  Button, 
  Card
} from "react-native-paper";

const GameMenuModal = ({ visible, onClose, onRestart, onBackToMenu }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        data-testid="game-menu-modal"
      >
        <Pressable 
          onPress={onClose} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          data-testid="modal-overlay"
        >
          <View style={{ flex: 1 }} data-testid="modal-backdrop" />
        </Pressable>

        <View 
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          data-testid="modal-centered-container"
        >
          <Animated.View
            style={{
              width: "80%",
              maxWidth: 300,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
            data-testid="modal-content"
          >
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Title data-testid="menu-title">
                Game Menu
              </Title>
            </View>

            {/* Menu Options */}
            <View style={{ gap: 12 }}>
              <Button
                mode="contained"
                onPress={onRestart}
                buttonColor="#6200ea"
                textColor="white"
                data-testid="restart-game-button"
              >
                🔄 Restart Game
              </Button>

              <Button
                mode="outlined"
                onPress={onBackToMenu}
                textColor="#6200ea"
                data-testid="back-to-menu-button"
              >
                🏠 Back to Main Menu
              </Button>

              <Button
                mode="text"
                onPress={onClose}
                textColor="#666"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Portal>
  );
};

export default GameMenuModal;
