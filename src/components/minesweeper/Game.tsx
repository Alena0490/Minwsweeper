
import { useState, useEffect } from 'react'
import type { CellData, CellMark, GameState } from "../../data/game";
import { generateMines } from '../../utils/generateMines';
import { beginnerConfig, intermediateConfig, expertConfig } from '../../data/game';
import { floodFill } from '../../utils/floodFill';
import useSound from '../../hooks/useSound';
import GameIcon from '../../img/minesweeperIcon.webp'
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
    const [hasStarted, setHasStarted] = useState(false);
    const [mines, setMines] = useState(level.mines);  
    const [isPressed, setIsPressed] = useState(false);
    const [minesPlaced, setMinesPlaced] = useState(false);
    const [deathId, setDeathId] = useState<string | null>(null);
    const [marksEnabled, setMarksEnabled] = useState(true);

    useEffect(() => {
      if (!hasStarted || gameState !== 'playing' || time >= 999) return;
        
        const timer = setInterval(() => {
          setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, gameState, time]);


    // Game sounds
    const { playTick, playWin, playLose } = useSound();

    //Flagging mines
    const nextMark = (mark: CellMark): CellMark => {
        if (mark === 'none') return 'flag';
        if (mark === 'flag') return marksEnabled ? 'question' : 'none';
        return 'none';
    };

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
      if (gameState !== 'playing') return;
      setBoard(prev => {
          let currentBoard = prev;

          if (!minesPlaced) {
              const firstCell = prev.flat().find(c => c.id === id);
              if (!firstCell) return prev;
              currentBoard = generateMines(prev, level.mines, firstCell.row, firstCell.col);
              setMinesPlaced(true);
              setHasStarted(true);
          }

          const cell = currentBoard.flat().find(c => c.id === id);
          if (!cell || cell.mark !== 'none') return currentBoard;
          playTick();

          // Game lost
          if (cell.isMine) {
            setGameState('lost');
            setDeathId(cell.id); 
            playLose();
            return currentBoard.map(row =>
              row.map(c => ({
                ...c,
                isOpen: c.isMine ? true : c.isOpen,
              }))
            );
          }

          const newBoard = floodFill(currentBoard, cell.row, cell.col);

          // Game Won
          const allOpen = newBoard.flat().every(cell => cell.isMine || cell.isOpen);
            if (allOpen) {
              setGameState('won');
              playWin();

              // Save best time              
              const saved = JSON.parse(localStorage.getItem('minesweeper-times') || '{}');
              const key = level === beginnerConfig ? 'easy' 
                : level === intermediateConfig ? 'intermediate' 
                : 'expert';
              
              if (time < (saved[key] ?? 999)) {
                const updated = { ...saved, [key]: time };
                localStorage.setItem('minesweeper-times', JSON.stringify(updated));
              }
            }

          return newBoard;
      });
  };

  const handleReset = () => {
    setBoard(createEmptyBoard(level.rows, level.cols));
    setGameState('playing');
    setTime(0);
    setMines(level.mines);
    setMinesPlaced(false); 
    setHasStarted(false); 
    setDeathId(null)
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
      <GameMenu
        onReset={handleReset}
        onMarksChange={setMarksEnabled}
        level={level}
        setLevel={setLevel}
        setIsMinimized={setIsMinimized}
      />
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
        deathId={deathId}
       />
    </div>
  )
}

export default Game
