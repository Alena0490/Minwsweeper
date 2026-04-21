import { useState, useEffect, useRef } from 'react'
import './PaintMenu.css'

interface PaintMenuProps {
  setTool: React.Dispatch<React.SetStateAction<string>>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isZoomed: boolean;
  onSaveAs: () => void;
  onClose: () => void;
}

const PaintMenu = ({ setTool, onZoomIn, onZoomOut, isZoomed, onSaveAs, onClose }: PaintMenuProps) => {
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'image' | 'colors' | 'help' | null>(null)
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
            <li className={itemClass(true)} aria-disabled="true">
              Undo <span>Ctrl+Z</span>
            </li>
            <li className={itemClass(true)} aria-disabled="true">
              Redo <span>Ctrl+Y</span>
            </li>
          </ul>
        </li>

        <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
          View
          <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
            <li
              className={isZoomed ? 'checked' : ''}
              onClick={() => {
                if (isZoomed) {
                  onZoomOut()
                } else {
                  onZoomIn()
                }
                setOpenMenu(null)
              }}
            >
              Zoom In
            </li>

            <li
              className={itemClass(!isZoomed)}
              aria-disabled={!isZoomed}
              onClick={() => {
                if (!isZoomed) return
                onZoomOut()
                setOpenMenu(null)
              }}
            >
              Zoom Out
            </li>
          </ul>
        </li>

        <li className="menu-top-level is-disabled" aria-disabled="true">
          Image
        </li>

        <li className="menu-top-level is-disabled" aria-disabled="true">
          Colors
        </li>

        <li className="menu-top-level is-disabled" aria-disabled="true">
          Help
        </li>
      </ul>
    </menu>
  )
}

export default PaintMenu