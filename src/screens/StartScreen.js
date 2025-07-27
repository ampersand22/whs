import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
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
import { supabase } from "../config/supabase";
import useUserStore from "../stores/userStore";

const StartScreen = ({ navigation }) => {
  const {
    signUp,
    signIn,
    signOut,
    isLoading,
    isAuthenticated,
    user,
    userStats,
  } = useUserStore();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [userData, setUserData] = useState(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user data and leaderboard when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
      loadLeaderboard();
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

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const { data, error } = await supabase.rpc("get_enhanced_leaderboard", {
        p_year: currentYear,
        p_month: currentMonth,
        p_limit: 10,
      });

      if (error) {
        console.error("Error loading leaderboard:", error);
      } else {
        setLeaderboard(data || []);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setDisplayName("");
    setConfirmPassword("");
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(
        email.toLowerCase().trim(),
        password,
        displayName.trim()
      );

      if (result.success) {
        Alert.alert(
          "Success!",
          "Account created successfully! You can now log in.",
          [
            {
              text: "OK",
              onPress: () => {
                setShowSignUp(false);
                resetForm();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Sign Up Failed",
          result.error || "An error occurred during sign up"
        );
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert(
        "Sign Up Failed",
        error.message || "An error occurred during sign up"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email.toLowerCase().trim(), password);

      if (result.success) {
        setShowLogIn(false);
        resetForm();
        // Navigation will be handled by the user store state change
      } else {
        let errorMessage = "Invalid email or password";
        if (result.error.includes("Invalid login credentials")) {
          errorMessage =
            "Invalid email or password. Make sure you have an account and your email is verified.";
        } else if (result.error.includes("Email not confirmed")) {
          errorMessage =
            "Please check your email and click the confirmation link before logging in.";
        }
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setLeaderboard([]);
      setUserData(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const closeDialogs = () => {
    setShowSignUp(false);
    setShowLogIn(false);
    setShowHowToPlay(false);
    resetForm();
  };

  // If user is authenticated, show the authenticated view
  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={styles.container} data-testid="authenticated-screen">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* User Profile Card */}
            <Card style={styles.profileCard} data-testid="profile-card">
              <Card.Content style={styles.profileContent}>
                <View style={styles.profileHeader}>
                  <Avatar.Text
                    size={60}
                    label={
                      userData?.display_name?.charAt(0) || user.email.charAt(0)
                    }
                    data-testid="user-avatar"
                  />
                  <View style={styles.profileInfo}>
                    <Title
                      style={styles.displayName}
                      data-testid="display-name"
                    >
                      {userData?.display_name || user.email.split("@")[0]}
                    </Title>
                    <Paragraph data-testid="high-score">
                      High Score: {userData?.high_score || 0}
                    </Paragraph>
                    <Paragraph data-testid="total-games">
                      Games Played: {userData?.total_games_played || 0}
                    </Paragraph>
                    {userData?.total_stars > 0 && (
                      <Paragraph data-testid="total-stars">
                        ⭐ Stars: {userData.total_stars}
                      </Paragraph>
                    )}
                  </View>
                  <IconButton
                    icon="logout"
                    onPress={handleSignOut}
                    data-testid="logout-button"
                  />
                </View>
              </Card.Content>
            </Card>

            {/* Game Actions */}
            <View style={styles.gameActions} data-testid="game-actions">
              <Button
                mode="contained"
                onPress={() => navigation.navigate("Game")}
                style={styles.playButton}
                contentStyle={styles.buttonContent}
                data-testid="play-game-button"
              >
                Play Game
              </Button>

              <Button
                mode="outlined"
                onPress={() => setShowHowToPlay(true)}
                style={styles.secondaryButton}
                contentStyle={styles.buttonContent}
                data-testid="how-to-play-button"
              >
                How to Play
              </Button>
            </View>

            {/* Leaderboard Card */}
            <Card style={styles.leaderboardCard} data-testid="leaderboard-card">
              <Card.Content>
                <View style={styles.leaderboardHeader}>
                  <Title data-testid="leaderboard-title">
                    Monthly Leaderboard
                  </Title>
                  <IconButton
                    icon="refresh"
                    onPress={loadLeaderboard}
                    disabled={loadingLeaderboard}
                    data-testid="refresh-leaderboard-button"
                  />
                </View>

                {loadingLeaderboard ? (
                  <View
                    style={styles.loadingContainer}
                    data-testid="leaderboard-loading"
                  >
                    <ActivityIndicator size="small" />
                    <Text>Loading leaderboard...</Text>
                  </View>
                ) : leaderboard.length > 0 ? (
                  <View data-testid="leaderboard-list">
                    {leaderboard.map((entry, index) => (
                      <List.Item
                        key={entry.user_id}
                        title={entry.display_name}
                        description={`Score: ${entry.highest_score} • Games: ${entry.total_games}`}
                        left={() => (
                          <View style={styles.rankContainer}>
                            <Text
                              style={[
                                styles.rankText,
                                index === 0 && styles.firstPlace,
                                index === 1 && styles.secondPlace,
                                index === 2 && styles.thirdPlace,
                              ]}
                            >
                              #{entry.rank}
                            </Text>
                            {entry.total_stars > 0 && (
                              <Text style={styles.starText}>
                                ⭐{entry.total_stars}
                              </Text>
                            )}
                          </View>
                        )}
                        right={() =>
                          entry.is_current_winner && (
                            <Avatar.Icon
                              size={24}
                              icon="crown"
                              style={styles.crownIcon}
                            />
                          )
                        }
                        style={[
                          styles.leaderboardItem,
                          entry.user_id === user?.id && styles.currentUserItem,
                        ]}
                        data-testid={`leaderboard-item-${index}`}
                      />
                    ))}
                  </View>
                ) : (
                  <Text
                    style={styles.emptyText}
                    data-testid="leaderboard-empty"
                  >
                    No leaderboard data yet. Play some games to see rankings!
                  </Text>
                )}
              </Card.Content>
            </Card>
          </View>
        </ScrollView>

        {/* How to Play Dialog */}
        <Portal>
          <Dialog
            visible={showHowToPlay}
            onDismiss={closeDialogs}
            data-testid="how-to-play-dialog"
          >
            <Dialog.Title>How to Play</Dialog.Title>
            <Dialog.Content>
              <ScrollView style={styles.howToPlayContent}>
                <Text style={styles.howToPlayText}>
                  🎯 <Text style={styles.bold}>Objective:</Text> Find as many
                  words as possible within the time limit!
                </Text>

                <Divider style={styles.divider} />

                <Text style={styles.howToPlayText}>
                  🎮 <Text style={styles.bold}>Gameplay:</Text>
                </Text>
                <Text style={styles.howToPlayText}>
                  • Swipe to connect letters and form words
                </Text>
                <Text style={styles.howToPlayText}>
                  • Words must be at least 3 letters long
                </Text>
                <Text style={styles.howToPlayText}>
                  • Each letter can only be used once per word
                </Text>
                <Text style={styles.howToPlayText}>
                  • Longer words score more points
                </Text>

                <Divider style={styles.divider} />

                <Text style={styles.howToPlayText}>
                  🏆 <Text style={styles.bold}>Competition:</Text>
                </Text>
                <Text style={styles.howToPlayText}>
                  • Compete monthly for the highest score
                </Text>
                <Text style={styles.howToPlayText}>
                  • Monthly winners earn a star ⭐
                </Text>
                <Text style={styles.howToPlayText}>
                  • Track your progress on the leaderboard
                </Text>

                <Divider style={styles.divider} />

                <Text style={styles.howToPlayText}>
                  📊 <Text style={styles.bold}>Scoring:</Text>
                </Text>
                <Text style={styles.howToPlayText}>• 3 letters: 1 point</Text>
                <Text style={styles.howToPlayText}>• 4 letters: 2 points</Text>
                <Text style={styles.howToPlayText}>
                  • 5+ letters: 3+ points
                </Text>
                <Text style={styles.howToPlayText}>
                  • Bonus points for rare letters
                </Text>
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={closeDialogs}
                data-testid="how-to-play-close-button"
              >
                Got It!
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    );
  }

  // If user is not authenticated, show the login/signup view
  return (
    <SafeAreaView style={styles.container} data-testid="start-screen">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Main Title Card */}
          <Card style={styles.titleCard} data-testid="title-card">
            <Card.Content style={styles.titleContent}>
              <Title style={styles.gameTitle} data-testid="game-title">
                Word Hunt
              </Title>
              <Paragraph
                style={styles.gameSubtitle}
                data-testid="game-subtitle"
              >
                Challenge your vocabulary and compete for monthly stars!
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttonContainer} data-testid="auth-buttons">
            <Button
              mode="contained"
              onPress={() => setShowSignUp(true)}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              data-testid="signup-button"
            >
              Sign Up
            </Button>

            <Button
              mode="outlined"
              onPress={() => setShowLogIn(true)}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              data-testid="login-button"
            >
              Log In
            </Button>

            <Button
              mode="text"
              onPress={() => setShowHowToPlay(true)}
              style={styles.textButton}
              contentStyle={styles.buttonContent}
              data-testid="how-to-play-button"
            >
              How to Play
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Sign Up Dialog */}
      <Portal>
        <Dialog
          visible={showSignUp}
          onDismiss={closeDialogs}
          data-testid="signup-dialog"
        >
          <Dialog.Title>Create Account</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              style={styles.input}
              disabled={loading}
              data-testid="signup-display-name-input"
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={loading}
              data-testid="signup-email-input"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              disabled={loading}
              data-testid="signup-password-input"
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              disabled={loading}
              data-testid="signup-confirm-password-input"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={closeDialogs}
              disabled={loading}
              data-testid="signup-cancel-button"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSignUp}
              disabled={loading}
              data-testid="signup-submit-button"
            >
              {loading ? <ActivityIndicator size="small" /> : "Sign Up"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Log In Dialog */}
      <Portal>
        <Dialog
          visible={showLogIn}
          onDismiss={closeDialogs}
          data-testid="login-dialog"
        >
          <Dialog.Title>Log In</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={loading}
              data-testid="login-email-input"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              disabled={loading}
              data-testid="login-password-input"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={closeDialogs}
              disabled={loading}
              data-testid="login-cancel-button"
            >
              Cancel
            </Button>
            <Button
              onPress={handleLogIn}
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? <ActivityIndicator size="small" /> : "Log In"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* How to Play Dialog */}
      <Portal>
        <Dialog
          visible={showHowToPlay}
          onDismiss={closeDialogs}
          data-testid="how-to-play-dialog"
        >
          <Dialog.Title>How to Play</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.howToPlayContent}>
              <Text style={styles.howToPlayText}>
                🎯 <Text style={styles.bold}>Objective:</Text> Find as many
                words as possible within the time limit!
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.howToPlayText}>
                🎮 <Text style={styles.bold}>Gameplay:</Text>
              </Text>
              <Text style={styles.howToPlayText}>
                • Swipe to connect letters and form words
              </Text>
              <Text style={styles.howToPlayText}>
                • Words must be at least 3 letters long
              </Text>
              <Text style={styles.howToPlayText}>
                • Each letter can only be used once per word
              </Text>
              <Text style={styles.howToPlayText}>
                • Longer words score more points
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.howToPlayText}>
                🏆 <Text style={styles.bold}>Competition:</Text>
              </Text>
              <Text style={styles.howToPlayText}>
                • Compete monthly for the highest score
              </Text>
              <Text style={styles.howToPlayText}>
                • Monthly winners earn a star ⭐
              </Text>
              <Text style={styles.howToPlayText}>
                • Track your progress on the leaderboard
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.howToPlayText}>
                📊 <Text style={styles.bold}>Scoring:</Text>
              </Text>
              <Text style={styles.howToPlayText}>• 3 letters: 1 point</Text>
              <Text style={styles.howToPlayText}>• 4 letters: 2 points</Text>
              <Text style={styles.howToPlayText}>• 5+ letters: 3+ points</Text>
              <Text style={styles.howToPlayText}>
                • Bonus points for rare letters
              </Text>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={closeDialogs}
              data-testid="how-to-play-close-button"
            >
              Got It!
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  // Title card styles (for unauthenticated view)
  titleCard: {
    marginBottom: 40,
    elevation: 4,
  },
  titleContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  gameSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },

  // Button styles
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  textButton: {
    marginTop: 8,
  },
  playButton: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },

  // Profile card styles (for authenticated view)
  profileCard: {
    marginBottom: 20,
    elevation: 4,
  },
  profileContent: {
    paddingVertical: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  // Game actions
  gameActions: {
    marginBottom: 20,
    gap: 12,
  },

  // Leaderboard styles
  leaderboardCard: {
    elevation: 4,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 20,
  },
  leaderboardItem: {
    paddingVertical: 8,
  },
  currentUserItem: {
    backgroundColor: "rgba(103, 80, 164, 0.1)",
  },
  rankContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  firstPlace: {
    color: "#FFD700",
  },
  secondPlace: {
    color: "#C0C0C0",
  },
  thirdPlace: {
    color: "#CD7F32",
  },
  starText: {
    fontSize: 12,
    marginTop: 2,
  },
  crownIcon: {
    backgroundColor: "#FFD700",
  },
  emptyText: {
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
    paddingVertical: 20,
  },

  // Form styles
  input: {
    marginBottom: 12,
  },

  // How to play styles
  howToPlayContent: {
    maxHeight: 400,
  },
  howToPlayText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
});

export default StartScreen;
