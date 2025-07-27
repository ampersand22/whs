import { isValidWord } from "./WordList";
import { generateBoard } from "./BoardGenerator";

export const getPointsPerWord = (resetCount) => {
  switch (resetCount) {
    case 0:
      return 100;
    case 1:
      return 70;
    case 2:
      return 50;
    default:
      return 50;
  }
};

export const checkIfValidWord = (
  selectedCells,
  board,
  foundWords,
  setFoundWords,
  setScore,
  resetCount,
  setSelectedCells // Add setSelectedCells to reset after a valid word
) => {
  if (selectedCells.length < 3) {
    // Clear selection if word is too short
    setSelectedCells([]);
    return;
  }

  // Build the word from the selected cells
  const word = selectedCells
    .map(({ row, col }) => board[row][col].letter)
    .join("");

  // Check if the word is valid and hasn't been found already
  if (isValidWord(word) && !foundWords.includes(word.toLowerCase())) {
    // Update the score with the points for the word
    setScore((prevScore) => prevScore + getPointsPerWord(resetCount));

    // Add the word to the list of found words
    setFoundWords((prevWords) => [...prevWords, word.toLowerCase()]);
  }

  // Always clear the selected cells when checking is done
  setSelectedCells([]);
};

export const resetBoardState = (resetCount, setBoardCallback) => {
  if (resetCount < 5) {
    setBoardCallback(generateBoard());
    return resetCount + 1;
  } else {
    alert("You have reached the maximum number of resets.");
    return resetCount;
  }
};

export const handleLetterPress = (
  row,
  col,
  isSelected,
  selectedCells,
  setSelectedCells
) => {
  // Special case: clear all selection
  if (row === -1 && col === -1 && isSelected) {
    console.log("Clearing all selected cells");
    setSelectedCells([]);
    return;
  }

  console.log(`Letter pressed: row=${row}, col=${col}, isSelected=${isSelected}`);
  console.log("Current selectedCells:", selectedCells);

  if (isSelected) {
    // If the cell is already selected, we deselect it by removing it from the selectedCells array.
    console.log("Deselecting cell");
    setSelectedCells((prev) => {
      const newSelection = prev.filter((cell) => !(cell.row === row && cell.col === col));
      console.log("New selection after deselect:", newSelection);
      return newSelection;
    });
  } else {
    // Check adjacency if there are already selected cells
    if (selectedCells.length > 0) {
      // Get the last selected cell for comparison
      const lastCell = selectedCells[selectedCells.length - 1];

      // Determine if the current cell is adjacent to the last cell
      const isAdjacent =
        Math.abs(lastCell.row - row) <= 1 && // Row difference must be 0 or 1
        Math.abs(lastCell.col - col) <= 1 && // Column difference must be 0 or 1
        !(lastCell.row === row && lastCell.col === col); // Not the same cell

      // If the cell is not adjacent, we log a message and stop the selection process
      if (!isAdjacent) {
        console.log("Selected cell is not adjacent to the last cell.");
        return; // Exit the function without selecting the cell
      }
    }

    // Check if this cell is already in the selection (prevent duplicates)
    const alreadySelected = selectedCells.some(
      cell => cell.row === row && cell.col === col
    );
    
    if (alreadySelected) {
      console.log("Cell already in selection, ignoring");
      return;
    }

    // If the cell is valid (either it's the first selection or it's adjacent), add it to selectedCells
    console.log("Adding cell to selection");
    setSelectedCells((prev) => {
      const newSelection = [...prev, { row, col }];
      console.log("New selection after add:", newSelection);
      return newSelection;
    });
  }
};
