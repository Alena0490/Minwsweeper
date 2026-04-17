import type { CellData } from "../../data/game";
import './OneGame.css'
import Field from './Field'
import GameFace from '../../img/smile.png'
import WinFace from '../../img/win.png'
import LoseFace from '../../img/dead.png'
import OhFace from '../../img/ohh.png'

interface OneGameProps {
    board: CellData[][];
    time: number;
    mines: number;
    gameState: 'playing' | 'won' | 'lost';
    handleReset: () => void;
    setGameState: (state: 'playing' | 'won' | 'lost') => void;
    isPressed: boolean;
    setIsPressed: (pressed: boolean) => void;
    onFlag: (id: string) => void;
    onOpen: (id: string) => void;
    deathId: string | null;
}

const OneGame = ({ board, time, mines, gameState, handleReset, setGameState, isPressed, setIsPressed, onFlag, onOpen, deathId }: OneGameProps) => {
    const getFace = () => {
        if (isPressed) return <img src={OhFace} alt="Oh" />;
        if (gameState === 'won') return <img src={WinFace} alt="Win" />;
        if (gameState === 'lost') return <img src={LoseFace} alt="Lose" />;
        return <img src={GameFace} alt="Smile" />;
    };
    
  return (
    <div className="game-field">
        <div className="status-panel-outer">
            <div className="status-panel">
                <output className='counter'>
                    <span>
                        {String(mines).padStart(3, '0').split('').map((digit, i) => (
                            <span 
                                className="digit"
                                key={i}   
                            >
                                {digit}
                            </span>
                        ))}
                    </span>
                </output>
                <button 
                    className='face-button'
                    onClick={handleReset}
                >{getFace()}</button>
                <output className='counter'>
                    <span>
                        {String(time).padStart(3, '0').split('').map((digit, i) => (
                            <span
                                className="digit" 
                                key={i} 
                            >
                                {digit}
                            </span>
                        ))}
                    </span>
                </output>
            </div>
        </div>
            <Field 
                board={board}
                onFlag={onFlag}
                onOpen={onOpen}
                setIsPressed={setIsPressed}
                gameState={gameState}
                setGameState={setGameState}
                deathId={deathId}
            />
    </div>
  );
};

export default OneGame
