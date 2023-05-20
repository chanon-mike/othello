import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [playerColor, setplayerColor] = useState(1);

  const [latestMove, setLatestMove] = useState([0, 0]);

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

  // Calculate score for black and whtie
  const calculateScore = () => {
    let blackScore = 0;
    let whiteScore = 0;

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === 1) {
          blackScore += 1;
        } else if (board[y][x] === 2) {
          whiteScore += 1;
        }
      }
    }

    return [blackScore, whiteScore];
  };

  // Calcualte each cell if the disc valid or not to display its possible move
  const calculateValidMove = () => {
    const validMoves: number[][] = [];

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

    if (newBoard[y][x] === 0) {
      directions.forEach((direction) => {
        const [dx, dy] = direction;
        const newX = x + dx;
        const newY = y + dy;

        // Check If new disc is in whole board, checking direction disc is not empty and not the same color if there is a disc
        if (isValidMove(newX, newY, newBoard)) {
          // If there are another same color disc in the straight line, flip all opponent disc in that line
          if (hasOccupiedLine(newX, newY, dx, dy)) {
            setLatestMove([x, y]);
            flipDisc(x, y, dx, dy, newBoard);
          }
        }
      });
    }

    setBoard(newBoard);
  };

  // Array of possible moves coordinates
  const validMoves = calculateValidMove();
  const score = calculateScore();

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.scoreBorder}>
          <div className={styles.disc} style={{ backgroundColor: '#000' }} /> x{score[0]}
        </div>

        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
                {color !== 0 && (
                  <div
                    className={styles.disc}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  >
                    {/* Show a mark of latest move in the middle of a disc */}
                    {latestMove[0] === x && latestMove[1] === y && (
                      <div className={styles.current} />
                    )}
                  </div>
                )}
                {/* Display valid move */}
                {validMoves.some(([vx, vy]) => vx === x && vy === y) && (
                  <span className={`${styles.disc} ${styles.valid}`} />
                )}
              </div>
            ))
          )}
        </div>

        <div className={`${styles.scoreBorder} ${styles.bottom}`}>
          <div className={styles.disc} style={{ backgroundColor: '#fff' }} /> x{score[1]}
        </div>
      </div>
    </div>
  );
};

export default Home;
