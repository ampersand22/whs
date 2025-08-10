import React from "react";
import { ScrollView } from "react-native";
import { Portal, Dialog, Button, TextInput, Text, Divider } from "react-native-paper";

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
  return (
    <>
      {/* Sign Up Dialog */}
      <Portal>
        <Dialog visible={showSignUp} onDismiss={() => setShowSignUp(false)} data-testid="sign-up-dialog">
          <Dialog.Title>Create Account</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              style={{ marginBottom: 12 }}
              data-testid="display-name-input"
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 12 }}
              data-testid="email-input"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ marginBottom: 12 }}
              data-testid="password-input"
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              data-testid="confirm-password-input"
            />
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
        <Dialog visible={showLogIn} onDismiss={() => setShowLogIn(false)} data-testid="sign-in-dialog">
          <Dialog.Title>Sign In</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 12 }}
              data-testid="email-input"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              data-testid="password-input"
            />
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
