import { useState } from "react";
import type { CellData } from "../data/game";
import FlagIcon from '../img/flag.png'
import './Field.css'

interface FieldProps {
  board: CellData[][];
}

const Field = ({ board: initialBoard }: FieldProps) => {
    const [board, setBoard] = useState(initialBoard);

    const handleFlag = (id: string) => {
        setBoard(prev => prev.map(row =>
            row.map(cell => cell.id === id ? { ...cell, isFlagged: !cell.isFlagged } : cell)
        ));
    };

  return (
    <div
      className="field"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, var(--cell-size))` }}
    >
      {board.map((row) =>
        row.map((cell) => (
            <button
                key={cell.id}
                className={`cell cell--closed ${cell.isFlagged ? "cell--flagged" : ""}`}
                type="button"
                aria-label={`Cell ${cell.row + 1}, ${cell.col + 1}, closed`}
                onContextMenu={(e) => {
                    e.preventDefault();
                    handleFlag(cell.id);
                }}
            >
            {cell.isFlagged && <img src={FlagIcon} alt="flag" />}
          </button>
        ))
      )}
    </div>
  );
};

export default Field