import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import AboutNotepad from './AboutNotepad'

interface NotepadMenuProps {
    windowPosition: { x: number, y: number };
    onClose: () => void;
}

const NotepadMenu = ( {windowPosition, onClose }: NotepadMenuProps) => {
    const [openMenu, setOpenMenu] = useState< 'file' | 'edit' |'format' |  'view' |  'help' | null>(null);
    const [openModal, setOpenModal] = useState<'about' | null>(null);

    const menuRef = useRef<HTMLElement>(null);

       useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);


    return (
        <menu ref={menuRef} className="notepad-menu">
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}>
                    File
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li className="is-disabled">Open</li>
                        <li className="is-disabled">Save</li>
                        <li className="is-disabled">Save As</li>
                        <li onClick={onClose}>Exit</li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li className="is-disabled">Undo</li>
                        <li className="is-disabled">Redo</li>
                        <li className="is-disabled">Find</li>
                        <li className="is-disabled">Replace</li>
                        <li className="is-disabled">Date/Time</li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}>
                    Format
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li className="is-disabled">Word Wrap</li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className="is-disabled">Status Bar</li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className="is-disabled">Help Topics</li>
                        <li 
                            onClick={() => { setOpenModal('about'); setOpenMenu(null) }}
                        >About Notepad</li>
                    </ul>
                </li>
            </ul>
                {openModal === 'about' && createPortal(
                    <AboutNotepad 
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

export default NotepadMenu
