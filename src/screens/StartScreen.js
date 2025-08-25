import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, ImageBackground, Dimensions, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../config/supabase";
import useUserStore from "../stores/userStore";
import LeaderboardModal from "../modals/LeaderboardModal";
import UnauthenticatedView from "../components/UnauthenticatedView";
import AuthenticatedView from "../components/AuthenticatedView";
import AuthDialogs from "../components/AuthDialogs";

const StartScreen = ({ navigation }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
  } = useUserStore();

  // Get screen dimensions for full coverage
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
      } else {
        setUserData(data);
      }
    } catch (error) {
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
    }
  };

  // Event handlers for authenticated view
  const handlePlayGame = () => navigation.navigate("Game");
  const handleShowLeaderboard = () => setShowLeaderboard(true);
  const handleEditProfile = () => navigation.navigate("Profile");
  const handleShowHowToPlay = () => setShowHowToPlay(true);

  // Event handlers for unauthenticated view
  const handleShowSignUp = () => setShowSignUp(true);
  const handleShowSignIn = () => setShowLogIn(true);

  if (isLoading) {
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
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 16 }}>Loading...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

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
      <SafeAreaView style={{ flex: 1 }} data-testid="start-screen">
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            style={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
              {!isAuthenticated ? (
                <UnauthenticatedView
                  onSignUp={handleShowSignUp}
                  onSignIn={handleShowSignIn}
                />
              ) : (
                <AuthenticatedView
                  userData={userData}
                  user={user}
                  onPlayGame={handlePlayGame}
                  onShowLeaderboard={handleShowLeaderboard}
                  onEditProfile={handleEditProfile}
                  onHowToPlay={handleShowHowToPlay}
                  onSignOut={handleSignOut}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* All Authentication Dialogs */}
        <AuthDialogs
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSignUp={handleSignUp}
          showLogIn={showLogIn}
          setShowLogIn={setShowLogIn}
          handleSignIn={handleSignIn}
          showHowToPlay={showHowToPlay}
          setShowHowToPlay={setShowHowToPlay}
          loading={loading}
        />

        {/* Leaderboard Modal */}
        <LeaderboardModal
          visible={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default StartScreen;
