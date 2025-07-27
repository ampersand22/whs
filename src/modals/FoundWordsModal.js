import React from "react";
import { ScrollView, View } from "react-native";
import { Modal, Portal, Text, Button, Divider } from "react-native-paper";

export default function FoundWordsModal({ visible, foundWords, onClose }) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#6200ea",
          }}
        >
          Found Words
        </Text>

        <Divider
          style={{
            width: "100%",
            height: 2,
            backgroundColor: "#6200ea",
            marginBottom: 10,
          }}
        />

        {foundWords.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
            }}
            style={{ maxHeight: 100 }}
          >
            {foundWords.map((word, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#f1f1f1",
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginHorizontal: 6,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              >
                <Text style={{ fontSize: 16 }}>{word}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text
            style={{ fontSize: 18, fontStyle: "italic", marginVertical: 20 }}
          >
            No words found yet
          </Text>
        )}

        <Button
          mode="contained"
          onPress={onClose}
          style={{ marginTop: 20, width: "50%", backgroundColor: "#6200ea" }}
        >
          Close
        </Button>
      </Modal>
    </Portal>
  );
}
