export const generateEnglishBoard = () => {
  const vowels = "AEIOU";
  // Optimized consonants based on frequency analysis - removed very rare letters
  const consonants = "SRNTLCDPMGHBYF"; // Removed V, K, W, Z, X, J, Q (< 1% usage)
  const rareLetters = ["Z", "X", "J", "Q"]; // Very rare in English
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

  // Place at least 9 vowels with max 3 of each type
  const vowelPositions = positions.slice(0, 9);
  const vowelCounts = { A: 0, E: 0, I: 0, O: 0, U: 0 };
  
  vowelPositions.forEach((pos) => {
    const row = Math.floor(pos / boardSize);
    const col = pos % boardSize;
    
    // Find a vowel that hasn't reached the limit of 3
    let randomVowel;
    let attempts = 0;
    do {
      randomVowel = vowels.charAt(Math.floor(Math.random() * vowels.length));
      attempts++;
    } while (vowelCounts[randomVowel] >= 3 && attempts < 20);
    
    // If all vowels are at limit, use the one with lowest count
    if (vowelCounts[randomVowel] >= 3) {
      randomVowel = Object.keys(vowelCounts).reduce((a, b) => 
        vowelCounts[a] < vowelCounts[b] ? a : b
      );
    }
    
    vowelCounts[randomVowel]++;
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

  // Fill the rest of the board with consonants (16 positions remaining)
  positions.slice(9).forEach((pos) => {
    const row = Math.floor(pos / boardSize);
    const col = pos % boardSize;

    let randomConsonant;
    let attempts = 0;

    do {
      randomConsonant = consonants.charAt(
        Math.floor(Math.random() * consonants.length)
      );

      // Check consonant count
      if (randomConsonant && consonantCount[randomConsonant] >= 3) {
        randomConsonant = null;
      }

      attempts++;
      if (attempts > 50) break; // Avoid infinite loop
    } while (
      randomConsonant &&
      (!isValidPlacement(board, row, col, randomConsonant) ||
        (rareLetters.includes(randomConsonant) && rareCount >= 2))
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
