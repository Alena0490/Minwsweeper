
import { useState, useEffect } from 'react'
import type { CellData, CellMark, GameState } from "../data/game";
import { generateMines } from '../utils/GenerateMines';
import { beginnerConfig } from '../data/game';
import { floodFill } from '../utils/floodFill';
import GameIcon from '../img/minesweeperIcon.webp'
import './Game.css'
import GameMenu from './GameMenu';
import OneGame from './OneGame';

const createEmptyBoard = (rows: number, cols: number): CellData[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      isMine: false,
      isOpen: false,
      mark: 'none',
      adjacentMines: 0,
    }))
  );
};

interface GameProps {
   isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const Game = ({isFullscreen, setIsFullscreen, isMinimized, setIsMinimized}:GameProps) => {
    const [gameState, setGameState] = useState<GameState>('playing');
    const [level, setLevel] = useState(beginnerConfig);
    const [board, setBoard] = useState(() =>
    createEmptyBoard(level.rows, level.cols)
    );
    const [time, setTime] = useState(0);
    const [mines, setMines] = useState(level.mines);  
    const [isPressed, setIsPressed] = useState(false);
    const [minesPlaced, setMinesPlaced] = useState(false);

    useEffect(() => {
      if (gameState !== 'playing' || time >= 999) return;
      
      const timer = setInterval(() => {
          setTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
  }, [gameState, time]);

    const nextMark = (mark: CellMark): CellMark => {
        if (mark === 'none') return 'flag';
        if (mark === 'flag') return 'question';
        return 'none';
    };

    // Game.tsx
    const handleFlag = (id: string) => {
        const cell = board.flat().find(c => c.id === id);
        if (!cell || cell.isOpen) return;

        const newMark = nextMark(cell.mark);

        if (newMark === 'flag') setMines(prev => prev - 1);
        if (cell.mark === 'flag') setMines(prev => prev + 1);

        setBoard(prev => prev.map(row =>
            row.map(c => c.id === id ? { ...c, mark: newMark } : c)
        ));
    };

    const handleOpen = (id: string) => {
      setBoard(prev => {
          let currentBoard = prev;

          if (!minesPlaced) {
              const cell = prev.flat().find(c => c.id === id);
              if (!cell) return prev;
              currentBoard = generateMines(prev, level.mines, cell.row, cell.col);
              setMinesPlaced(true);
          }

          const cell = currentBoard.flat().find(c => c.id === id);
          if (!cell || cell.mark !== 'none') return currentBoard;

          return floodFill(currentBoard, cell.row, cell.col);
      });
  };

  const handleReset = () => {
    setBoard(createEmptyBoard(level.rows, level.cols));
    setGameState('playing');
    setTime(0);
    setMines(level.mines);
    setMinesPlaced(false); 
  };

  return (
    <div 
      className={[
        'game-container',
        isMinimized && 'game--minimized',
        isFullscreen && 'game--fullscreen',
      ].filter(Boolean).join(' ')}
    >
      <div className='title-bar'>
        <span className='title-bar-text'><img className='game-icon' src={GameIcon} alt="Minesweeper Icon" />Minesweeper</span>
        <div className='title-bar-buttons'>
          <button
            className='btn-minimize'
            onClick={() => setIsMinimized(true)}
            type="button"
          >
            _
          </button>
          <button
            className='btn-maximize'
            onClick={() => {
              setIsMinimized(false);
              setIsFullscreen(prev => !prev);
            }}
            type="button"
            aria-label={isFullscreen ? 'Restore' : 'Maximize'}
          >
            {isFullscreen ? '❐' : '□'}
          </button>

          <button
            className='btn-close'
            onClick={() => setIsMinimized(true)}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
      <GameMenu/>
      <OneGame
        board={board}
        time={time}
        mines={mines}
        handleReset={handleReset}
        onFlag={handleFlag}
        onOpen={handleOpen}
        gameState={gameState}
        setGameState={setGameState}
        isPressed={isPressed}
        setIsPressed={setIsPressed}
       />
    </div>
  )
}

export default Game
