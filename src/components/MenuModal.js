import React from "react";
import { View, Modal, Animated, Dimensions } from "react-native";
import { Card, Title, Button, Text, IconButton } from "react-native-paper";

const { width } = Dimensions.get('window');

const MenuModal = ({ 
  visible, 
  onClose, 
  onShowLeaderboard, 
  onEditProfile, 
  onSignOut 
}) => {
  const menuItems = [
    {
      title: "Leaderboard",
      icon: "🏆",
      description: "See top players",
      onPress: () => {
        onClose();
        onShowLeaderboard();
      },
      testId: "leaderboard-button",
      color: "#FF6B35"
    },
    {
      title: "Edit Profile",
      icon: "👤",
      description: "Update your info",
      onPress: () => {
        onClose();
        onEditProfile();
      },
      testId: "edit-profile-button",
      color: "#4ECDC4"
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <Card style={{ 
          width: '100%', 
          maxWidth: 360,
          elevation: 20,
          borderRadius: 24,
          backgroundColor: '#4A148C'
        }}>
          <Card.Content style={{ padding: 0 }}>
            {/* Header with dark purple background */}
            <View style={{
              backgroundColor: '#4A148C',
              paddingVertical: 24,
              paddingHorizontal: 24,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* Close button */}
              <IconButton
                icon="close"
                iconColor="white"
                size={24}
                onPress={onClose}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  margin: 0
                }}
              />
              
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 50,
                width: 80,
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <Text style={{ fontSize: 32 }}>⚙️</Text>
              </View>
              
              <Title style={{ 
                color: 'white',
                fontSize: 24,
                fontWeight: '700',
                margin: 0,
                textAlign: 'center'
              }}>
                Menu
              </Title>
            </View>

            {/* Menu Items */}
            <View style={{ padding: 24, backgroundColor: '#4A148C', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  mode="contained"
                  onPress={item.onPress}
                  style={{ 
                    marginBottom: 16, 
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: item.color,
                    elevation: 4,
                    shadowColor: item.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8
                  }}
                  contentStyle={{ 
                    height: 64,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 16
                  }}
                  labelStyle={{ 
                    fontSize: 18, 
                    fontWeight: '600',
                    color: 'white',
                    flex: 1,
                    textAlign: 'left'
                  }}
                  data-testid={item.testId}
                >
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
                  }}>
                    <View style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 12,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16
                    }}>
                      <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 2
                      }}>
                        {item.title}
                      </Text>
                      <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 13
                      }}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </Button>
              ))}

              {/* Sign Out Button - Different Style */}
              <View style={{
                marginTop: 8,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: 'rgba(255, 255, 255, 0.3)'
              }}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    onClose();
                    onSignOut();
                  }}
                  style={{ 
                    height: 56,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  contentStyle={{ 
                    height: 56,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  labelStyle={{ 
                    fontSize: 16, 
                    fontWeight: '600',
                    color: 'white'
                  }}
                  data-testid="sign-out-button"
                >
                  <Text style={{ fontSize: 18, marginRight: 8 }}>🚪</Text>
                  Sign Out
                </Button>
              </View>

              {/* Cancel Button */}
              <Button
                mode="contained"
                onPress={onClose}
                style={{ 
                  height: 48,
                  borderRadius: 12,
                  marginTop: 12,
                  backgroundColor: 'white'
                }}
                contentStyle={{ height: 48 }}
                labelStyle={{ 
                  fontSize: 16, 
                  fontWeight: '500',
                  color: '#4A148C'
                }}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};

export default MenuModal;
