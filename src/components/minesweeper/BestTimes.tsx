import { useState } from 'react';
import './GameMiniModal.css'
import '../ModalStyle.css'

interface BestTimesProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const BestTimes = ({ onClose, style }: BestTimesProps) => {
    const defaultTimes = { easy: 999, intermediate: 999, expert: 999 };
    const loadTimes = () => {
        const saved = localStorage.getItem('minesweeper-times');
        return saved ? JSON.parse(saved) : defaultTimes;
    };
    const [times, setTimes] = useState(loadTimes);
    const handleReset = () => {
        localStorage.setItem('minesweeper-times', JSON.stringify(defaultTimes));
        setTimes(defaultTimes);
    };

  return (
    <div id="times" className="xp-dialog" style={style}>
      <div className="title-bar">
        <div className="title-bar-text">Fastest Mine Sweepers</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>
      <div className="xp-dialog-body">
        <ul className="times">
          <li>Easy: <span>{times.easy ?? 999} sec</span></li>
          <li>Intermediate: <span>{times.intermediate ?? 999} sec</span></li>
          <li>Expert: <span>{times.expert ?? 999} sec</span></li>
        </ul>
        <div className="xp-dialog-actions">
          <button type="button" onClick={handleReset}><span className="underline">R</span>eset</button>
          <button type="button" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  )
}

export default BestTimes