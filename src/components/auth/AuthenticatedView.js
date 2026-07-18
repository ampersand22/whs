import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
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
import { isTablet } from "../../constants/responsive";

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
  const { width, height } = useWindowDimensions();
  const tablet = isTablet(width, height);

  const buttonHeight = tablet ? 90 : 48;
  const buttonFontSize = tablet ? 28 : 16;
  const maxContentWidth = tablet ? 540 : undefined;

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <View style={tablet ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : undefined}>
      {/* Logo */}
      <Logo size={tablet ? "large" : "medium"} marginBottom={tablet ? 40 : 20} />

      {/* Welcome Card */}
      <Card style={[styles.welcomeCard, tablet && { width: maxContentWidth, marginBottom: 32 }]} data-testid="welcome-card">
        <View style={styles.welcomeCardContent}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <Card.Content style={[styles.cardContent, tablet && { padding: 32 }]}>
              <View style={styles.welcomeHeader}>
                <Avatar.Icon
                  size={tablet ? 70 : 50}
                  icon="account-circle"
                  style={styles.avatar}
                  color="#fff"
                />
                <View style={styles.welcomeText}>
                  <Title
                    data-testid="welcome-title"
                    style={[styles.welcomeTitle, tablet && { fontSize: 34 }]}
                  >
                    {getTranslation("welcomeBack", language)}!
                  </Title>
                  <Text style={[styles.userName, tablet && { fontSize: 24 }]}>
                    {userData?.display_name || user?.email?.split("@")[0]}
                  </Text>
                </View>
              </View>

              <View style={[styles.statsContainer, tablet && { padding: 20 }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, tablet && { fontSize: 18 }]}>
                    🏆 {getTranslation("highScore", language)}
                  </Text>
                  <Text style={[styles.statValue, tablet && { fontSize: 30 }]} data-testid="user-stats">
                    {userData?.high_score || 0}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, tablet && { fontSize: 18 }]}>
                    🎮 {getTranslation("gamesPlayed", language)}
                  </Text>
                  <Text style={[styles.statValue, tablet && { fontSize: 30 }]}>
                    {userData?.total_games_played || 0}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </LinearGradient>
        </View>
      </Card>

      {/* Game Actions */}
      <View style={{ marginBottom: 20, width: '100%', maxWidth: maxContentWidth }} data-testid="game-actions">
        {/* Menu and How to Play buttons side by side */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: tablet ? 28 : 20,
            gap: tablet ? 16 : 10,
          }}
        >
          <Button
            mode="contained"
            onPress={showMenu}
            style={{
              flex: 1,
              minHeight: buttonHeight,
              justifyContent: 'center',
            }}
            contentStyle={{ minHeight: buttonHeight, paddingVertical: tablet ? 16 : 0 }}
            labelStyle={{ fontSize: buttonFontSize, lineHeight: tablet ? buttonFontSize * 1.4 : undefined }}
            data-testid="menu-button"
          >
            {getTranslation("menu", language)}
          </Button>

          <Button
            mode="contained"
            onPress={onHowToPlay}
            style={{
              flex: 1,
              minHeight: buttonHeight,
              justifyContent: 'center',
            }}
            contentStyle={{ minHeight: buttonHeight, paddingVertical: tablet ? 16 : 0 }}
            labelStyle={{ fontSize: buttonFontSize, lineHeight: tablet ? buttonFontSize * 1.4 : undefined }}
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
            minHeight: buttonHeight,
            justifyContent: 'center',
          }}
          contentStyle={{ minHeight: buttonHeight, paddingVertical: tablet ? 16 : 0 }}
          labelStyle={{ fontSize: buttonFontSize, lineHeight: tablet ? buttonFontSize * 1.4 : undefined }}
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
          paddingBottom: 20,
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
    </View>
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
