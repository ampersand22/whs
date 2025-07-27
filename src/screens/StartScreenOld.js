import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  Text,
  Button,
  Divider,
  Card,
  Title,
  Provider,
  Surface,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import HowToPlayModal from "../modals/HowToPlayModal";
import LeaderboardModal from "../components/LeaderboardModal";
import SettingsMenu from "../components/SettingsMenu";
import useUserStore from "../stores/userStore";
import { setupAuthListener } from "../config/supabase";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StartScreen({ navigation }) {
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);

  // Zustand store
  const {
    user,
    isAuthenticated,
    isLoading,
    userStats,
    initialize,
    setUserSession,
    signOut,
    fetchUserStats,
  } = useUserStore();

  // Initialize auth and set up listener
  useEffect(() => {
    initialize();

    // Set up auth state listener
    const subscription = setupAuthListener((event, session) => {
      setUserSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Refresh stats when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats();
    }
  }, [isAuthenticated, user]);

  const handleAuthPress = () => {
    navigation.navigate("Auth");
  };

  const toggleLeaderboard = () => {
    setShowLeaderboardModal(!showLeaderboardModal);
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        console.log("User signed out successfully");
      } else {
        Alert.alert("Sign Out Error", result.error || "Failed to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
    }
  };

  const handleGameComplete = () => {
    // Refresh stats when returning from game
    fetchUserStats();
    // Refresh leaderboard
    setLeaderboardRefreshKey(prev => prev + 1);
  };

  // Calculate responsive sizes
  const logoWidth = Math.min(screenWidth * 0.85, 350); // 85% of screen width, max 350px
  const logoHeight = logoWidth * 0.43; // Maintain aspect ratio
  const buttonHeight = Math.min(60, screenHeight * 0.08); // 8% of screen height, max 60px
  const fontSize = Math.min(16, screenWidth / 25); // Responsive font size

  return (
    <Provider>
      <ImageBackground
        source={require("../../assets/background1.png")}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
        data-testid="start-screen-background"
      >
        <SafeAreaView
          style={{
            flex: 1,
            width: "100%",
          }}
          edges={["top", "left", "right"]}
          data-testid="start-screen-safe-area"
        >
          {/* Settings Button - Top Right */}
          <View style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
          }}>
            <SettingsMenu 
              iconColor="white"
              iconSize={28}
              contactEmail="ulmerinteractive@gmail.com"
              reportEmail="ulmerinteractive@gmail.com"
              navigation={navigation}
              showFullSettings={true}
            />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: Math.max(20, screenHeight * 0.03), // Responsive padding
                paddingHorizontal: Math.max(16, screenWidth * 0.04), // Responsive padding
                width: "100%",
              }}
              data-testid="start-screen-scroll-view"
            >
              <Image
                source={require("../../assets/wordhustle1.png")}
                style={{ 
                  width: logoWidth, 
                  height: logoHeight, 
                  resizeMode: "contain",
                  marginBottom: Math.max(10, screenHeight * 0.02), // Responsive margin
                }}
                data-testid="game-logo"
              />

              <Text
                variant="titleMedium"
                style={{
                  textAlign: "center",
                  marginBottom: Math.max(15, screenHeight * 0.02), // Responsive margin
                  color: "white",
                  fontWeight: "bold",
                  fontSize: Math.min(16, screenWidth / 24), // Responsive font size
                  paddingHorizontal: 10,
                }}
                data-testid="game-tagline"
              >
                Make as many words as possible in 3 minutes!
              </Text>

              <Divider 
                style={{ 
                  width: "80%", 
                  marginBottom: Math.max(15, screenHeight * 0.02) // Responsive margin
                }} 
                data-testid="divider-1"
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                  maxWidth: 500, // Maximum width for larger screens
                  gap: Math.max(8, screenWidth * 0.02), // Responsive gap
                }}
                data-testid="button-container"
              >
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate("Game", { onGameComplete: handleGameComplete })}
                  style={{
                    flex: 1,
                    height: buttonHeight,
                    justifyContent: "center",
                    backgroundColor: "#6200ea",
                  }}
                  labelStyle={{
                    fontSize: fontSize,
                    fontWeight: "bold",
                    color: "white",
                  }}
                  data-testid="start-game-button"
                >
                  Start Game
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => setShowHowToPlayModal(true)}
                  style={{
                    flex: 1,
                    height: buttonHeight,
                    justifyContent: "center",
                    borderColor: "white",
                  }}
                  labelStyle={{
                    fontSize: fontSize,
                    fontWeight: "bold",
                    color: "white",
                  }}
                  data-testid="how-to-play-button"
                >
                  How to Play
                </Button>
              </View>

              <Button
                mode="outlined"
                onPress={toggleLeaderboard}
                style={{
                  marginTop: Math.max(15, screenHeight * 0.02), // Responsive margin
                  borderColor: "white",
                  width: "90%",
                  maxWidth: 500, // Maximum width for larger screens
                  height: Math.max(45, buttonHeight * 0.8), // Slightly smaller than main buttons
                }}
                labelStyle={{ 
                  fontSize: fontSize,
                  color: "white" 
                }}
                icon="trophy"
                data-testid="leaderboard-button"
              >
                Leaderboard
              </Button>

              <Divider 
                style={{ 
                  width: "80%", 
                  marginVertical: Math.max(15, screenHeight * 0.02) // Responsive margin
                }} 
                data-testid="divider-2"
              />

              {/* Auth Status */}
              <View 
                style={{ 
                  alignItems: "center", 
                  width: "90%",
                  maxWidth: 500, // Maximum width for larger screens
                }}
                data-testid="auth-status-container"
              >
                {isAuthenticated ? (
                  <View style={{ alignItems: "center", width: "100%" }}>
                    {/* User info and stats in the same box */}
                    <Surface
                      style={{
                        width: "100%",
                        padding: Math.max(12, screenWidth * 0.03), // Responsive padding
                        borderRadius: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        marginBottom: Math.max(12, screenHeight * 0.015), // Responsive margin
                      }}
                      data-testid="user-profile-box"
                    >
                      <Text 
                        style={{ 
                          color: "#333", 
                          fontWeight: "bold",
                          fontSize: Math.min(16, screenWidth / 25), // Responsive font size
                          textAlign: "center",
                          marginBottom: 8
                        }}
                        data-testid="user-info-text"
                      >
                        {user?.user_metadata?.display_name || user?.email}
                      </Text>
                      
                      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 5 }}>
                        {userStats.highScore > 0 && (
                          <Text
                            style={{
                              fontSize: Math.min(14, screenWidth / 28),
                              fontWeight: "bold",
                              color: "#6200ea",
                              textAlign: "center",
                            }}
                            data-testid="high-score-text"
                          >
                            High Score: {userStats.highScore}
                          </Text>
                        )}
                        
                        {userStats.totalGamesPlayed > 0 && (
                          <Text
                            style={{
                              fontSize: Math.min(14, screenWidth / 28),
                              fontWeight: "600",
                              color: "#333",
                              textAlign: "center",
                            }}
                            data-testid="total-games-text"
                          >
                            Games: {userStats.totalGamesPlayed}
                          </Text>
                        )}
                      </View>

                      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        {userStats.totalStars > 0 && (
                          <Text
                            style={{
                              fontSize: Math.min(14, screenWidth / 28),
                              fontWeight: "600",
                              color: "#FFD700",
                              textAlign: "center",
                            }}
                            data-testid="total-stars-text"
                          >
                            ⭐ {userStats.totalStars} Stars
                          </Text>
                        )}
                        
                        {userStats.monthlyRank && (
                          <Text
                            style={{
                              fontSize: Math.min(14, screenWidth / 28),
                              fontWeight: "600",
                              color: "#FF6B35",
                              textAlign: "center",
                            }}
                            data-testid="monthly-rank-text"
                          >
                            Rank: #{userStats.monthlyRank}
                          </Text>
                        )}
                      </View>
                    </Surface>
                    
                    <View 
                      style={{ 
                        flexDirection: "row", 
                        gap: Math.max(8, screenWidth * 0.02), // Responsive gap
                        width: "100%" 
                      }}
                      data-testid="auth-buttons-container"
                    >
                      <Button
                        mode="outlined"
                        onPress={() => navigation.navigate("Profile")}
                        style={{
                          borderColor: "white",
                          flex: 1,
                          height: Math.max(40, buttonHeight * 0.7), // Responsive height
                        }}
                        labelStyle={{ 
                          color: "white",
                          fontSize: Math.min(14, fontSize * 0.9), // Slightly smaller than main buttons
                        }}
                        data-testid="profile-button"
                      >
                        View Profile
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={handleSignOut}
                        style={{
                          borderColor: "white",
                          backgroundColor: "#6200ea",
                          flex: 1,
                          height: Math.max(40, buttonHeight * 0.7), // Responsive height
                        }}
                        labelStyle={{ 
                          color: "white",
                          fontSize: Math.min(14, fontSize * 0.9), // Slightly smaller than main buttons
                        }}
                        icon="logout"
                        data-testid="sign-out-button"
                      >
                        Sign Out
                      </Button>
                    </View>
                  </View>
                ) : (
                  <Button
                    mode="outlined"
                    onPress={handleAuthPress}
                    style={{
                      borderColor: "white",
                      width: "90%",
                      maxWidth: 500, // Maximum width for larger screens
                      height: Math.max(45, buttonHeight * 0.8), // Responsive height
                    }}
                    labelStyle={{ 
                      color: "white",
                      fontSize: fontSize,
                    }}
                    contentStyle={{
                      justifyContent: "center",
                    }}
                    data-testid="sign-in-button"
                  >
                    Sign In / Register
                  </Button>
                )}
              </View>

              {/* Copyright text - bottom left */}
              <View 
                style={{ 
                  position: 'absolute',
                  bottom: Math.max(10, screenHeight * 0.015),
                  left: Math.max(15, screenWidth * 0.04),
                }}
                data-testid="copyright-container"
              >
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: Math.min(12, screenWidth / 35),
                    fontWeight: '500',
                  }}
                  data-testid="copyright-text"
                >
                  © 2025 Ulmer Interactive, LLC
                </Text>
              </View>

              {/* Modals */}
              <HowToPlayModal
                visible={showHowToPlayModal}
                onClose={() => setShowHowToPlayModal(false)}
                data-testid="how-to-play-modal"
              />

              <LeaderboardModal
                visible={showLeaderboardModal}
                onClose={() => setShowLeaderboardModal(false)}
                key={`leaderboard-modal-${leaderboardRefreshKey}`}
                data-testid="leaderboard-modal"
                onRefresh={fetchUserStats}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </Provider>
  );
}
