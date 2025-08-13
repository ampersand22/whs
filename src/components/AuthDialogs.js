import React, { useState, useRef } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Portal, Dialog, Button, TextInput, Text, Divider, IconButton } from "react-native-paper";

const AuthDialogs = ({
  // Sign Up Dialog
  showSignUp,
  setShowSignUp,
  displayName,
  setDisplayName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSignUp,
  
  // Sign In Dialog
  showLogIn,
  setShowLogIn,
  handleSignIn,
  
  // How to Play Dialog
  showHowToPlay,
  setShowHowToPlay,
  
  // Loading state
  loading
}) => {
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Refs for scrolling
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <>
      {/* Sign Up Dialog */}
      <Portal>
        <Dialog 
          visible={showSignUp} 
          onDismiss={() => setShowSignUp(false)} 
          data-testid="sign-up-dialog"
          style={{ marginTop: -100 }} // Move dialog up to avoid keyboard
        >
          <Dialog.Title>Create Account</Dialog.Title>
          <Dialog.Content>
            <ScrollView 
              ref={scrollViewRef}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              style={{ maxHeight: 400 }}
              nestedScrollEnabled={true}
            >
              <TextInput
                label="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                style={{ marginBottom: 12 }}
                data-testid="display-name-input"
                returnKeyType="next"
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: 12 }}
                data-testid="email-input"
                returnKeyType="next"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ marginBottom: 12 }}
                data-testid="password-input"
                returnKeyType="next"
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                data-testid="confirm-password-input"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                onFocus={scrollToBottom}
                right={
                  <TextInput.Icon 
                    icon={showConfirmPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSignUp(false)} data-testid="cancel-sign-up-button">
              Cancel
            </Button>
            <Button onPress={handleSignUp} loading={loading} data-testid="create-account-button">
              Create Account
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Sign In Dialog */}
      <Portal>
        <Dialog 
          visible={showLogIn} 
          onDismiss={() => setShowLogIn(false)} 
          data-testid="sign-in-dialog"
          style={{ marginTop: -50 }} // Move dialog up to avoid keyboard
        >
          <Dialog.Title>Sign In</Dialog.Title>
          <Dialog.Content>
            <ScrollView 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ maxHeight: 250 }}
              nestedScrollEnabled={true}
            >
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: 12 }}
                data-testid="email-input"
                returnKeyType="next"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                data-testid="password-input"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogIn(false)} data-testid="cancel-sign-in-button">
              Cancel
            </Button>
            <Button onPress={handleSignIn} loading={loading} data-testid="sign-in-submit-button">
              Sign In
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* How to Play Dialog */}
      <Portal>
        <Dialog visible={showHowToPlay} onDismiss={() => setShowHowToPlay(false)} data-testid="how-to-play-dialog">
          <Dialog.Title>How to Play</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
                🎯 Objective:
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Find as many words as possible in 3 minutes
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 16 }}>
                • Score points based on word length and board number
              </Text>

              <Divider style={{ marginVertical: 16 }} />

              <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
                🎮 Gameplay:
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Swipe to connect adjacent letters (including diagonals)
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Words must be at least 3 letters long
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Each letter can only be used once per word
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 16 }}>
                • Longer words score more points
              </Text>

              <Divider style={{ marginVertical: 16 }} />

              <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
                🏆 Competition:
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Compete monthly for the highest score
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Monthly winners earn a star ⭐
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Track your progress on the leaderboard
              </Text>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowHowToPlay(false)} data-testid="close-how-to-play-button">
              Got it!
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default AuthDialogs;
