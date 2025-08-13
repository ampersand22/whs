import React, { useEffect, useRef, useState } from "react";
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
  Card,
  Dialog,
  Paragraph
} from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';

const GameMenuModal = ({ visible, onClose, onRestart, onBackToMenu }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

      // Start pulse animation for visual appeal
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
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

  const handleBackToMenuPress = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmBackToMenu = () => {
    setShowConfirmDialog(false);
    onBackToMenu();
  };

  const handleCancelBackToMenu = () => {
    setShowConfirmDialog(false);
  };

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
              width: "85%",
              maxWidth: 320,
              borderRadius: 24,
              elevation: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
              opacity: opacityAnim,
              overflow: 'hidden',
            }}
            data-testid="modal-content"
          >
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 24,
                borderRadius: 24,
              }}
            >
              {/* Header with emoji and title */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>⏸️</Text>
                <Title 
                  style={{ 
                    color: 'white', 
                    fontSize: 24, 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                  data-testid="menu-title"
                >
                  Game Paused
                </Title>
                <Text style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 4
                }}>
                  What would you like to do?
                </Text>
              </View>

              {/* Menu Options with enhanced styling */}
              <View style={{ gap: 16 }}>
                <Button
                  mode="contained"
                  onPress={onRestart}
                  buttonColor="rgba(255, 255, 255, 0.2)"
                  textColor="white"
                  style={{
                    borderRadius: 16,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                  contentStyle={{ paddingVertical: 8 }}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  data-testid="restart-game-button"
                >
                  🔄 Restart Game
                </Button>

                <Button
                  mode="contained"
                  onPress={handleBackToMenuPress}
                  buttonColor="rgba(255, 255, 255, 0.15)"
                  textColor="white"
                  style={{
                    borderRadius: 16,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  }}
                  contentStyle={{ paddingVertical: 8 }}
                  labelStyle={{ fontSize: 16, fontWeight: '600' }}
                  data-testid="back-to-menu-button"
                >
                  🏠 Back to Main Menu
                </Button>

                <Button
                  mode="text"
                  onPress={onClose}
                  textColor="rgba(255, 255, 255, 0.9)"
                  style={{
                    borderRadius: 16,
                    paddingVertical: 4,
                  }}
                  contentStyle={{ paddingVertical: 8 }}
                  labelStyle={{ fontSize: 16, fontWeight: '500' }}
                  data-testid="cancel-button"
                >
                  ▶️ Resume Game
                </Button>
              </View>

              {/* Decorative elements */}
              <View style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }} />
              <View style={{
                position: 'absolute',
                bottom: -15,
                left: -15,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }} />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Confirmation Dialog */}
        <Portal>
          <Dialog 
            visible={showConfirmDialog} 
            onDismiss={handleCancelBackToMenu}
            style={{ backgroundColor: 'white', borderRadius: 16 }}
          >
            <Dialog.Title style={{ textAlign: 'center', fontSize: 20 }}>
              🤔 Leave Game?
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
                Are you sure you want to go back to the main menu? 
                {'\n\n'}
                <Text style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                  Your current progress will be lost!
                </Text>
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: 'space-around', paddingHorizontal: 16 }}>
              <Button 
                onPress={handleCancelBackToMenu}
                textColor="#666"
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button 
                mode="contained"
                onPress={handleConfirmBackToMenu}
                buttonColor="#d32f2f"
                style={{ flex: 1, marginLeft: 8 }}
              >
                Leave Game
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Modal>
    </Portal>
  );
};

export default GameMenuModal;
