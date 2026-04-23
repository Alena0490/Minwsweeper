import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import About from './AboutPaint'
import FlipRotate from './FlipRotate';
import StretchSkew from './StretchSkew';
import Attributes from './Attributes';
import CustomZoom from './CustomZoom';
import './PaintMenu.css'
interface PaintMenuProps {
  setTool: React.Dispatch<React.SetStateAction<string>>;
  onSaveAs: () => void;
  onClose: () => void;
  windowPosition: { x: number; y: number };
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onFullscreen: () => void;
  onInvertColors: () => void;
  showToolbox: boolean;
  onToggleToolbox: () => void;
  showStatusBar: boolean;
  onToggleStatusBar: () => void;
  showColorBox: boolean;
  onToggleColorBox: () => void;
  onFlipRotate: (action: 'flipH' | 'flipV' | 'rotate', angle?: number) => void;
  onStretchSkew: (stretchH: number, stretchV: number, skewH: number, skewV: number) => void;
  onDrawOpaque: () => void;
  isDrawOpaque: boolean;
  onAttributes: (width: number, height: number) => void;
  canvasWidth: number;
  canvasHeight: number;
  onViewBitmap: () => void;
  onZoomLevel: (value: number) => void;
  currentZoom: number;
  onZoomToWindow: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

const PaintMenu = ({ 
  setTool, 
  onZoomLevel,
  currentZoom,
  onZoomToWindow,
  onSaveAs, 
  onClose, 
  windowPosition, 
  onCut, 
  onCopy, 
  onPaste, 
  onFullscreen ,
  onInvertColors,
  showColorBox,
  showStatusBar,
  showToolbox,
  onToggleColorBox,
  onToggleStatusBar,
  onToggleToolbox,
  onFlipRotate,
  onStretchSkew,
  onDrawOpaque,
  isDrawOpaque,
  onAttributes,
  canvasHeight,
  canvasWidth,
  onViewBitmap,
  showGrid,
  onToggleGrid
}: PaintMenuProps) => {
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'image' | 'colors' | 'help' | null>(null)
  const [openModal, setOpenModal] = useState<'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null>(null)
  

  const menuRef = useRef<HTMLElement>(null)

  const itemClass = (disabled = false, extra = '') =>
    `${disabled ? 'is-disabled' : ''}${extra ? ` ${extra}` : ''}`.trim()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <menu className='paint-menu' ref={menuRef}>
      <ul>
        <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}>
          File
          <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
            <li onClick={() => { setTool('clear'); setOpenMenu(null) }}>
              New <span>Ctrl+N</span>
            </li>

            <li onClick={() => { setTool('open'); setOpenMenu(null) }}>
              Open... <span>Ctrl+O</span>
            </li>

            <li onClick={() => { setTool('download'); setOpenMenu(null) }}>
              Save <span>Ctrl+S</span>
            </li>

            <li onClick={() => { onSaveAs(); setOpenMenu(null) }}>
              Save As...
            </li>

            <li className="separator" aria-hidden="true" />

            <li className={itemClass(true)} aria-disabled="true">
              Print Preview
            </li>

            <li className={itemClass(true)} aria-disabled="true">
              Print... <span>Ctrl+P</span>
            </li>

            <li className="separator" aria-hidden="true" />

            <li onClick={onClose}>
              Exit
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
          Edit
          <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
            <li onClick={() => { setTool('undo'); setOpenMenu(null) }}>
              Undo <span>Ctrl+Z</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Repeat <span>F4</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              History <span>Ctrl+Shift+Y</span>
            </li>
            <li className="separator" aria-hidden="true" />
            <li onClick={() => { onCut(); setOpenMenu(null) }}>
              Cut <span>Ctrl+X</span>
            </li>
            <li onClick={() => { onCopy(); setOpenMenu(null) }}>
              Copy <span>Ctrl+C</span>
            </li>
            <li onClick={() => { onPaste(); setOpenMenu(null) }}>
              Paste <span>Ctrl+V</span>
            </li>
            <li onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true })); setOpenMenu(null) }}>
              Clear Selection <span>Del</span>
            </li>
            <li onClick={() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true })); setOpenMenu(null) }}>
              Select All <span>Ctrl+A</span>
            </li>
            <li className="separator" aria-hidden="true" />
            <li className={itemClass(true)} aria-disabled="true">
              Copy To...
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Paste From...
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
          View
          <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
            <li 
              className={showToolbox ? 'checked' : ''}
              onClick={() => { onToggleToolbox(); setOpenMenu(null) }}
            >
              Tool Box
            </li>
            <li 
              className={showColorBox ? 'checked' : ''}
              onClick={() => { onToggleColorBox(); setOpenMenu(null) }}
            >
              Color Box <span>Ctrl+L</span>
            </li>
            <li 
              className={showStatusBar ? 'checked' : ''}
              onClick={() => { onToggleStatusBar(); setOpenMenu(null) }}
            >
              Status Bar
            </li>
            <li className="is-disabled" aria-disabled="true">
              Text Toolbar
            </li>
            <li className="separator" aria-hidden="true" />
            <li className="has-submenu">
              Zoom
              <ul className="submenu">
                <li onClick={() => { onZoomLevel(1); setOpenMenu(null) }}>Normal Size</li>
                <li onClick={() => { onZoomLevel(2); setOpenMenu(null) }}>Large Size</li>
                <li onClick={() => { onZoomToWindow(); setOpenMenu(null) }}>Zoom To Window</li>
                <li onClick={() => { setOpenModal('customzoom'); setOpenMenu(null) }}>Custom...</li>
                <li className="separator" aria-hidden="true" />
                <li 
                  className={showGrid ? 'checked' : ''}
                  onClick={() => { onToggleGrid(); setOpenMenu(null) }}
                >
                  Show Grid <span>Ctrl+G</span>
                </li>
                <li className="is-disabled" aria-disabled="true">
                  Show Thumbnail
                </li>
              </ul>
            </li>   
            <li onClick={() => { onViewBitmap(); setOpenMenu(null) }}>
              View Bitmap <span>Ctrl+F</span>
            </li>
             <li className="separator" aria-hidden="true" />
            <li onClick={() => { onFullscreen(); setOpenMenu(null) }}>
              Fullscreen <span>F11</span>
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'image' ? null : 'image')}>
          Image
          <ul className={`submenu ${openMenu === 'image' ? 'open' : ''}`}>
            <li onClick={() => { setOpenModal('fliprotate'); setOpenMenu(null) }}>
              Flip/Rotate <span>Ctrl+Alt+R</span>
            </li>
            <li onClick={() => { setOpenModal('stretchskew'); setOpenMenu(null) }}>
              Stretch/Skew <span>Ctrl+Alt+W</span>
            </li>
            <li onClick={() => { onInvertColors(); setOpenMenu(null) }}>
              Invert Colors <span>Ctrl+I</span>
            </li>
            <li onClick={() => { setOpenModal('attributes'); setOpenMenu(null) }}>
              Attributes... <span>Ctrl+E</span>
            </li>
            <li onClick={() => { setTool('clear'); setOpenMenu(null) }}>
              Clear Image
            </li>
            <li 
              className={isDrawOpaque ? 'checked' : ''}
              onClick={() => { onDrawOpaque(); setOpenMenu(null) }}
            >
              Draw Opaque
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'colors' ? null : 'colors')}>
          Colors
          <ul className={`submenu ${openMenu === 'colors' ? 'open' : ''}`}>
            <li className={itemClass(true)} aria-disabled="true">
              Edit Colors...
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Get Colors
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Save Colors
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
          Help
          <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
            <li className={itemClass(true)} aria-disabled="true">
              Help Topics
            </li>
            <li className="separator" aria-hidden="true" />
            <li onClick={() => { setOpenModal('about'); setOpenMenu(null) }}>
              About Paint
            </li>
          </ul>
        </li>
      </ul>
        {openModal === 'about' && createPortal(
          <About 
            onClose={() => setOpenModal(null)}
            style={{
              position: 'fixed',
              top: windowPosition.y + 145,
              left: windowPosition.x + 90,
            }}
          />,
          document.body
        )}

        {openModal === 'fliprotate' && createPortal(
          <FlipRotate
            onClose={() => setOpenModal(null)}
            onConfirm={(action, angle) => { onFlipRotate(action, angle); setOpenModal(null); }}
            style={{
              position: 'fixed',
              top: windowPosition.y + 145,
              left: windowPosition.x + 90,
            }}
          />,
          document.body
        )}

        {openModal === 'stretchskew' && createPortal(
          <StretchSkew
            onClose={() => setOpenModal(null)}
            onConfirm={(stretchH, stretchV, skewH, skewV) => { onStretchSkew(stretchH, stretchV, skewH, skewV); setOpenModal(null); }}
            style={{
              position: 'fixed',
              top: windowPosition.y + 145,
              left: windowPosition.x + 90,
            }}
          />,
          document.body
        )}

        {openModal === 'attributes' && createPortal(
          <Attributes
            onClose={() => setOpenModal(null)}
            onConfirm={(w, h) => { onAttributes(w, h); setOpenModal(null); }}
            currentWidth={canvasWidth}
            currentHeight={canvasHeight}
            style={{
              position: 'fixed',
              top: windowPosition.y + 145,
              left: windowPosition.x + 90,
            }}
          />,
          document.body
        )}

        {openModal === 'customzoom' && createPortal(
          <CustomZoom
            onClose={() => setOpenModal(null)}
            onConfirm={(zoom) => { onZoomLevel(zoom); setOpenModal(null); }}
            currentZoom={currentZoom}
            style={{
              position: 'fixed',
              top: windowPosition.y + 145,
              left: windowPosition.x + 90,
            }}
          />,
          document.body
        )}
    </menu>
  )
}

export default PaintMenu