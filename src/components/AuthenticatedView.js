import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Avatar,
  Chip,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "./Logo";
import MenuModal from "./MenuModal";

const AuthenticatedView = ({
  userData,
  user,
  onPlayGame,
  onShowLeaderboard,
  onEditProfile,
  onHowToPlay,
  onSignOut,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <>
      {/* Logo */}
      <Logo size="medium" marginBottom={20} />

      {/* Welcome Card */}
      <Card style={styles.welcomeCard} data-testid="welcome-card">
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.welcomeHeader}>
              <Avatar.Icon
                size={50}
                icon="account-circle"
                style={styles.avatar}
                color="#fff"
              />
              <View style={styles.welcomeText}>
                <Title data-testid="welcome-title" style={styles.welcomeTitle}>
                  Welcome back! 👋
                </Title>
                <Text style={styles.userName}>
                  {userData?.display_name || user?.email?.split("@")[0]}
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>🏆 High Score</Text>
                <Text style={styles.statValue} data-testid="user-stats">
                  {userData?.high_score || 0}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>🎮 Games Played</Text>
                <Text style={styles.statValue}>
                  {userData?.total_games_played || 0}
                </Text>
              </View>

              {userData?.total_stars > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>⭐ Stars</Text>
                  <Text style={styles.statValue}>
                    {userData?.total_stars}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>

      {/* Game Actions */}
      <View style={{ marginBottom: 20 }} data-testid="game-actions">
        {/* Play Game and How to Play buttons side by side */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            gap: 10,
          }}
        >
          <Button
            mode="contained"
            onPress={onPlayGame}
            style={{
              flex: 1,
              height: 48,
            }}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16 }}
            data-testid="play-game-button"
          >
            Play Game
          </Button>

          <Button
            mode="contained"
            onPress={onHowToPlay}
            style={{
              flex: 1,
              height: 48,
            }}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16 }}
            data-testid="how-to-play-button"
          >
            How to Play
          </Button>
        </View>

        {/* Menu Button */}
        <Button
          mode="outlined"
          onPress={showMenu}
          style={{
            height: 48,
            borderColor: "white",
            backgroundColor: "transparent",
          }}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16, color: "white" }}
          data-testid="menu-button"
        >
          Menu
        </Button>
      </View>

      {/* Menu Modal */}
      <MenuModal
        visible={menuVisible}
        onClose={hideMenu}
        onShowLeaderboard={onShowLeaderboard}
        onEditProfile={onEditProfile}
        onSignOut={onSignOut}
      />

      {/* Copyright Footer */}
      <View
        style={{
          marginTop: "auto",
          paddingTop: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
          }}
        >
          © 2025 UA Interactive
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  welcomeCard: {
    marginBottom: 20,
    elevation: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBackground: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 20,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  motivationChip: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  chipText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default AuthenticatedView;
