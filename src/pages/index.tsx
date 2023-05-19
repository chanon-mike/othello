import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [playerColor, setplayerColor] = useState(1);

  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const directions = [
    [-1, 0], // Up
    [-1, 1], // Up-Right
    [0, 1], // Right
    [1, 1], // Down-Right
    [1, 0], // Down
    [1, -1], // Down-Left
    [0, -1], // Left
    [-1, -1], // Up-Left
  ];

  // Return true if move is valid, else false
  const isValidMove = (x: number, y: number, board: number[][]) => {
    if (
      x >= 0 &&
      x < board[0].length &&
      y >= 0 &&
      y < board.length &&
      board[y][x] !== 0 &&
      board[y][x] !== playerColor
    )
      return true;

    return false;
  };

  // Return true if there are same color disc between new disc and another disc, else false
  const hasOccupiedLine = (x: number, y: number, dx: number, dy: number) => {
    let currentX = x;
    let currentY = y;
    while (
      currentX >= 0 &&
      currentX < board[0].length &&
      currentY >= 0 &&
      currentY < board.length
    ) {
      const currentDisc = board[currentY][currentX];

      if (currentDisc === 0) {
        return false;
      } else if (currentDisc === playerColor) {
        return true;
      }

      currentX += dx;
      currentY += dy;
    }
  };

  // Flip discs between line
  const flipDisc = (x: number, y: number, dx: number, dy: number, newBoard: number[][]) => {
    let currentX = x;
    let currentY = y;
    while (board[currentY][currentX] !== playerColor) {
      newBoard[currentY][currentX] = playerColor;
      currentX += dx;
      currentY += dy;
    }
    setplayerColor(2 / playerColor);
  };

  // Calcualte each cell if the disc valid or not to display its possible move
  const calculateValidMove = () => {
    const validMoves: number[][] = [];
    console.log(board);

    // Loop through each cell in the board
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === 0) {
          // Check for the valid move condition (same as in onClick), if true, push a value in validMoves
          directions.forEach((direction) => {
            const [dx, dy] = direction;
            const newX = x + dx;
            const newY = y + dy;

            if (isValidMove(newX, newY, board) && hasOccupiedLine(newX, newY, dx, dy)) {
              validMoves.push([x, y]);
            }
          });
        }
      }
    }

    return validMoves;
  };

  const onClick = (x: number, y: number) => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board));

    directions.forEach((direction) => {
      const [dx, dy] = direction;
      const newX = x + dx;
      const newY = y + dy;

      // Check If new disc is in whole board, checking direction disc is not empty and not the same color if there is a disc
      if (isValidMove(newX, newY, newBoard)) {
        // If there are another same color disc in the straight line, flip all opponent disc in that line
        if (hasOccupiedLine(newX, newY, dx, dy)) {
          flipDisc(x, y, dx, dy, newBoard);
        }
      }
    });

    setBoard(newBoard);
  };

  // Array of possible moves coordinates
  const validMoves = calculateValidMove();

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.disc}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
              {/* Display valid move */}
              {validMoves.some(([vx, vy]) => vx === x && vy === y) && (
                <div
                  className={`${styles.disc} ${styles.valid}`}
                  style={{ background: playerColor === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
