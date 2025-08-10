import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Chip, IconButton } from "react-native-paper";
import {
  getScoringBreakdown,
  getScoringDescription,
} from "../utils/scoringUtils";
import ScoringInfoModal from "../modals/ScoringInfoModal";

const ScoringDisplay = ({ boardNumber, compact = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const breakdown = getScoringBreakdown(boardNumber);
  const description = getScoringDescription(boardNumber);

  const getChipStyle = (points) => {
    if (points >= 200) {
      return { backgroundColor: "#4caf50" }; // Green for high points
    } else if (points >= 150) {
      return { backgroundColor: "#ff9800" }; // Orange for medium points
    } else if (points >= 100) {
      return { backgroundColor: "#2196f3" }; // Blue for good points
    } else {
      return { backgroundColor: "#9e9e9e" }; // Gray for lower points
    }
  };

  if (compact) {
    return (
      <>
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(98, 0, 234, 0.1)",
            borderRadius: 8,
            padding: 8,
            marginVertical: 4,
          }}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#6200ea",
                textAlign: "center",
                flex: 1,
              }}
            >
              {description}
            </Text>
            <IconButton
              icon="information"
              size={16}
              iconColor="#6200ea"
              style={{
                margin: 0,
                padding: 0,
                width: 20,
                height: 20,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: "#333",
                fontWeight: "600",
              }}
            >
              3-4: {breakdown.scoring["3-4 letters"]}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "#333",
                fontWeight: "600",
              }}
            >
              5: {breakdown.scoring["5 letters"]}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "#333",
                fontWeight: "600",
              }}
            >
              6-7: {breakdown.scoring["6-7 letters"]}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "#333",
                fontWeight: "600",
              }}
            >
              8+: {breakdown.scoring["8+ letters"]}
            </Text>
          </View>
        </TouchableOpacity>

        <ScoringInfoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          currentBoard={boardNumber}
        />
      </>
    );
  }

  return (
    <Card
      style={{
        margin: 8,
        elevation: 2,
      }}
    >
      <Card.Content>
        <Title
          style={{
            fontSize: 18,
            color: "#6200ea",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Board {breakdown.boardNumber} Scoring
        </Title>
        <Paragraph
          style={{
            fontSize: 14,
            textAlign: "center",
            marginBottom: 16,
            fontStyle: "italic",
            color: "#666",
          }}
        >
          {description}
        </Paragraph>

        <View style={{ gap: 8 }}>
          {Object.entries(breakdown.scoring).map(([length, points]) => (
            <View
              key={length}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                  flex: 1,
                }}
              >
                {length}:
              </Text>
              <Chip
                mode="flat"
                style={{
                  minWidth: 80,
                  ...getChipStyle(points),
                }}
                textStyle={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {points} pts
              </Chip>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

export default ScoringDisplay;
