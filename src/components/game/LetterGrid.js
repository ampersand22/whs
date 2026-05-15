import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Vibration,
} from "react-native";
import { Surface } from "react-native-paper";
import { isValidWord } from "../../utils/validation/WordList";
import { getResponsiveDimensions, isTablet } from "../../constants/responsive";

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

  // Check if two cells are adjacent (horizontally, vertically, or diagonally)
  const isAdjacent = (cell1, cell2) => {
    return Math.abs(cell1.row - cell2.row) <= 1 && 
           Math.abs(cell1.col - cell2.col) <= 1;
  };

  // Measure grid position using onLayout + measureInWindow (works with New Architecture)
  const handleGridLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    // Store layout dimensions immediately
    gridPosition.current = { 
      ...gridPosition.current, 
      width, 
      height 
    };
    // Then get page coordinates
    if (gridRef.current) {
      if (gridRef.current.measureInWindow) {
        gridRef.current.measureInWindow((pageX, pageY, w, h) => {
          if (pageX != null && pageY != null) {
            gridPosition.current = { x: pageX, y: pageY, width: w || width, height: h || height };
          }
        });
      } else if (gridRef.current.measure) {
        gridRef.current.measure((x, y, w, h, pageX, pageY) => {
          if (pageX != null && pageY != null) {
            gridPosition.current = { x: pageX, y: pageY, width: w || width, height: h || height };
          }
        });
      }
    }
  };

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
    
    // Re-measure grid position on touch start for accuracy
    if (gridRef.current) {
      if (gridRef.current.measureInWindow) {
        gridRef.current.measureInWindow((pageX, pageY, width, height) => {
          if (pageX != null && pageY != null && width && height) {
            gridPosition.current = { x: pageX, y: pageY, width, height };
          }
        });
      } else if (gridRef.current.measure) {
        gridRef.current.measure((x, y, width, height, pageX, pageY) => {
          if (pageX != null && pageY != null && width && height) {
            gridPosition.current = { x: pageX, y: pageY, width, height };
          }
        });
      }
    }
    
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
    if (!touch || !touch.pageX) return;

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

    // Accept touch if it's within the cell bounds (more lenient for iPhone 16)
    const isInsideCenter =
      colOffset >= 0.05 &&
      colOffset <= 0.95 &&
      rowOffset >= 0.05 &&
      rowOffset <= 0.95;

    // Check if the cell is valid and not already selected
    if (
      row >= 0 &&
      row < rows &&
      col >= 0 &&
      col < cols &&
      isInsideCenter &&
      !selectedCells.some((cell) => cell.row === row && cell.col === col)
    ) {
      // Must be adjacent to the last selected cell (or be the first cell)
      const lastCell = selectedCells[selectedCells.length - 1];
      if (selectedCells.length === 0 || isAdjacent(lastCell, { row, col })) {
        setSelectedCells((prev) => [...prev, { row, col }]);
      }
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

  // Cache responsive values outside the render loop
  const dimensions = getResponsiveDimensions();
  const tabletMode = isTablet();

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      {/* Grid */}
      <View
        ref={gridRef}
        onLayout={handleGridLayout}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: "100%",
          maxWidth: dimensions.gridMaxWidth,
          aspectRatio: 1,
          flexDirection: "column",
          alignSelf: "center",
          marginVertical: 4,
          padding: dimensions.gridPadding / 4,
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
                    margin: tabletMode ? 3 : 2,
                    backgroundColor: backgroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: tabletMode ? 8 : 6,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: dimensions.letterFontSize,
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
