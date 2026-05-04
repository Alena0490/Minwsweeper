import { useState, useEffect, useRef } from 'react';
import type { CellData, CellMark, GameState, BoardConfig } from '../../data/game';
import { generateMines } from '../../utils/generateMines';
import { beginnerConfig, intermediateConfig } from '../../data/game';
import { floodFill } from '../../utils/floodFill';
import useDraggable from '../../hooks/useDraggable';
import useSound from '../../hooks/useSound';
import GameIcon from '../../img/minesweeperIcon.webp';
import '../../App.css';
import './Game.css';
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
    onClose: () => void;
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    onMouseDown?: () => void;
}

const Game = ({
    onClose,
    isFullscreen,
    setIsFullscreen,
    isMinimized,
    setIsMinimized,
    onMouseDown,
}: GameProps) => {
    const [gameState, setGameState] = useState<GameState>('playing');
    const [level, setLevel] = useState(beginnerConfig);
    const [board, setBoard] = useState(() => createEmptyBoard(level.rows, level.cols));
    const [time, setTime] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [mines, setMines] = useState(level.mines);
    const [isPressed, setIsPressed] = useState(false);
    const [minesPlaced, setMinesPlaced] = useState(false);
    const [deathId, setDeathId] = useState<string | null>(null);
    const [marksEnabled, setMarksEnabled] = useState(true);

    const { position, handleMouseDown } = useDraggable(400, 150);
    const timeRef = useRef(0);

    // Game sounds
    const { playTick, playWin, playLose, enabled, toggleSound } = useSound();

    const handleReset = (newLevel?: BoardConfig) => {
        const activeLevel = newLevel ?? level;
        setBoard(createEmptyBoard(activeLevel.rows, activeLevel.cols));
        setGameState('playing');
        setTime(0);
        setMines(activeLevel.mines);
        setMinesPlaced(false);
        setHasStarted(false);
        setDeathId(null);
    };

    // Timer — runs while game is active, stops at 999
    useEffect(() => {
        if (!hasStarted || gameState !== 'playing' || time >= 999) return;
        const timer = setInterval(() => {
            setTime(prev => {
                const next = Math.min(999, prev + 1);
                timeRef.current = next;
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [hasStarted, gameState, time]);

    // Cycle cell mark: none → flag → question (if marks enabled) → none
    const nextMark = (mark: CellMark): CellMark => {
        if (mark === 'none') return 'flag';
        if (mark === 'flag') return marksEnabled ? 'question' : 'none';
        return 'none';
    };

    // Right-click flag handler
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

    // Left-click open handler
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

            // Game won
            const allOpen = newBoard.flat().every(cell => cell.isMine || cell.isOpen);
            if (allOpen) {
                setGameState('won');
                playWin();

                // Save best time
                const saved = JSON.parse(localStorage.getItem('minesweeper-times') || '{}');
                const key = level === beginnerConfig ? 'easy'
                    : level === intermediateConfig ? 'intermediate'
                    : 'expert';

                if (timeRef.current < (saved[key] ?? 999)) {
                    const updated = { ...saved, [key]: timeRef.current };
                    localStorage.setItem('minesweeper-times', JSON.stringify(updated));
                }
            }

            return newBoard;
        });
    };

    return (
        <div
            className={[
                'game-container',
                'app-window',
                isMinimized && 'game--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'game--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div
                className='title-bar'
                onMouseDown={handleMouseDown}
            >
                <span className='title-bar-text'>
                    <img className='game-icon' src={GameIcon} alt='Minesweeper Icon' />
                    {level === beginnerConfig ? 'Mineswe...' : 'Minesweeper'}
                </span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        aria-label='Minimize'
                    >
                        _
                    </button>
                    <button
                        type='button'
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            setIsFullscreen(prev => !prev);
                        }}
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        aria-label='Close'
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
                windowPosition={position}
                soundEnabled={enabled}
                onSoundToggle={toggleSound}
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
    );
};

export default Game;