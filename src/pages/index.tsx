import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);

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

  // Function to find if there are same color disc between new disc and another disc
  const findOccupiedLine = (x: number, y: number, dx: number, dy: number, board: number[][]) => {
    let currentX = x;
    let currentY = y;
    while (
      currentX >= 0 &&
      currentX < board[y].length &&
      currentY >= 0 &&
      currentY < board[x].length
    ) {
      const currentDisc = board[currentY][currentX];

      if (currentDisc === 0) {
        return false;
      } else if (currentDisc === turnColor) {
        return true;
      }

      currentX += dx;
      currentY += dy;
    }
  };

  const onClick = (x: number, y: number) => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board));

    directions.forEach((direction) => {
      const [dx, dy] = direction;
      const newX = x + dx;
      const newY = y + dy;

      // Check If new disc is in whole board, checking direction disc is not empty and not the same color if there is a disc
      if (
        newX >= 0 &&
        newX < board[y].length &&
        newY >= 0 &&
        newY < board.length &&
        board[newY][newX] !== 0 &&
        board[newY][newX] !== turnColor
      ) {
        // If there are another same color disc in the straight line, flip all opponent disc in that line
        if (findOccupiedLine(newX, newY, dx, dy, board)) {
          let currentX = x;
          let currentY = y;
          while (board[currentY][currentX] !== turnColor) {
            newBoard[currentY][currentX] = turnColor;
            currentX += dx;
            currentY += dy;
          }
          setTurnColor(2 / turnColor);
        }
      }
    });

    setBoard(newBoard);
  };

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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
