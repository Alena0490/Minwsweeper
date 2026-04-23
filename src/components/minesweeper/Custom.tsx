import { useState } from 'react'
import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import './GameMiniModal.css'
import '../ModalStyle.css'
import type { BoardConfig } from '../../data/game'

interface CustomProps {
    onClose: () => void;
    onReset: (newLevel: BoardConfig) => void;
    setLevel: (level: BoardConfig) => void;
    style?: React.CSSProperties;
}

const Custom = ({ onClose, onReset, setLevel, style }: CustomProps) => {
  const [height, setHeight] = useState(9);
  const [width, setWidth] = useState(9);
  const [mines, setMines] = useState(10);

  const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

  const handleOk = () => {
      const rows = Math.min(24, Math.max(9, height));
      const cols = Math.min(30, Math.max(9, width));
      const maxMines = rows * cols - 1;
      const safeMines = Math.min(maxMines, Math.max(10, mines));
      const newLevel: BoardConfig = { rows, cols, mines: safeMines };
      setLevel(newLevel);
      onReset(newLevel);
      onClose();
  };

  return (
    <div 
      id="custom" 
      className="xp-dialog" 
      style={{ ...style, ...draggableStyle }}
      ref={dialogRef}
      tabIndex={-1}
      onMouseDown={onMouseDown}
    >
      <div className="title-bar">
        <div className="title-bar-text">Custom Field</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>
      <div className="xp-dialog-body">
        <ul>
          <li>
            <label htmlFor="height">Height:</label>
            <input id="height" type="number" min={9} max={24} value={height}
              onChange={e => setHeight(Number(e.target.value))} />
          </li>
          <li>
            <label htmlFor="width">Width:</label>
            <input id="width" type="number" min={9} max={30} value={width}
              onChange={e => setWidth(Number(e.target.value))} />
          </li>
          <li>
            <label htmlFor="mines">Mines:</label>
            <input id="mines" type="number" min={10} value={mines}
              onChange={e => setMines(Number(e.target.value))} />
          </li>
        </ul>
        <div className="xp-dialog-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button 
            type="button" 
            onClick={handleOk}
            autoFocus
          >OK</button>
        </div>
      </div>
    </div>
  )
}

export default Custom