import React, { useState } from "react";
import { View } from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import Logo from "./Logo";
import MenuModal from "./MenuModal";

const AuthenticatedView = ({ 
  userData,
  user,
  onPlayGame,
  onShowLeaderboard,
  onEditProfile,
  onHowToPlay,
  onSignOut
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);

  return (
    <>
      {/* Logo */}
      <Logo size="medium" marginBottom={20} />

      {/* Welcome Card */}
      <Card style={{ marginBottom: 20, elevation: 4 }} data-testid="welcome-card">
        <Card.Content>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Title 
                data-testid="welcome-title"
                style={{ 
                  fontSize: 20, 
                  fontWeight: '600',
                  marginBottom: 4
                }}
              >
                Welcome back, {userData?.display_name || user?.email?.split("@")[0]}!
              </Title>
              <Paragraph 
                data-testid="user-stats"
                style={{
                  fontSize: 16,
                  color: '#666'
                }}
              >
                High Score: {userData?.high_score || 0}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Game Actions */}
      <View style={{ marginBottom: 20 }} data-testid="game-actions">
        {/* Play Game and How to Play buttons side by side */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginBottom: 20,
          gap: 10
        }}>
          <Button
            mode="contained"
            onPress={onPlayGame}
            style={{ 
              flex: 1,
              height: 48 
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
              height: 48 
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
            borderColor: 'white',
            backgroundColor: 'transparent'
          }}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16, color: 'white' }}
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
      <View style={{
        marginTop: 'auto',
        paddingTop: 20,
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}>
          © 2025 UA Interactive
        </Text>
      </View>
    </>
  );
};

export default AuthenticatedView;
