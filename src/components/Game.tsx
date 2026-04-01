
import { useState } from 'react'
import OneGame from './OneGame'
import type { CellData } from "../data/game";
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
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
};

const Game = () => {
    const [level, setLevel] = useState(beginnerConfig);
    const [board, setBoard] = useState(() =>
    createEmptyBoard(level.rows, level.cols)
    );

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
       board={board}/>
    </div>
  )
}

export default Game
