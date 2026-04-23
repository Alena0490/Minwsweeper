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
  const [statusTool, setStatusTool] = useState("For Help, click Help Topics on the Help Menu.");
  const [statusCoords, setStatusCoords] = useState("");
  const [showToolbox, setShowToolbox] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showColorBox, setShowColorBox] = useState(true);
  const [flipRotateAction, setFlipRotateAction] = useState<{action: 'flipH' | 'flipV' | 'rotate', angle?: number} | null>(null);
  const [stretchSkewAction, setStretchSkewAction] = useState<{ stretchH: number; stretchV: number; skewH: number; skewV: number } | null>(null);
  const [selectedBgPreset, setSelectedBgPreset] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 700, h: 400 });

  const { position, handleMouseDown } = useDraggable(400, 150);

  

  const setZoomLevel = useCallback((value: number) => {
    setZoom(value);
    setPan({ x: 0, y: 0 });
  }, [setZoom, setPan]);

  const zoomOut = () => setZoom(z => Math.max(0.25, +(z * 0.9).toFixed(3)));
    const zoomIn  = () => setZoom(z => Math.min(8, +(z * 1.1).toFixed(3)));
    const zoomReset = useCallback(() => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
  }, [setZoom, setPan]);

  const onDownloadRef = useRef<() => void>(() => {});
  const onOpendRef = useRef<() => void>(() => {});
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
        setTool={setTool}
        isZoomed={zoom > 1}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onSaveAs={() => setSaveAsOpen(true)}
        onClose={onClose}
        windowPosition={position}
        onFullscreen={() => setIsFullscreen(prev => !prev)}
        onInvertColors={() => setTool('invert')}
        onCut={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', ctrlKey: true, bubbles: true }))}
        onCopy={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }))}
        onPaste={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true, bubbles: true }))}
        showToolbox={showToolbox}
        onToggleToolbox={() => setShowToolbox(prev => !prev)}
        showStatusBar={showStatusBar}
        onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
        showColorBox={showColorBox}
        onToggleColorBox={() => setShowColorBox(prev => !prev)}
        onFlipRotate={(action, angle) => { setFlipRotateAction({ action, angle }); }}
        onStretchSkew={(stretchH, stretchV, skewH, skewV) => setStretchSkewAction({ stretchH, stretchV, skewH, skewV })}
        isDrawOpaque={selectedBgPreset === 0}
        onDrawOpaque={() => setSelectedBgPreset(prev => prev === 0 ? 1 : 0)}
        canvasWidth={700}
        canvasHeight={400}
        onAttributes={(w, h) => setCanvasSize({ w, h })}
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
            setZoomLevel={setZoomLevel}
            pan={pan}
            setPan={setPan}
            zoomReset={zoomReset}
            onStatusChange={(msg) => {
              if (msg === '__clear_coords__') {
                setStatusCoords("");
              } else if (msg.includes(',')) {
                setStatusCoords(msg);
              } else {
                setStatusTool(msg);
              }
            }}
            saveAsOpen={saveAsOpen}
            setSaveAsOpen={setSaveAsOpen}
            showColorBox={showColorBox}
            showToolbox={showToolbox}
            flipRotateAction={flipRotateAction}
            setFlipRotateAction={setFlipRotateAction}
            stretchSkewAction={stretchSkewAction}
            setStretchSkewAction={setStretchSkewAction}
            selectedBgPreset={selectedBgPreset}
            setSelectedBgPreset={setSelectedBgPreset}
            canvasWidth={canvasSize.w}
            canvasHeight={canvasSize.h}
            />
      </div>
      {showStatusBar &&  
        <div className="helper">
          <span className="help helper__tool">{statusTool}</span>
          <span className="help helper__coords">{statusCoords}</span>
          <span className="help helper__info"></span>
        </div> 
      }
    </div>
  );
};

export default Paint;