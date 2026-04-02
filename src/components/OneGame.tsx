import type { CellData } from "../data/game";
import './OneGame.css'
import Field from './Field'

interface OneGameProps {
    board: CellData[][];
    time: number;
    mines: number;
    onFlag: (id: string) => void;
    onOpen: (id: string) => void;
}

const OneGame = ({ board, time, mines, onFlag, onOpen }: OneGameProps) => {

  return (
    <div className="game-field">
        <div className="status-panel">
            <output className='counter'><span>{mines}</span></output>
            <button className='face-button'>🙂</button>
            <output className='counter'><span>{String(time).padStart(3, '0')}</span></output>
        </div>
        <Field 
            board={board}
            onFlag={onFlag}
            onOpen={onOpen}
        />
    </div>
  );
};

export default OneGame
