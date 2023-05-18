import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setturnColor] = useState(1);

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

  // Direction from top, top left, middle left, ...
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

  const onClick = (x: number, y: number) => {
    console.log(x, y);
    const newBoard: number[][] = JSON.parse(JSON.stringify(board));

    // there is at least one straight (horizontal, vertical, or diagonal) occupied line between the new disc and another disc
    directions.forEach((direction) => {
      if (
        board[y + 1] !== undefined &&
        board[y + direction[0]][x + direction[1]] !== 0 &&
        board[y + direction[0]][x + direction[1]] !== turnColor
      ) {
        newBoard[y + direction[0]][x + direction[1]] = turnColor;
        newBoard[y][x] = turnColor;
        // setturnColor(turnColor === 1 ? 2 : 1);
        setturnColor(2 / turnColor);
      }
      console.log(direction);
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
