import type { CellData } from "../data/game";
import './OneGame.css'
import Field from './Field'

interface OneGameProps {
    board: CellData[][];
    onFlag: (id: string) => void;
    onOpen: (id: string) => void;
}

const OneGame = ({ board, onFlag, onOpen }: OneGameProps) => {

  return (
    <div className="game-field">
        <div className="status-panel">
            <output className='counter'><span>0</span></output>
            <button className='face-button'>🙂</button>
            <output className='counter'><span>0:00</span></output>
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
