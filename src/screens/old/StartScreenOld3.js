import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, Image } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Portal,
  Dialog,
  Divider,
  Text,
  ActivityIndicator,
  List,
  Avatar,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../config/supabase";
import useUserStore from "../../stores/userStore";
import LeaderboardModal from "../../modals/LeaderboardModal";

const StartScreen = ({ navigation }) => {
  const { user, isAuthenticated, isLoading, signUp, signIn, signOut } =
    useUserStore();

  // Modal states
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("whs-users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading user data:", error);
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setConfirmPassword("");
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password, displayName);
      if (result.success) {
        Alert.alert("Success", "Account created successfully!");
        setShowSignUp(false);
        resetForm();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        setShowLogIn(false);
        resetForm();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserData(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      data-testid="start-screen"
    >
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
          {!isAuthenticated ? (
            // Unauthenticated View
            <>
              {/* Logo */}
              <View
                style={{ alignItems: "center", marginBottom: 30 }}
                data-testid="logo-container"
              >
                <Image
                  source={require("../../assets/wordhustle1.png")}
                  style={{
                    width: 280,
                    height: 70,
                    resizeMode: "contain",
                  }}
                  data-testid="app-logo"
                />
              </View>

              {/* Title Card */}
              <Card
                style={{ marginBottom: 40, elevation: 4 }}
                data-testid="title-card"
              >
                <Card.Content
                  style={{ alignItems: "center", paddingVertical: 20 }}
                >
                  <Title
                    style={{
                      fontSize: 32,
                      fontWeight: "bold",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Word Hunt
                  </Title>
                  <Paragraph
                    style={{ fontSize: 16, textAlign: "center", opacity: 0.7 }}
                  >
                    Find words, compete monthly, earn stars!
                  </Paragraph>
                </Card.Content>
              </Card>

              {/* Auth Buttons */}
              <View style={{ marginBottom: 20 }} data-testid="auth-buttons">
                <Button
                  mode="contained"
                  onPress={() => setShowSignUp(true)}
                  style={{ marginBottom: 12, height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="sign-up-button"
                >
                  Create Account
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => setShowLogIn(true)}
                  style={{ marginBottom: 12, height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="sign-in-button"
                >
                  Sign In
                </Button>

                <Button
                  mode="text"
                  onPress={() => setShowHowToPlay(true)}
                  style={{ height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="how-to-play-button"
                >
                  How to Play
                </Button>
              </View>
            </>
          ) : (
            // Authenticated View
            <>
              {/* Logo */}
              <View
                style={{ alignItems: "center", marginBottom: 20 }}
                data-testid="logo-container"
              >
                <Image
                  source={require("../../assets/wordhustle1.png")}
                  style={{
                    width: 240,
                    height: 60,
                    resizeMode: "contain",
                  }}
                  data-testid="app-logo"
                />
              </View>

              {/* Welcome Card */}
              <Card
                style={{ marginBottom: 20, elevation: 4 }}
                data-testid="welcome-card"
              >
                <Card.Content>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Title data-testid="welcome-title">
                        Welcome back,{" "}
                        {userData?.display_name || user?.email?.split("@")[0]}!
                      </Title>
                      <Paragraph data-testid="user-stats">
                        High Score: {userData?.high_score || 0}
                      </Paragraph>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Game Actions */}
              <View style={{ marginBottom: 20 }} data-testid="game-actions">
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate("Game")}
                  style={{ marginBottom: 12, height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="play-game-button"
                >
                  Play Game
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => setShowLeaderboard(true)}
                  style={{ marginBottom: 12, height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="leaderboard-button"
                >
                  🏆 Leaderboard
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("Profile")}
                  style={{ marginBottom: 12, height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="edit-profile-button"
                >
                  👤 Edit Profile
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => setShowHowToPlay(true)}
                  style={{ marginBottom: 12, height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="how-to-play-button"
                >
                  How to Play
                </Button>

                <Button
                  mode="text"
                  onPress={handleSignOut}
                  style={{ height: 48 }}
                  contentStyle={{ height: 48 }}
                  data-testid="sign-out-button"
                >
                  Sign Out
                </Button>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sign Up Dialog */}
      <Portal>
        <Dialog
          visible={showSignUp}
          onDismiss={() => setShowSignUp(false)}
          data-testid="sign-up-dialog"
        >
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
            <Button
              onPress={() => setShowSignUp(false)}
              data-testid="cancel-sign-up-button"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSignUp}
              loading={loading}
              data-testid="create-account-button"
            >
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
        >
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
            <Button
              onPress={() => setShowLogIn(false)}
              data-testid="cancel-sign-in-button"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSignIn}
              loading={loading}
              data-testid="sign-in-submit-button"
            >
              Sign In
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* How to Play Dialog */}
      <Portal>
        <Dialog
          visible={showHowToPlay}
          onDismiss={() => setShowHowToPlay(false)}
          data-testid="how-to-play-dialog"
        >
          <Dialog.Title>How to Play</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text
                style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}
              >
                🎯 Objective:
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 8 }}>
                • Find as many words as possible in 3 minutes
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 16 }}>
                • Score points based on word length and board number
              </Text>

              <Divider style={{ marginVertical: 16 }} />

              <Text
                style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}
              >
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

              <Text
                style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}
              >
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
            <Button
              onPress={() => setShowHowToPlay(false)}
              data-testid="close-how-to-play-button"
            >
              Got it!
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Leaderboard Modal */}
      <LeaderboardModal
        visible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </SafeAreaView>
  );
};

export default StartScreen;
