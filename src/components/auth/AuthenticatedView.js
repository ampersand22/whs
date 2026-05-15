import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Title,
  Button,
  Text,
  Avatar,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../ui/Logo";
import MenuModal from "../ui/MenuModal";
import useUserStore from "../../stores/userStore";
import { getTranslation } from "../../constants/translations";

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
  const { language } = useUserStore();

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <>
      {/* Logo */}
      <Logo size="medium" marginBottom={20} />

      {/* Welcome Card */}
      <Card style={styles.welcomeCard} data-testid="welcome-card">
        <View style={styles.welcomeCardContent}>
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
                  <Title
                    data-testid="welcome-title"
                    style={styles.welcomeTitle}
                  >
                    {getTranslation("welcomeBack", language)}!
                  </Title>
                  <Text style={styles.userName}>
                    {userData?.display_name || user?.email?.split("@")[0]}
                  </Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>
                    🏆 {getTranslation("highScore", language)}
                  </Text>
                  <Text style={styles.statValue} data-testid="user-stats">
                    {userData?.high_score || 0}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>
                    🎮 {getTranslation("gamesPlayed", language)}
                  </Text>
                  <Text style={styles.statValue}>
                    {userData?.total_games_played || 0}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </LinearGradient>
        </View>
      </Card>

      {/* Game Actions */}
      <View style={{ marginBottom: 20 }} data-testid="game-actions">
        {/* Menu and How to Play buttons side by side */}
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
            onPress={showMenu}
            style={{
              flex: 1,
              height: 48,
            }}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16 }}
            data-testid="menu-button"
          >
            {getTranslation("menu", language)}
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
            {getTranslation("howToPlay", language)}
          </Button>
        </View>

        {/* Play Game button full width */}
        <Button
          mode="contained"
          onPress={onPlayGame}
          style={{
            height: 48,
          }}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16 }}
          data-testid="play-game-button"
        >
          {getTranslation("playGame", language)}
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
          paddingBottom: 20, // Reduced padding since support button is positioned higher
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
  },
  welcomeCardContent: {
    overflow: "hidden",
    borderRadius: 16,
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
});

export default AuthenticatedView;
