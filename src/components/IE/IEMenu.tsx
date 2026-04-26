import { useState, useEffect, useRef } from 'react'
import IEModal from './AboutIE'
import menuData from '../../data/IEData'
import './IEMenu.css'

interface IEMenuProps {
    onNavigate?: (url: string) => void
    onBack?: () => void
    onForward?: () => void
    onHome?: () => void
    onClose?: () => void
    onToggleFullscreen?: () => void
    onToggleFavourites?: () => void
    onRefresh?: () => void
    onStop?: () => void
    onPrint?: () => void
    onCut?: () => void
    onCopy?: () => void
    onPaste?: () => void
}

const IEMenu = ({ 
    onNavigate,
    onBack,
    onForward,
    onHome,
    onClose,
    onToggleFullscreen,
    onToggleFavourites,
    onRefresh,
    onPrint,
    onStop,
    onCut,
    onCopy,
    onPaste
}: IEMenuProps) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [hoveredItem, setHoveredItem] = useState<number | null>(null)
    const [openModal, setOpenModal] = useState<'about' | null>(null)

    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null)
                setHoveredItem(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="ie-menubar" ref={menuRef}>
            <ul className="ie-menu-list">
                {menuData.map((menu) => (
                    <li
                        key={menu.id}
                        className={`ie-menu-item ${openMenu === menu.id ? 'is-open' : ''}`}
                    >
                        <button
                            type="button"
                            className="ie-menu-trigger"
                            onClick={() => {
                                setOpenMenu(openMenu === menu.id ? null : menu.id)
                                setHoveredItem(null)
                            }}
                        >
                            {menu.label}
                        </button>

                        {openMenu === menu.id && (
                            <ul className="ie-submenu">
                                {menu.items.map((item, i) =>
                                    item.separator ? (
                                        <li key={i} className="separator" />
                                    ) : (
                                        <li
                                            key={i}
                                            className={`ie-submenu-item ${item.disabled ? 'disabled' : ''} ${item.icon ? 'has-icon' : ''}`}
                                            onMouseEnter={() => setHoveredItem(i)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            onClick={() => {
                                                if (item.url && onNavigate) {
                                                    onNavigate(item.url)
                                                    setOpenMenu(null)
                                                    setHoveredItem(null)
                                                }
                                                if (item.action === 'back') { onBack?.(); setOpenMenu(null) }
                                                if (item.action === 'forward') { onForward?.(); setOpenMenu(null) }
                                                if (item.action === 'home') { onHome?.(); setOpenMenu(null) }
                                                if (item.action === 'close') { onClose?.(); setOpenMenu(null) }
                                                if (item.action === 'fullscreen') { onToggleFullscreen?.(); setOpenMenu(null) }
                                                if (item.action === 'favourites') { onToggleFavourites?.(); setOpenMenu(null) }
                                                if (item.action === 'refresh') { onRefresh?.(); setOpenMenu(null) }
                                                if (item.action === 'stop') { onStop?.(); setOpenMenu(null) }
                                                if (item.action === 'print') { onPrint?.(); setOpenMenu(null) }
                                                if (item.action === 'about') { setOpenModal('about'); setOpenMenu(null) }
                                                 if (item.action === 'cut') { onCut?.(); setOpenMenu(null) }
                                                if (item.action === 'copy') { onCopy?.(); setOpenMenu(null) }
                                                if (item.action === 'paste') { onPaste?.(); setOpenMenu(null) }
                                            }}
                                        >
                                            {item.icon && <img src={item.icon} alt="" className="menu-item-icon" />}
                                            <span className="ie-submenu-label">{item.label}</span>
                                            {item.shortcut && <span className="ie-submenu-shortcut">{item.shortcut}</span>}
                                            {item.arrow && <span className="ie-submenu-arrow">▸</span>}
                                            {item.checked && <span className="ie-submenu-check">✓</span>}

                                            {item.children && hoveredItem === i && (
                                                <ul className="ie-submenu--nested">
                                                    {item.children.map((child, j) => (
                                                        <li
                                                            key={j}
                                                            className={`ie-submenu-item ${child.icon ? 'has-icon' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                if (child.url && onNavigate) {
                                                                    onNavigate(child.url)
                                                                    setOpenMenu(null)
                                                                    setHoveredItem(null)
                                                                }
                                                                if (child.action === 'back') { onBack?.(); setOpenMenu(null) }
                                                                if (child.action === 'forward') { onForward?.(); setOpenMenu(null) }
                                                                if (child.action === 'home') { onHome?.(); setOpenMenu(null) }
                                                            }}
                                                        >
                                                            {child.icon && <img src={child.icon} alt="" className="menu-item-icon" />}
                                                            <span className="ie-submenu-label">{child.label}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            {openModal === 'about' && <IEModal onClose={() => setOpenModal(null)} />}
        </div>
    )
}

export default IEMenu