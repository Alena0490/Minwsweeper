import type { CellData } from "../data/game";
import './OneGame.css'
import Field from './Field'

interface OneGameProps {
  board: CellData[][];
}

const OneGame = ({ board }: OneGameProps) => {

  return (
    <div className="game-field">
        <div className="status-panel">
            <output className='counter'><span>0</span></output>
            <button className='face-button'>🙂</button>
            <output className='counter'><span>0:00</span></output>
        </div>
        <Field board={board} />
    </div>
  );
};

export default OneGame
