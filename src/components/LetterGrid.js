import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Vibration,
  Dimensions,
  Animated,
  UIManager,
  findNodeHandle,
} from "react-native";
import { Surface } from "react-native-paper";
import { isValidWord } from "../utils/WordList";

const screenWidth = Dimensions.get("window").width;

export default function LetterGrid({ board, onWordFormed, previewWord, setPreviewWord, foundWords, setIsTouching }) {
  const [selectedCells, setSelectedCells] = useState([]);
  const gridRef = useRef(null);
  const gridPosition = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);
  const [isWordRepeated, setIsWordRepeated] = useState(false);
  const [flashingCells, setFlashingCells] = useState([]);
  const [flashColor, setFlashColor] = useState(""); // "green" or "red"
  const flashTimeout = useRef(null);

  const rows = board.length;
  const cols = board[0].length;

  // Get grid position on mount and layout changes
  useEffect(() => {
    setTimeout(() => {
      if (gridRef.current) {
        const handle = findNodeHandle(gridRef.current);
        if (handle) {
          UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            gridPosition.current = {
              x: pageX,
              y: pageY,
              width,
              height,
            };
          });
        }
      }
    }, 500);
  }, []);

  const getCurrentWord = () =>
    selectedCells
      .map(({ row, col }) => board[row][col]?.letter || board[row][col])
      .join("");

  const handleTouchEnd = () => {
    isTouching.current = false;
    setIsTouching(false); // Update parent component

    const word = getCurrentWord();

    // Always send the word to the parent component if it's at least 3 letters
    if (word.length >= 3) {
      // Check if the word is already found
      const isRepeated = foundWords && foundWords.includes(word);
      setIsWordRepeated(isRepeated);
      
      // Process the word regardless of whether it's repeated
      onWordFormed(word, isRepeated);

      // Show vibration based on word validity and repetition
      if (isValidWord(word.toLowerCase())) {
        if (!isRepeated) {
          // Valid new word
          Vibration.vibrate(40);
          
          // Flash cells green for valid new word
          setFlashingCells([...selectedCells]);
          setFlashColor("#4CAF50"); // Green
        } else {
          // Valid but repeated word
          Vibration.vibrate([0, 30, 30, 30]);
          
          // Flash cells red for repeated word
          setFlashingCells([...selectedCells]);
          setFlashColor("#ff0000"); // Red
        }
        
        // Clear flashing after 800ms
        if (flashTimeout.current) {
          clearTimeout(flashTimeout.current);
        }
        
        flashTimeout.current = setTimeout(() => {
          setFlashingCells([]);
          setFlashColor("");
        }, 800);
      }
    }

    // Always clear the selected cells when finger is lifted
    setSelectedCells([]);
  };

  const handleTouchStart = (evt) => {
    isTouching.current = true;
    setIsTouching(true); // Update parent component
    
    // Clear the previous word when starting a new selection
    setSelectedCells([]);
    setPreviewWord(""); // Clear the preview word when a new cell is touched
    setIsWordRepeated(false);
    handleTouchMove(evt);
  };

  const handleTouchMove = (evt) => {
    if (!isTouching.current) return;

    // Get touch information
    const touch = evt.nativeEvent.touches
      ? evt.nativeEvent.touches[0]
      : evt.nativeEvent;
    if (!touch) return;

    const { pageX, pageY } = touch;
    const { x, y, width, height } = gridPosition.current;

    if (!width || !height) return;

    // Calculate relative position in the grid
    const relX = pageX - x;
    const relY = pageY - y;

    // Calculate cell size
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Calculate which cell was touched
    const rawCol = relX / cellWidth;
    const rawRow = relY / cellHeight;

    const col = Math.floor(rawCol);
    const row = Math.floor(rawRow);

    // Calculate position within the cell (0-1 range)
    const colOffset = rawCol - col;
    const rowOffset = rawRow - row;

    // Only accept touch if it's within the inner area of the cell (10%-90%)
    const isInsideCenter =
      colOffset >= 0.1 &&
      colOffset <= 0.9 &&
      rowOffset >= 0.1 &&
      rowOffset <= 0.9;

    // Check if the cell is valid and not already selected
    if (
      row >= 0 &&
      row < rows &&
      col >= 0 &&
      col < cols &&
      isInsideCenter &&
      !selectedCells.some((cell) => cell.row === row && cell.col === col)
    ) {
      setSelectedCells((prev) => [...prev, { row, col }]);
    }
  };

  useEffect(() => {
    const word = getCurrentWord();
    setPreviewWord(word);
    
    // Check if the current word is already found
    if (word.length >= 3 && foundWords) {
      setIsWordRepeated(foundWords.includes(word));
    } else {
      setIsWordRepeated(false);
    }
  }, [selectedCells, foundWords]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      {/* Grid */}
      <View
        ref={gridRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: "100%",
          aspectRatio: 1,
          flexDirection: "column",
          alignSelf: "center",
          marginVertical: 4,
          padding: 2,
        }}
      >
        {board.map((rowArr, row) => (
          <View key={row} style={{ flex: 1, flexDirection: "row" }}>
            {rowArr.map((cell, col) => {
              const letter = cell.letter || cell;
              const isSelected = selectedCells.some(
                (c) => c.row === row && c.col === col
              );
              const isFlashing = flashingCells.some(
                (c) => c.row === row && c.col === col
              );
              
              // Determine cell background color
              let backgroundColor = "white";
              if (isSelected) {
                backgroundColor = "#6200ea"; // Purple for selected
              } else if (isFlashing && flashColor) {
                backgroundColor = flashColor; // Green or red for flashing
              }
              
              return (
                <Surface
                  key={`${row}-${col}`}
                  style={{
                    flex: 1,
                    margin: 2,
                    backgroundColor: backgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: isSelected ? "white" : "#333",
                    }}
                  >
                    {letter}
                  </Text>
                </Surface>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
