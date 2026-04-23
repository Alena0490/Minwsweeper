import {useState, useEffect, useRef, useCallback } from 'react';
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
  const [showGrid, setShowGrid] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [openModal, setOpenModal] = useState<'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null>(null);

  const { position, handleMouseDown } = useDraggable(400, 150);

  

  const setZoomLevel = useCallback((value: number) => {
    setZoom(value);
    setPan({ x: 0, y: 0 });
  }, [setZoom, setPan]);

    const zoomReset = useCallback(() => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
  }, [setZoom, setPan]);

  
  const onDownloadRef = useRef<() => void>(() => {});
  const onOpendRef = useRef<() => void>(() => {});
  const onClearRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setShowColorBox(prev => !prev);
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setShowToolbox(true);
        setShowColorBox(true);
        setShowStatusBar(true);
      }
      if (e.key === 'g' && e.ctrlKey) {
        e.preventDefault();
        setShowGrid(prev => !prev);
      }
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setIsFullscreen(true);
        setShowToolbox(false);
        setShowColorBox(false);
        setShowStatusBar(false);
      }
      if (e.ctrlKey && !e.altKey && e.key === 'e') { e.preventDefault(); setOpenModal('attributes'); }
      if (e.ctrlKey && e.altKey && e.key === 'r') { e.preventDefault(); setOpenModal('fliprotate'); }
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyK') { e.preventDefault(); setOpenModal('stretchskew'); }
      if (e.ctrlKey && e.altKey) {
        console.log('ctrl+alt', e.key, e.code);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen, setIsFullscreen]);

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
        // File
        setTool={setTool}
        onSaveAs={() => setSaveAsOpen(true)}
        onClose={onClose}
        windowPosition={position}
        openModal={openModal}
        setOpenModal={setOpenModal}

        // Edit
        onCut={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', ctrlKey: true, bubbles: true }))}
        onCopy={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true }))}
        onPaste={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true, bubbles: true }))}

        // View
        showToolbox={showToolbox}
        onToggleToolbox={() => setShowToolbox(prev => !prev)}
        showStatusBar={showStatusBar}
        onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
        showColorBox={showColorBox}
        onToggleColorBox={() => setShowColorBox(prev => !prev)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(prev => !prev)}
        showThumbnail={showThumbnail}
        onToggleThumbnail={() => setShowThumbnail(prev => !prev)}
        onZoomLevel={setZoomLevel}
        currentZoom={zoom}
        onZoomToWindow={() => {
          const area = document.querySelector('.draw-area');
          if (!area) return;
          const rect = area.getBoundingClientRect();
          setZoomLevel(Math.min(rect.width / canvasSize.w, rect.height / canvasSize.h));
        }}
        onFullscreen={() => setIsFullscreen(prev => !prev)}
        onViewBitmap={() => {
          setIsFullscreen(true);
          setShowToolbox(false);
          setShowColorBox(false);
          setShowStatusBar(false);
        }}

        // Image
        onFlipRotate={(action, angle) => setFlipRotateAction({ action, angle })}
        onStretchSkew={(stretchH, stretchV, skewH, skewV) => setStretchSkewAction({ stretchH, stretchV, skewH, skewV })}
        onInvertColors={() => setTool('invert')}
        onAttributes={(w, h) => setCanvasSize({ w, h })}
        canvasWidth={700}
        canvasHeight={400}
        isDrawOpaque={selectedBgPreset === 0}
        onDrawOpaque={() => setSelectedBgPreset(prev => prev === 0 ? 1 : 0)}
      />
      <div className="paint-canvas-area">
          <PaintApp
            // Refs
            onDownloadRef={onDownloadRef}
            onOpenRef={onOpendRef}
            onClearRef={onClearRef}

            // Tool
            tool={tool}
            setTool={setTool}

            // Zoom & Pan
            zoom={zoom}
            setZoom={setZoom}
            setZoomLevel={setZoomLevel}
            pan={pan}
            setPan={setPan}
            zoomReset={zoomReset}

            // Status
            onStatusChange={(msg) => {
              if (msg === '__clear_coords__') setStatusCoords("");
              else if (msg.includes(',')) setStatusCoords(msg);
              else setStatusTool(msg);
            }}

            // Save
            saveAsOpen={saveAsOpen}
            setSaveAsOpen={setSaveAsOpen}

            // Visibility
            showColorBox={showColorBox}
            showToolbox={showToolbox}
            showGrid={showGrid}
            showThumbnail={showThumbnail}
            setShowThumbnail={setShowThumbnail}

            // Image actions
            flipRotateAction={flipRotateAction}
            setFlipRotateAction={setFlipRotateAction}
            stretchSkewAction={stretchSkewAction}
            setStretchSkewAction={setStretchSkewAction}

            // Background & Canvas
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