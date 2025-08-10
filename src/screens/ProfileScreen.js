import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, ImageBackground } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  Divider,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../config/supabase";
import useUserStore from "../stores/userStore";
import { getResponsiveDimensions, isTablet } from "../utils/responsive";

const ProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useUserStore();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("whs-users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      } else {
        setUserData(data);
        setDisplayName(data.display_name || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("whs-users")
        .update({ display_name: displayName.trim() })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        Alert.alert("Error", "Failed to update profile");
      } else {
        Alert.alert("Success", "Profile updated successfully!");
        // Reload user data to reflect changes
        await loadUserData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        Alert.alert("Error", "Current password is incorrect");
        setSaving(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        Alert.alert("Error", "Failed to update password");
      } else {
        Alert.alert("Success", "Password updated successfully!");
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../../assets/background4.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="white" />
            <Text style={{ marginTop: 16, color: "white", fontSize: 16 }}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/background4.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }} data-testid="profile-screen">
        {/* Header */}
        <View 
          style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            padding: 16,
            backgroundColor: "transparent"
          }}
          data-testid="profile-header"
        >
          <IconButton
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: 'white',
              margin: 0
            }}
            iconColor="#333"
            data-testid="back-button"
          />
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Profile Info Card */}
          <Card style={{ marginBottom: 20, elevation: 4 }} data-testid="profile-info-card">
            <Card.Content>
              <Title style={{ marginBottom: 16 }}>Profile Information</Title>
              
              {/* Email (Read-only) */}
              <TextInput
                label="Email"
                value={user?.email || ""}
                disabled
                style={{ 
                  marginBottom: 16,
                  backgroundColor: "#f5f5f5"
                }}
                textColor="#666"
                data-testid="email-input"
              />

              {/* Display Name */}
              <TextInput
                label="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                style={{ marginBottom: 16 }}
                data-testid="display-name-input"
              />

              {/* Stats */}
              {userData && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
                    Game Statistics
                  </Text>
                  <Text style={{ fontSize: 14, marginBottom: 4 }}>
                    High Score: {userData.high_score || 0}
                  </Text>
                  <Text style={{ fontSize: 14, marginBottom: 4 }}>
                    Games Played: {userData.games_played || 0}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    Stars Earned: {userData.total_stars || 0} ⭐
                  </Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={handleUpdateProfile}
                loading={saving}
                disabled={saving}
                style={{ marginTop: 8 }}
                data-testid="update-profile-button"
              >
                Update Profile
              </Button>
            </Card.Content>
          </Card>

          {/* Change Password Card */}
          <Card style={{ marginBottom: 20, elevation: 4 }} data-testid="password-card">
            <Card.Content>
              <Title style={{ marginBottom: 16 }}>Change Password</Title>
              
              <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={{ marginBottom: 12 }}
                data-testid="current-password-input"
              />

              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={{ marginBottom: 12 }}
                data-testid="new-password-input"
              />

              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={{ marginBottom: 16 }}
                data-testid="confirm-password-input"
              />

              <Button
                mode="outlined"
                onPress={handleChangePassword}
                loading={saving}
                disabled={saving}
                data-testid="change-password-button"
              >
                Change Password
              </Button>
            </Card.Content>
          </Card>

          {/* Account Info */}
          <Card style={{ marginBottom: 20, elevation: 4 }} data-testid="account-info-card">
            <Card.Content>
              <Title style={{ marginBottom: 16 }}>Account Information</Title>
              
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                Account created: {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : "Unknown"}
              </Text>
              
              <Text style={{ fontSize: 14, color: "#666" }}>
                Last played: {userData?.last_played ? new Date(userData.last_played).toLocaleDateString() : "Never"}
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;
