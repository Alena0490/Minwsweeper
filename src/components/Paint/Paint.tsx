import {useState, useRef } from 'react';
import useDraggable from '../../hooks/useDraggable';
import PaintIcon from '../../img/Paint.webp'
import '../../App.css'
import './Paint.css'

import PaintMenu from './PaintMenu'
import PaintApp from './PaintApp'

interface PaintProps {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean | ((prev: boolean) => boolean)) => void;
  isMinimized: boolean;
  setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
  onClose: () => void;
}

const Paint = ({ isFullscreen, setIsFullscreen, isMinimized, setIsMinimized, onClose }: PaintProps) => {
  
  const [tool, setTool] = useState("pencil")
  
  const { position, handleMouseDown } = useDraggable(400, 150);

  const onDownloadRef = useRef<() => void>(() => {});
  const onClearRef = useRef<() => void>(() => {});
  

  return (
    <div
      className={[
        'app-window',
        'paint-window',
        isMinimized && 'paint--minimized', 
        isMinimized && 'app-window--minimized',
        isFullscreen && 'paint--fullscreen',
        isFullscreen && 'app-window--fullscreen',
      ].filter(Boolean).join(' ')}
      style={isFullscreen ? {} : { left: position.x, top: position.y }}
    >
      <div className='title-bar' onMouseDown={handleMouseDown}>
        <span className='title-bar-text'>
          <img className='paint-icon' src={PaintIcon} alt="MS Paint Icon" />
          untitled - Paint
        </span>
        <div className='title-bar-buttons'>
            <button
                className='btn-minimize'
                onClick={() => setIsMinimized(true)}
                type="button"
            >
                _
            </button>
            <button
                className='btn-maximize'
                onClick={() => {
                setIsMinimized(false);
                setIsFullscreen(prev => !prev);
                }}
                type="button"
                aria-label={isFullscreen ? 'Restore' : 'Maximize'}
            >
                {isFullscreen ? '❐' : '□'}
            </button>
            <button
                className='btn-close'
                onClick={onClose} 
                type="button"
                aria-label="Close"
            >
                ✕
            </button>
        </div>
      </div>
      <PaintMenu
        tool={tool}
        setTool={setTool}
      />
      <div className="paint-canvas-area">
            <PaintApp
            onDownloadRef={onDownloadRef}
            onClearRef={onClearRef}
            tool={tool}
            setTool={setTool}
            />
      </div>
      <div className="helper">
        <span>For Help, click Help Topics on the Help Menu.</span>
      </div>
    </div>
  );
};

export default Paint;