import type { CellData } from "../../data/game";
import FlagIcon from '../../img/flag.png'
import QuestionIcon from '../../img/questionGame.png'
import Mine from '../../img/mine2.png'
import Missflagged from '../../img/misflagged.png'
import MineDeath from '../../img/mine-death.png'
import './Field.css'

interface FieldProps {
    board: CellData[][];
    gameState: 'playing' | 'won' | 'lost';
    onFlag: (id: string) => void;
    onOpen: (id: string) => void;
    isPressed: boolean;
    setIsPressed: (pressed: boolean) => void;
    deathId: string | null;
}

const Field = ({ board, gameState, onFlag, onOpen, isPressed, setIsPressed, deathId }: FieldProps) => {

  return (
    <div
      className="field"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, var(--cell-size))` }}
    >
      {board.map((row) =>
        row.map((cell) => (
            <button
                key={cell.id}
                className={[
                    'cell',
                    'cell--closed',
                    cell.mark === 'flag' && 'cell--flagged',
                    cell.mark === 'question' && 'cell--question',
                    cell.isOpen && 'cell--open',
                    cell.id === deathId && 'cell--death',
                ].filter(Boolean).join(' ')}
                type="button"
                aria-label={`Cell ${cell.row + 1}, ${cell.col + 1}, closed`}
                onClick={() => onOpen(cell.id)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onFlag(cell.id);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
            >
            {cell.isOpen && cell.isMine && (
                cell.id === deathId
                    ? <img src={MineDeath} alt="mine death" />
                    : <img src={Mine} alt="mine" />
            )}
            {!cell.isOpen && cell.mark === 'flag' && !cell.isMine && gameState === 'lost' && (
            <img src={Missflagged} alt="missflag" />
            )}
            {!cell.isOpen && cell.mark === 'flag' && !(gameState === 'lost' && cell.isMine) && (
            <img src={FlagIcon} alt="flag" />
            )}
            {!cell.isOpen && cell.mark === 'question' && <img src={QuestionIcon} alt="question" />}
            {cell.isOpen && !cell.isMine && cell.adjacentMines > 0 && (
            <span className={`cell-number n${cell.adjacentMines}`}>
                {cell.adjacentMines}
            </span>
            )}
          </button>
        ))
      )}
    </div>
  );
};

export default Field