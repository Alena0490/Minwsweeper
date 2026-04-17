import { useState, useEffect, useRef } from 'react'
import menuData from '../../data/menuData'
import './IEMenu.css'

const IEMenu = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

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
                            onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
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
                                        >
                                            {item.icon && <img src={item.icon} alt="" className="menu-item-icon" />}
                                            <span className="ie-submenu-label">{item.label}</span>
                                            {item.shortcut && (
                                                <span className="ie-submenu-shortcut">{item.shortcut}</span>
                                            )}
                                            {item.arrow && (
                                                <span className="ie-submenu-arrow">▸</span>
                                            )}
                                            {item.checked && <span className="ie-submenu-check">✓</span>}
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default IEMenu