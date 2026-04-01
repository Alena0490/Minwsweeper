import type { CellData } from "../data/game";
import './Field.css'

interface FieldProps {
  board: CellData[][];
}

const Field = ({ board }: FieldProps) => {
  return (
    <div
      className="field"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, var(--cell-size))` }}
    >
      {board.map((row) =>
        row.map((cell) => (
          <button
            key={cell.id}
            className="cell cell--closed"
            type="button"
            aria-label={`Cell ${cell.row + 1}, ${cell.col + 1}, closed`}
          />
        ))
      )}
    </div>
  );
};

export default Field