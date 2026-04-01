import type { CellData } from "../data/game";
import FlagIcon from '../img/flag.png'
import QuestionIcon from '../img/question.png'
import './Field.css'

interface FieldProps {
    board: CellData[][];
    onFlag: (id: string) => void;
}

const Field = ({ board, onFlag }: FieldProps) => {

  return (
    <div
      className="field"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, var(--cell-size))` }}
    >
      {board.map((row) =>
        row.map((cell) => (
            <button
                key={cell.id}
                className={`cell cell--closed ${cell.mark === 'flag' ? "cell--flagged" : ""} ${cell.mark === 'question' ? "cell--question" : ""}`}
                type="button"
                aria-label={`Cell ${cell.row + 1}, ${cell.col + 1}, closed`}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onFlag(cell.id);
                }}
            >
            {cell.mark === 'flag' && <img src={FlagIcon } alt="flag" />}
            {cell.mark === 'question' && <img src={QuestionIcon} alt="question" />}
          </button>
        ))
      )}
    </div>
  );
};

export default Field