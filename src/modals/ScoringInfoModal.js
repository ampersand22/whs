import React from "react";
import { Modal, View, ScrollView, StyleSheet, Text } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Chip,
} from "react-native-paper";
import { getScoringBreakdown } from "../utils/scoringUtils";

const ScoringInfoModal = ({ visible, onClose, currentBoard = 0 }) => {
  const allBoards = [0, 1, 2, 3, 4]; // Boards 1-5 (0-indexed)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.headerCard}>
              <Card.Content>
                <Title style={styles.title}>📊 Scoring System</Title>
                <Paragraph style={styles.subtitle}>
                  Points vary by word length and board number. Find longer words
                  on earlier boards for maximum points!
                </Paragraph>
              </Card.Content>
            </Card>

            {allBoards.map((boardIndex) => {
              const breakdown = getScoringBreakdown(boardIndex);
              const isCurrentBoard = boardIndex === currentBoard;

              return (
                <Card
                  key={boardIndex}
                  style={[
                    styles.boardCard,
                    isCurrentBoard && styles.currentBoardCard,
                  ]}
                >
                  <Card.Content>
                    <View style={styles.boardHeader}>
                      <Title
                        style={[
                          styles.boardTitle,
                          isCurrentBoard && styles.currentBoardTitle,
                        ]}
                      >
                        Board {breakdown.boardNumber}
                      </Title>
                      {isCurrentBoard && (
                        <Chip
                          mode="flat"
                          style={styles.currentChip}
                          textStyle={styles.currentChipText}
                        >
                          Current
                        </Chip>
                      )}
                    </View>

                    <View style={styles.scoringGrid}>
                      {Object.entries(breakdown.scoring).map(
                        ([length, points]) => (
                          <View key={length} style={styles.scoringRow}>
                            <Text style={styles.lengthText}>{length}</Text>
                            <View style={styles.pointsContainer}>
                              <Text
                                style={[
                                  styles.pointsText,
                                  getPointsStyle(points),
                                ]}
                              >
                                {points} points
                              </Text>
                            </View>
                          </View>
                        )
                      )}
                    </View>
                  </Card.Content>
                </Card>
              );
            })}

            <Card style={styles.tipsCard}>
              <Card.Content>
                <Title style={styles.tipsTitle}>💡 Scoring Tips</Title>
                <View style={styles.tipsList}>
                  <Paragraph style={styles.tip}>
                    •{" "}
                    <Text style={styles.tipBold}>
                      Longer words = More points
                    </Text>{" "}
                    - 8+ letter words give the highest scores
                  </Paragraph>
                  <Paragraph style={styles.tip}>
                    •{" "}
                    <Text style={styles.tipBold}>
                      Earlier boards = Higher multipliers
                    </Text>{" "}
                    - Board 1 gives maximum points
                  </Paragraph>
                  <Paragraph style={styles.tip}>
                    • <Text style={styles.tipBold}>Strategic play</Text> - Find
                    long words early, or clear short words to progress
                  </Paragraph>
                  <Paragraph style={styles.tip}>
                    • <Text style={styles.tipBold}>Bonus words</Text> - Special
                    words still give 300 points regardless of board
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onClose}
              style={styles.closeButton}
              labelStyle={styles.closeButtonText}
            >
              Got it!
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getPointsStyle = (points) => {
  if (points >= 200) {
    return { color: "#4caf50", fontWeight: "bold" }; // Green for high points
  } else if (points >= 150) {
    return { color: "#ff9800", fontWeight: "bold" }; // Orange for medium points
  } else if (points >= 100) {
    return { color: "#2196f3", fontWeight: "600" }; // Blue for good points
  } else {
    return { color: "#666", fontWeight: "normal" }; // Gray for lower points
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  scrollView: {
    maxHeight: "90%",
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: "#6200ea",
  },
  title: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  boardCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
  },
  currentBoardCard: {
    borderWidth: 2,
    borderColor: "#6200ea",
    backgroundColor: "#f3e5f5",
  },
  boardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  boardTitle: {
    fontSize: 18,
    color: "#333",
    margin: 0,
  },
  currentBoardTitle: {
    color: "#6200ea",
    fontWeight: "bold",
  },
  currentChip: {
    backgroundColor: "#6200ea",
  },
  currentChipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  scoringGrid: {
    gap: 8,
  },
  scoringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  lengthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  pointsContainer: {
    alignItems: "flex-end",
  },
  pointsText: {
    fontSize: 16,
  },
  tipsCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: "#e8f5e8",
  },
  tipsTitle: {
    color: "#2e7d32",
    fontSize: 18,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: "bold",
    color: "#2e7d32",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  closeButton: {
    backgroundColor: "#6200ea",
    borderRadius: 24,
    paddingVertical: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default ScoringInfoModal;
