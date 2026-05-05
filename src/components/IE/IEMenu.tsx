import { useState, useEffect, useRef } from 'react';
import AboutDialog from '../AboutDialog';
import menuData from '../../data/IEData';
import useSound from '../../hooks/useSound';
import './IEMenu.css';

interface IEMenuProps {
    onNavigate?: (url: string) => void;
    onBack?: () => void;
    onForward?: () => void;
    onHome?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    onToggleFullscreen?: () => void;
    onToggleFavourites?: () => void;
    favouritesVisible?: boolean;
    onToggleStatusBar?: () => void;
    statusBarVisible?: boolean;
    onToggleStandardToolbar?: () => void;
    onToggleAddressBar?: () => void;
    standardToolbarVisible?: boolean;
    addressBarVisible?: boolean;
    onRefresh?: () => void;
    onStop?: () => void;
    onPrint?: () => void;
    onCut?: () => void;
    onCopy?: () => void;
    onPaste?: () => void;
}

const IEMenu = ({
    onNavigate,
    onBack,
    onForward,
    onHome,
    onOpen,
    onClose,
    onToggleFullscreen,
    onToggleFavourites,
    favouritesVisible,
    onToggleStatusBar,
    statusBarVisible,
    onToggleAddressBar,
    onToggleStandardToolbar,
    addressBarVisible,
    standardToolbarVisible,
    onRefresh,
    onPrint,
    onStop,
    onCut,
    onCopy,
    onPaste,
}: IEMenuProps) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState<'about' | null>(null);

    const { playStartMenu } = useSound();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
                setHoveredItem(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeMenu = () => {
        setOpenMenu(null);
        setHoveredItem(null);
    };

    const handleItemClick = (action?: string, url?: string) => {
        playStartMenu();
        if (url && onNavigate) { onNavigate(url); closeMenu(); return; }
        switch (action) {
            case 'back':             onBack?.();              break;
            case 'forward':          onForward?.();           break;
            case 'home':             onHome?.();              break;
            case 'open':             onOpen?.();              break;
            case 'close':            onClose?.();             break;
            case 'statusbar':        onToggleStatusBar?.();   break;
            case 'fullscreen':       onToggleFullscreen?.();  break;
            case 'favourites':       onToggleFavourites?.();  break;
            case 'refresh':          onRefresh?.();           break;
            case 'stop':             onStop?.();              break;
            case 'print':            onPrint?.();             break;
            case 'cut':              onCut?.();               break;
            case 'copy':             onCopy?.();              break;
            case 'paste':            onPaste?.();             break;
            case 'about':            setOpenModal('about');   break;
            case 'toolbar-standard': onToggleStandardToolbar?.(); break;
            case 'toolbar-address':  onToggleAddressBar?.();  break;
        }
        setOpenMenu(null);
    };

    return (
        <div className='ie-menubar' ref={menuRef}>
            <ul className='ie-menu-list'>
                {menuData.map((menu) => (
                    <li
                        key={menu.id}
                        className={`ie-menu-item ${openMenu === menu.id ? 'is-open' : ''}`}
                    >
                        <button
                            type='button'
                            className='ie-menu-trigger'
                            onClick={() => {
                                setOpenMenu(openMenu === menu.id ? null : menu.id);
                                setHoveredItem(null);
                            }}
                        >
                            {menu.label}
                        </button>

                        {openMenu === menu.id && (
                            <ul className='ie-submenu'>
                                {menu.items.map((item, i) =>
                                    item.separator ? (
                                        <li key={i} className='separator' id='separator' />
                                    ) : (
                                        <li
                                            key={i}
                                            className={[
                                                'ie-submenu-item',
                                                item.disabled ? 'disabled' : '',
                                                item.icon ? 'has-icon' : '',
                                                item.action === 'statusbar' && statusBarVisible ? 'checked' : '',
                                                item.action === 'favourites' && favouritesVisible ? 'checked' : '',
                                            ].filter(Boolean).join(' ')}
                                            onMouseEnter={() => setHoveredItem(i)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            onClick={() => handleItemClick(item.action, item.url)}
                                        >
                                            {item.icon && (
                                                <img
                                                    src={item.icon}
                                                    alt=''
                                                    className='menu-item-icon'
                                                />
                                            )}
                                            <span className='ie-submenu-label'>{item.label}</span>
                                            {item.shortcut && <span className='ie-submenu-shortcut'>{item.shortcut}</span>}
                                            {item.arrow && <span className='ie-submenu-arrow'>▸</span>}
                                            {item.checked && <span className='ie-submenu-check'>✓</span>}

                                            {item.children && hoveredItem === i && (
                                                <ul className='ie-submenu--nested'>
                                                    {item.children.map((child, j) =>
                                                        child.separator ? (
                                                            <li key={j} className='separator' />
                                                        ) : (
                                                            <li
                                                                key={j}
                                                                className={[
                                                                    'ie-submenu-item',
                                                                    child.disabled ? 'disabled' : '',
                                                                    child.action === 'toolbar-standard' && standardToolbarVisible ? 'checked' : '',
                                                                    child.action === 'toolbar-address' && addressBarVisible ? 'checked' : '',
                                                                    child.action === 'favourites' && favouritesVisible ? 'checked' : '',
                                                                ].filter(Boolean).join(' ')}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleItemClick(child.action, child.url);
                                                                }}
                                                            >
                                                                {child.icon && (
                                                                    <img
                                                                        src={child.icon}
                                                                        alt=''
                                                                        className='menu-item-icon'
                                                                    />
                                                                )}
                                                                <span className='ie-submenu-label'>{child.label}</span>
                                                            </li>
                                                        )
                                                    )}
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
            {openModal === 'about' && (
                <AboutDialog
                    title='Internet Explorer'
                    onClose={() => setOpenModal(null)}
                />
            )}
        </div>
    );
};

export default IEMenu;