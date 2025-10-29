import React from "react";
import { ScrollView } from "react-native";
import { Portal, Dialog, Button, Text, Divider, DataTable } from "react-native-paper";
import { getTranslation } from "../../../constants/translations";

const HowToPlayDialog = ({
  visible,
  onDismiss,
  language = "english"
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} data-testid="how-to-play-dialog">
        <Dialog.Title>{getTranslation("howToPlay", language)}</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={{ maxHeight: 500 }}>
            <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
              🎯 {getTranslation("objective", language)}:
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("findWordsIn3Min", language)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 16 }}>
              • {getTranslation("scorePointsByLengthAndBoard", language)}
            </Text>

            <Divider style={{ marginVertical: 16 }} />

            <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
              📊 {getTranslation("scoringSystem", language)}:
            </Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>{getTranslation("letters", language)}</DataTable.Title>
                <DataTable.Title numeric>1</DataTable.Title>
                <DataTable.Title numeric>2</DataTable.Title>
                <DataTable.Title numeric>3-5</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <DataTable.Cell>3-4</DataTable.Cell>
                <DataTable.Cell numeric>100</DataTable.Cell>
                <DataTable.Cell numeric>70</DataTable.Cell>
                <DataTable.Cell numeric>50</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>5</DataTable.Cell>
                <DataTable.Cell numeric>150</DataTable.Cell>
                <DataTable.Cell numeric>110</DataTable.Cell>
                <DataTable.Cell numeric>75</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>6-7</DataTable.Cell>
                <DataTable.Cell numeric>180</DataTable.Cell>
                <DataTable.Cell numeric>130</DataTable.Cell>
                <DataTable.Cell numeric>100</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>8+</DataTable.Cell>
                <DataTable.Cell numeric>225</DataTable.Cell>
                <DataTable.Cell numeric>175</DataTable.Cell>
                <DataTable.Cell numeric>125</DataTable.Cell>
              </DataTable.Row>
            </DataTable>

            <Divider style={{ marginVertical: 16 }} />

            <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
              🎮 {getTranslation("gameplay", language)}:
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("swipeToConnectAdjacent", language)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("wordsAtLeast3", language)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("eachLetterOnce", language)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 16 }}>
              • {getTranslation("longerWordsMorePoints", language)}
            </Text>

            <Divider style={{ marginVertical: 16 }} />

            <Text style={{ fontSize: 16, marginBottom: 12, fontWeight: "bold" }}>
              🏆 {getTranslation("competition", language)}:
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("competeMonthlyHighestScore", language)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("monthlyWinnersEarnStar", language)}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              • {getTranslation("trackProgressLeaderboard", language)}
            </Text>
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} data-testid="close-how-to-play-button">
            {getTranslation("gotIt", language)}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default HowToPlayDialog;
