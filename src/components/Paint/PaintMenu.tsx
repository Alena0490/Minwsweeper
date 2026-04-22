import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import About from './AboutPaint'
import './PaintMenu.css'

interface PaintMenuProps {
  setTool: React.Dispatch<React.SetStateAction<string>>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isZoomed: boolean;
  onSaveAs: () => void;
  onClose: () => void;
  windowPosition: { x: number; y: number };
}

const PaintMenu = ({ setTool, onZoomIn, onZoomOut, isZoomed, onSaveAs, onClose, windowPosition }: PaintMenuProps) => {
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'image' | 'colors' | 'help' | null>(null)
       const [openModal, setOpenModal] = useState<'about' | 'times' | 'custom' | null>(null)
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
            <li className={itemClass(true)} aria-disabled="true">
              Cut <span>Ctrl+X</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Copy <span>Ctrl+C</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Paste <span>Ctrl+V</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Clear Selection <span>Del</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
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
            <li className={itemClass(true)} aria-disabled="true">
              Tool Box
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Color Box <span>Ctrl+L</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Status Bar
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Text Toolbar
            </li>
            <li className="separator" aria-hidden="true" />
            <li onClick={() => { if (isZoomed) { onZoomOut() } else { onZoomIn() } setOpenMenu(null) }}>
              Zoom In
            </li>
            <li
              className={itemClass(!isZoomed)}
              aria-disabled={!isZoomed}
              onClick={() => { if (!isZoomed) return; onZoomOut(); setOpenMenu(null) }}
            >
              Zoom Out
            </li>
            <li className="separator" aria-hidden="true" />
            <li className={itemClass(true)} aria-disabled="true">
              View Bitmap <span>Ctrl+F</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Fullscreen <span>F11</span>
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'image' ? null : 'image')}>
          Image
          <ul className={`submenu ${openMenu === 'image' ? 'open' : ''}`}>
            <li className={itemClass(true)} aria-disabled="true">
              Flip/Rotate <span>Ctrl+Alt+R</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Stretch/Skew <span>Ctrl+Alt+W</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Invert Colors <span>Ctrl+I</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Attributes... <span>Ctrl+E</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Clear Image
            </li>
            <li className={itemClass(true)} aria-disabled="true">
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
    </menu>
  )
}

export default PaintMenu