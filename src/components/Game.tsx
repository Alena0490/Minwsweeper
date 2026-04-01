
import { useState } from 'react'
import OneGame from './OneGame'
import type { CellData, GameState } from "../data/game";
import { beginnerConfig } from '../data/game';
import GameIcon from '../img/minesweeperIcon.webp'
import './Game.css'

const createEmptyBoard = (rows: number, cols: number): CellData[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      isMine: false,
      isOpen: false,
      // isFlagged: false,
      mark: 'none',
      adjacentMines: 0,
    }))
  );
};

const Game = () => {
    const [gameState, setGameState] = useState<GameState>('playing');
    const [level, setLevel] = useState(beginnerConfig);
    const [board, setBoard] = useState(() =>
    createEmptyBoard(level.rows, level.cols)
    );

    const handleFlag = (id: string) => {
        setBoard(prev => prev.map(row =>
            row.map(cell => cell.id === id ? { ...cell, mark: cell.mark === 'none' ? 'flag' : cell.mark === 'flag' ? 'question' : 'none' } : cell)
        ));
    };

  return (
    <div className='game-container'>
      <div className='title-bar'>
        <span className='title-bar-text'><img className='game-icon' src={GameIcon} alt="Minesweeper Icon" />Minesweeper</span>
        <div className='title-bar-buttons'>
          <button className='btn-minimize'>_</button>
          <button className='btn-maximize'>□</button>
          <button className='btn-close'>✕</button>
        </div>
      </div>
      <menu className='game-menu'>
        <ul>
          <li>Game</li>
          <li>Help</li>
        </ul>
      </menu>
      <OneGame
        board={board}
        onFlag={handleFlag}
       />
    </div>
  )
}

export default Game
