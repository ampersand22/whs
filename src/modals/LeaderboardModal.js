import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Animated,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Portal,
  Text,
  Title,
  Button,
  List,
  Avatar,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { supabase } from "../config/supabase";
import useUserStore from "../stores/userStore";

const LeaderboardModal = ({ visible, onClose }) => {
  const { user } = useUserStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Load leaderboard when modal opens
      loadLeaderboard();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const { data, error } = await supabase.rpc("get_enhanced_leaderboard", {
        p_year: currentYear,
        p_month: currentMonth,
        p_limit: 3,
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getCurrentMonth = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
        data-testid="leaderboard-modal"
      >
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          data-testid="modal-overlay"
        >
          <View style={{ flex: 1 }} data-testid="modal-backdrop" />
        </Pressable>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          data-testid="modal-centered-container"
        >
          <Animated.View
            style={{
              width: "90%",
              maxHeight: "80%",
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }}
            data-testid="modal-content"
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
              data-testid="leaderboard-header"
            >
              <View>
                <Title data-testid="leaderboard-title">
                  🏆 Monthly Leaderboard
                </Title>
                <Text style={{ color: "#666", fontSize: 14 }}>
                  {getCurrentMonth()}
                </Text>
              </View>
              <IconButton
                icon="refresh"
                onPress={loadLeaderboard}
                disabled={loadingLeaderboard}
                data-testid="refresh-leaderboard-button"
              />
            </View>

            {/* Content */}
            <View style={{ height: 400 }}>
              {loadingLeaderboard && !refreshing ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  data-testid="leaderboard-loading"
                >
                  <ActivityIndicator size="small" />
                  <Text>Loading leaderboard...</Text>
                </View>
              ) : leaderboard.length > 0 ? (
                <ScrollView
                  style={{ flex: 1 }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  data-testid="leaderboard-list"
                >
                  {leaderboard.map((entry, index) => (
                    <List.Item
                      key={entry.user_id}
                      title={entry.display_name}
                      description={`High Score: ${entry.highest_score}`}
                      left={() => (
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 50,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color:
                                index === 0
                                  ? "#FFD700"
                                  : index === 1
                                  ? "#C0C0C0"
                                  : index === 2
                                  ? "#CD7F32"
                                  : "#666",
                            }}
                          >
                            #{entry.rank}
                          </Text>
                          {entry.total_stars > 0 && (
                            <Text style={{ fontSize: 12, marginTop: 2 }}>
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
                            style={{ backgroundColor: "#FFD700" }}
                          />
                        )
                      }
                      style={{
                        backgroundColor:
                          entry.user_id === user?.id
                            ? "rgba(103, 80, 164, 0.1)"
                            : "transparent",
                        borderRadius: 8,
                        marginVertical: 2,
                      }}
                      data-testid={`leaderboard-item-${index}`}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  data-testid="leaderboard-empty"
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontStyle: "italic",
                      opacity: 0.7,
                    }}
                  >
                    No leaderboard data yet. Play some games to see rankings!
                  </Text>
                </View>
              )}
            </View>

            {/* Close Button */}
            <View style={{ m: 2 }}>
              <Button
                mode="contained"
                onPress={onClose}
                data-testid="close-leaderboard-button"
              >
                Close
              </Button>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Portal>
  );
};

export default LeaderboardModal;
