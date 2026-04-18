import { useState, useEffect, useRef } from 'react'
import './PaintMenu.css'

interface PaintMenuProps {
  setTool: React.Dispatch<React.SetStateAction<string>>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isZoomed: boolean;
}

const PaintMenu = ({ setTool, onZoomIn, onZoomOut, isZoomed }: PaintMenuProps) => {
  const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'image' | 'colors' | 'help' | null>(null)
  const menuRef = useRef<HTMLElement>(null)

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
            <li onClick={() => { setTool('download'); setOpenMenu(null) }}>Save <span>Ctrl+S</span></li>
            <li className="separator" aria-hidden="true"></li>
            <li onClick={() => { setTool('clear'); setOpenMenu(null) }}>New <span>Ctrl+N</span></li>
          </ul>
        </li>
        <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
          Edit
          <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
            <li>Undo <span>Ctrl+Z</span></li>
            <li>Redo <span>Ctrl+Y</span></li>
          </ul>
        </li>
        <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
          View
          <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
            <li
              className={isZoomed ? 'checked' : ''}
              onClick={() => { if (isZoomed) { onZoomOut(); } else { onZoomIn(); } setOpenMenu(null); }}
            >Zoom In</li>
            <li
             onClick={onZoomOut}
            >Zoom Out</li>
          </ul>
        </li>
        <li>Image</li>
        <li>Colors</li>
        <li>Help</li>
      </ul>
    </menu>
  )
}

export default PaintMenu