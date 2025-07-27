import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Dimensions, ScrollView } from "react-native";
import {
  Portal,
  Text,
  Button,
  Divider,
  Surface,
  Card,
  Title,
  Paragraph,
  List,
  Avatar,
} from "react-native-paper";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isSmallScreen = screenHeight < 700;

export default function HowToPlayModal({ visible, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  // Calculate responsive sizes
  const modalMargin = Math.max(10, screenWidth * 0.03);
  const contentPadding = isSmallScreen ? 12 : 16;
  const titleFontSize = isSmallScreen ? 16 : 18;
  const textFontSize = isSmallScreen ? 13 : 15;
  const paragraphFontSize = isSmallScreen ? 14 : 16;
  const avatarSize = isSmallScreen ? 28 : 32;
  const imageHeight = isSmallScreen ? 80 : 120;
  const dividerMargin = isSmallScreen ? 8 : 16;
  const itemMargin = isSmallScreen ? 4 : 8;

  return (
    <Portal>
      {visible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
          }}
          data-testid="how-to-play-modal-container"
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              marginHorizontal: modalMargin,
              maxHeight: "90%",
            }}
            data-testid="how-to-play-modal-content"
          >
            <Card
              style={{
                borderRadius: 16,
                overflow: "hidden",
                elevation: 8,
              }}
              data-testid="how-to-play-card"
            >
              <ScrollView>
                <Card.Content
                  style={{ padding: contentPadding }}
                  data-testid="card-content"
                >
                  {/* Image */}
                  <Image
                    source={require("../../assets/howtoplay.png")}
                    resizeMode="contain"
                    style={{
                      width: "100%",
                      height: imageHeight,
                      alignSelf: "center",
                      marginVertical: isSmallScreen ? 5 : 10,
                    }}
                    data-testid="how-to-play-image"
                  />

                  <Divider
                    style={{ marginVertical: dividerMargin / 2 }}
                    data-testid="divider-1"
                  />

                  {/* Game Instructions */}
                  <Title
                    style={{ fontSize: titleFontSize, marginBottom: itemMargin }}
                    data-testid="instructions-title"
                  >
                    Game Rules
                  </Title>

                  <List.Section 
                    style={{ marginVertical: 0 }}
                    data-testid="instructions-list"
                  >
                    <List.Item
                      title="Select adjacent letters to form words"
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon="gesture-swipe"
                          color="#6200ea"
                          style={{ marginVertical: 0, marginRight: -8 }}
                        />
                      )}
                      titleStyle={{ fontSize: textFontSize }}
                      style={{ paddingVertical: isSmallScreen ? 2 : 4, minHeight: 0 }}
                      data-testid="instruction-1"
                    />
                    <List.Item
                      title="Words must be at least 3 letters long"
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon="format-letter-case"
                          color="#6200ea"
                          style={{ marginVertical: 0, marginRight: -8 }}
                        />
                      )}
                      titleStyle={{ fontSize: textFontSize }}
                      style={{ paddingVertical: isSmallScreen ? 2 : 4, minHeight: 0 }}
                      data-testid="instruction-2"
                    />
                    <List.Item
                      title="Points are based on word length and board resets"
                      left={(props) => (
                        <List.Icon 
                          {...props} 
                          icon="counter" 
                          color="#6200ea" 
                          style={{ marginVertical: 0, marginRight: -8 }}
                        />
                      )}
                      titleStyle={{ fontSize: textFontSize }}
                      style={{ paddingVertical: isSmallScreen ? 2 : 4, minHeight: 0 }}
                      data-testid="instruction-3"
                    />
                    <List.Item
                      title="The game ends when the timer runs out"
                      left={(props) => (
                        <List.Icon 
                          {...props} 
                          icon="timer-sand" 
                          color="#6200ea" 
                          style={{ marginVertical: 0, marginRight: -8 }}
                        />
                      )}
                      titleStyle={{ fontSize: textFontSize }}
                      style={{ paddingVertical: isSmallScreen ? 2 : 4, minHeight: 0 }}
                      data-testid="instruction-4"
                    />
                  </List.Section>

                  {/* Scoring Section */}
                  <Divider
                    style={{ marginVertical: dividerMargin }}
                    data-testid="divider-2"
                  />

                  <Surface
                    style={{
                      backgroundColor: "#f4f0ff",
                      borderRadius: 12,
                      padding: contentPadding,
                      elevation: 1,
                    }}
                    data-testid="scoring-surface"
                  >
                    <Title
                      style={{ 
                        fontSize: titleFontSize, 
                        marginBottom: itemMargin, 
                        color: "#6200ea" 
                      }}
                      data-testid="scoring-title"
                    >
                      Scoring System
                    </Title>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: itemMargin,
                      }}
                      data-testid="score-item-1"
                    >
                      <Avatar.Text
                        size={avatarSize}
                        label="1"
                        style={{ backgroundColor: "#6200ea" }}
                      />
                      <Paragraph style={{ marginLeft: 12, fontSize: paragraphFontSize }}>
                        1st Board –{" "}
                        <Text style={{ fontWeight: "bold" }}>100 points</Text>
                      </Paragraph>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: itemMargin,
                      }}
                      data-testid="score-item-2"
                    >
                      <Avatar.Text
                        size={avatarSize}
                        label="2"
                        style={{ backgroundColor: "#9c27b0" }}
                      />
                      <Paragraph style={{ marginLeft: 12, fontSize: paragraphFontSize }}>
                        2nd Board –{" "}
                        <Text style={{ fontWeight: "bold" }}>75 points</Text>
                      </Paragraph>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                      data-testid="score-item-3"
                    >
                      <Avatar.Text
                        size={avatarSize}
                        label="3+"
                        style={{ backgroundColor: "#ba68c8" }}
                      />
                      <Paragraph style={{ marginLeft: 12, fontSize: paragraphFontSize }}>
                        3rd/4th/5th Board –{" "}
                        <Text style={{ fontWeight: "bold" }}>50 points</Text>
                      </Paragraph>
                    </View>
                  </Surface>

                  <Paragraph
                    style={{
                      marginTop: dividerMargin,
                      fontStyle: "italic",
                      textAlign: "center",
                      fontSize: textFontSize,
                    }}
                    data-testid="bonus-tip"
                  >
                    Tip: Look for bonus words for extra points!
                  </Paragraph>
                </Card.Content>
              </ScrollView>

              <Card.Actions
                style={{ justifyContent: "center", paddingVertical: isSmallScreen ? 12 : 16 }}
                data-testid="card-actions"
              >
                <Button
                  mode="contained"
                  onPress={onClose}
                  style={{
                    backgroundColor: "#6200ea",
                    paddingHorizontal: isSmallScreen ? 24 : 32,
                    borderRadius: 28,
                  }}
                  labelStyle={{ fontSize: isSmallScreen ? 14 : 16 }}
                  data-testid="got-it-button"
                >
                  Got it!
                </Button>
              </Card.Actions>
            </Card>
          </Animated.View>
        </View>
      )}
    </Portal>
  );
}
