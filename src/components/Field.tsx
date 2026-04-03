import type { CellData } from "../data/game";
import FlagIcon from '../img/flag.png'
import QuestionIcon from '../img/question.png'
import './Field.css'

interface FieldProps {
    board: CellData[][];
    gameState: 'playing' | 'won' | 'lost';
    onFlag: (id: string) => void;
    onOpen: (id: string) => void;
    isPressed: boolean;
    setIsPressed: (pressed: boolean) => void;
}

const Field = ({ board, gameState, onFlag, onOpen, isPressed, setIsPressed }: FieldProps) => {

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
            {cell.mark === 'flag' && <img src={FlagIcon} alt="flag" />}
            {cell.mark === 'question' && <img src={QuestionIcon} alt="question" />}
            {cell.isOpen && cell.adjacentMines > 0 && (
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