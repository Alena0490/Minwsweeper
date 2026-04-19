import {useState, useRef, useCallback } from 'react';
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
  
  const [tool, setTool] = useState("pencil");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [saveAsOpen, setSaveAsOpen] = useState(false);

  const { position, handleMouseDown } = useDraggable(400, 150);

  const zoomOut = () => setZoom(z => Math.max(0.25, +(z * 0.9).toFixed(3)));
  const zoomIn  = () => setZoom(z => Math.min(4, +(z * 1.1).toFixed(3)));
  const zoomReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, [setZoom, setPan]);

  const onDownloadRef = useRef<() => void>(() => {});
  const onOpendRef = useRef<() => void>(() => {});
  const onClearRef = useRef<() => void>(() => {});
  const statusRef = useRef<HTMLSpanElement>(null);
  

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
        setTool={setTool}
        isZoomed={zoom > 1}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onSaveAs={() => setSaveAsOpen(true)}
      />
      <div className="paint-canvas-area">
          <PaintApp
            onDownloadRef={onDownloadRef}
            onOpenRef={onOpendRef}
            onClearRef={onClearRef}
            tool={tool}
            setTool={setTool}
            zoom={zoom}
            setZoom={setZoom}
            pan={pan}
            setPan={setPan}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            zoomReset={zoomReset}
            onStatusChange={(msg) => { if (statusRef.current) statusRef.current.textContent = msg; }}
            saveAsOpen={saveAsOpen}
            setSaveAsOpen={setSaveAsOpen}
            />
      </div>
      <div className="helper">
        <span ref={statusRef}>For Help, click Help Topics on the Help Menu.</span>
      </div>
    </div>
  );
};

export default Paint;