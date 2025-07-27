export const generateBoard = () => {
  const vowels = "AEIOU";
  const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
  const rareLetters = ["Z", "X", "J"];
  const boardSize = 5;

  // Initialize a 5x5 grid with placeholder objects
  const board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill({ letter: "", isInvalid: false }));

  // Create an array of positions (0 to 24)
  const positions = Array.from(
    { length: boardSize * boardSize },
    (_, index) => index
  );

  // Shuffle positions array
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Place at least 9 vowels
  const vowelPositions = positions.slice(0, 9);
  vowelPositions.forEach((pos) => {
    const row = Math.floor(pos / boardSize);
    const col = pos % boardSize;
    const randomVowel = vowels.charAt(
      Math.floor(Math.random() * vowels.length)
    );
    board[row][col] = { letter: randomVowel, isInvalid: false };
  });

  let rareCount = 0;
  let quPlaced = false;
  const consonantCount = {}; // Track the count of each consonant

  // Function to check if a letter is valid for placement
  const isValidPlacement = (board, row, col, letter) => {
    const directions = [
      [0, 1], // Right
      [1, 0], // Down
      [1, 1], // Down-right diagonal
      [1, -1], // Down-left diagonal
    ];

    for (let [dx, dy] of directions) {
      let consecutiveCount = 1;

      for (let step = 1; step <= 2; step++) {
        const newRow = row + dx * step;
        const newCol = col + dy * step;

        if (
          newRow >= 0 &&
          newRow < boardSize &&
          newCol >= 0 &&
          newCol < boardSize &&
          board[newRow][newCol] &&
          board[newRow][newCol].letter === letter
        ) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      if (consecutiveCount >= 3) return false;
    }

    return true;
  };

  // Fill the rest of the board with consonants
  positions.slice(9).forEach((pos) => {
    const row = Math.floor(pos / boardSize);
    const col = pos % boardSize;

    let randomConsonant;
    let attempts = 0;

    do {
      randomConsonant = consonants.charAt(
        Math.floor(Math.random() * consonants.length)
      );

      // Replace Q with Qu if not already placed
      if (randomConsonant === "Q") {
        if (!quPlaced) {
          randomConsonant = "Qu";
          quPlaced = true;
        } else {
          randomConsonant = null;
        }
      }

      // Check consonant count
      if (randomConsonant && consonantCount[randomConsonant] >= 3) {
        randomConsonant = null;
      }

      attempts++;
      if (attempts > 50) break; // Avoid infinite loop
    } while (
      randomConsonant &&
      (!isValidPlacement(board, row, col, randomConsonant) ||
        (rareLetters.includes(randomConsonant) && rareCount >= 3))
    );

    if (!randomConsonant) {
      // Fallback to a random consonant if no valid letter is found
      randomConsonant = consonants.charAt(
        Math.floor(Math.random() * consonants.length)
      );
    }

    // Update consonant count
    consonantCount[randomConsonant] =
      (consonantCount[randomConsonant] || 0) + 1;

    // Update rare letter count
    if (rareLetters.includes(randomConsonant)) rareCount++;

    // Place the consonant
    board[row][col] = { letter: randomConsonant, isInvalid: false };
  });

  return board;
};
