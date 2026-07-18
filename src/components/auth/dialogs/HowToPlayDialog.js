import React from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import { Portal, Dialog, Button, Text, Divider, DataTable } from "react-native-paper";
import { getTranslation } from "../../../constants/translations";
import { isTablet } from "../../../constants/responsive";

const HowToPlayDialog = ({
  visible,
  onDismiss,
  language = "english"
}) => {
  const { width, height } = useWindowDimensions();
  const tablet = isTablet(width, height);

  const headingSize = tablet ? 28 : 16;
  const bodySize = tablet ? 22 : 14;
  const buttonFontSize = tablet ? 24 : 14;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={tablet ? { maxWidth: '100%', alignSelf: 'center', width: '100%' } : undefined} data-testid="how-to-play-dialog">
        <Dialog.Title style={tablet ? { fontSize: 32 } : undefined}>{getTranslation("howToPlay", language)}</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={{ maxHeight: tablet ? 900 : 500 }}>
            <Text style={{ fontSize: headingSize, marginBottom: 12, fontWeight: "bold" }}>
              🎯 {getTranslation("objective", language)}:
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("findWordsIn3Min", language)}
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 16 }}>
              • {getTranslation("scorePointsByLengthAndBoard", language)}
            </Text>

            <Divider style={{ marginVertical: 16 }} />

            <Text style={{ fontSize: headingSize, marginBottom: 12, fontWeight: "bold" }}>
              📊 {getTranslation("scoringSystem", language)}:
            </Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title textStyle={{ fontSize: tablet ? 20 : 12 }}>{getTranslation("letters", language)}</DataTable.Title>
                <DataTable.Title numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>1</DataTable.Title>
                <DataTable.Title numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>2</DataTable.Title>
                <DataTable.Title numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>3-5</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontSize: tablet ? 20 : 12 }}>3-4</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>100</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>70</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>50</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontSize: tablet ? 20 : 12 }}>5</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>150</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>110</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>75</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontSize: tablet ? 20 : 12 }}>6-7</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>180</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>130</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>100</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell textStyle={{ fontSize: tablet ? 20 : 12 }}>8+</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>225</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>175</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: tablet ? 20 : 12 }}>125</DataTable.Cell>
              </DataTable.Row>
            </DataTable>

            <Divider style={{ marginVertical: 16 }} />

            <Text style={{ fontSize: headingSize, marginBottom: 12, fontWeight: "bold" }}>
              🎮 {getTranslation("gameplay", language)}:
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("swipeToConnectAdjacent", language)}
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("wordsAtLeast3", language)}
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("eachLetterOnce", language)}
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 16 }}>
              • {getTranslation("longerWordsMorePoints", language)}
            </Text>

            <Divider style={{ marginVertical: 16 }} />

            <Text style={{ fontSize: headingSize, marginBottom: 12, fontWeight: "bold" }}>
              🏆 {getTranslation("competition", language)}:
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("competeMonthlyHighestScore", language)}
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("monthlyWinnersEarnStar", language)}
            </Text>
            <Text style={{ fontSize: bodySize, marginBottom: 8 }}>
              • {getTranslation("trackProgressLeaderboard", language)}
            </Text>
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={onDismiss} style={{ backgroundColor: '#6B46C1' }} labelStyle={{ fontSize: buttonFontSize, lineHeight: tablet ? buttonFontSize * 1.4 : undefined, color: '#fff' }} data-testid="close-how-to-play-button">
            {getTranslation("gotIt", language)}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default HowToPlayDialog;
