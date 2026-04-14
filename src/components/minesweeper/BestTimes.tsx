import { useState } from 'react';
import './GameMiniModal.css'


const BestTimes =  ({ onClose }: { onClose: () => void })  => {
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
    <div id='times' className='mini-modal'>
        <header>
            <h3>Fastest</h3>
            <button className='red' onClick={onClose}>✕</button>
        </header>
        <div className='main-text'>
            <p>Fastest Mine Sweepers</p>
            <ul className='times'>
                <li>Easy: <span>{times.easy ?? 999} sec</span></li>
                <li>Intermediate: <span>{times.intermediate ?? 999} sec</span></li>
                <li>Expert: <span>{times.expert ?? 999} sec</span></li>
            </ul>
            
            <div className="set-buttons">
                <button type="button" onClick={handleReset}><span className='underline'>R</span>eset</button>
                <button type="button" onClick={onClose}>OK</button>
            </div>
        </div>
    </div>
  )
}

export default BestTimes