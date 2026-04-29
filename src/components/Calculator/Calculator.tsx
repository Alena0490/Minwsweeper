import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import CalculatorMenu from './CalculatorMenu'
import CalculatorApp from './CalculatorApp'
import CalculatorIcon from '../../img/Calculator.webp'
import CalculatorScientific from './CalculatorScientific'
import '../../App.css'
import './Calculator.css'

interface CalculatorProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void
}

const Calculator = ({
    onClose, 
    isMinimized, 
    setIsMinimized, 
    isFullscreen, 
    toggleFullscreen,
    onMouseDown 
}: CalculatorProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);

    const [display, setDisplay] = useState("0");
    const [digitGrouping, setDigitGrouping] = useState(false);
    const [isScientific, setIsScientific] = useState(false);

  return (
      <div
        className={[
            'app-window',
            'calculator-window',
            isMinimized && 'calculator--minimized', 
            isMinimized && 'app-window--minimized',
            isFullscreen && 'calculator--fullscreen',
            isFullscreen && 'app-window--fullscreen',
        ].filter(Boolean).join(' ')}
        style={isFullscreen ? {} : { left: position.x, top: position.y }}
        onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                <img className='paint-icon' src={CalculatorIcon} alt="MS Calculator Icon" />
                Calculator
                </span>
                <div className="title-bar-buttons xp-title-controls">
                    <button
                        className="xp-title-control btn-minimize"
                        onClick={() => setIsMinimized(true)}
                        type="button"
                        aria-label="Minimize"
                    >
                        _
                    </button>

                    <button
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                        setIsMinimized(false);
                        toggleFullscreen();
                        }}
                        type="button"
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>

                    <button
                        className="xp-title-control btn-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    </div>
            </div>
        <CalculatorMenu
            windowPosition={position}
            display={display}
            onPaste={(value) => setDisplay(value)}
            digitGrouping={digitGrouping}
            onToggleDigitGrouping={() => setDigitGrouping(prev => !prev)}
            isScientific={isScientific}
            onToggleScientific={() => setIsScientific(prev => !prev)}
            
        />
        

        {isScientific 
            ? <CalculatorScientific 
                display={display} 
                setDisplay={setDisplay} 
                digitGrouping={digitGrouping} 
            />
            : <CalculatorApp
                    display={display} 
                    setDisplay={setDisplay} 
                    digitGrouping={digitGrouping}
                />
        }
    </div>
  )
}

export default Calculator
