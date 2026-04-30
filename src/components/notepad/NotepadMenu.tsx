import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import AboutNotepad from './AboutNotepad'
import ReplaceModal from './ReplaceModal'

interface NotepadMenuProps {
    windowPosition: { x: number, y: number };
    onClose: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    wordWrap: boolean;
    onToggleWordWrap: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    onOpen: () => void;
    onSave: () => void;
    onSaveAs: () => void;
}

const NotepadMenu = ( {
    windowPosition, 
    onClose,
    showStatusBar,
    onToggleStatusBar,
    wordWrap,
    onToggleWordWrap,
    textareaRef,
    onOpen,
    onSave,
    onSaveAs
}: NotepadMenuProps) => {
    const [openMenu, setOpenMenu] = useState< 'file' | 'edit' |'format' |  'view' |  'help' | null>(null);
    const [openModal, setOpenModal] = useState<'about' | 'replace' | null>(null);


    // Date/Time
    const menuRef = useRef<HTMLMenuElement>(null)

    const insertDateTime = () => {
        const el = textareaRef.current
        if (!el) return
        const now = new Date()
        const formatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
            + ' ' + now.toLocaleDateString('en-US')
        const start = el.selectionStart
        const end = el.selectionEnd
        el.setRangeText(formatted, start, end, 'end')
        el.focus()
    }

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
                        <li onClick={onOpen}>Open</li>
                        <li onClick={onSave}>Save</li>
                        <li onClick={onSaveAs}>Save As</li>
                        <li onClick={onClose}>Exit</li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li className="is-disabled">Undo</li>
                        <li className="is-disabled">Redo</li>
                        <li className="is-disabled">Find</li>
                        <li onClick={() => { setOpenModal('replace'); setOpenMenu(null) }}>Replace</li>
                        <li onClick={insertDateTime}>Date/Time</li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}>
                    Format
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li 
                            className={wordWrap ? 'checked' : ''}
                            onClick={onToggleWordWrap}
                        >
                            Word Wrap
                        </li>
                    </ul>
                </li>
                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li 
                            className={showStatusBar ? 'checked' : ''}
                            onClick={onToggleStatusBar}

                        >Status Bar</li>
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
            {/* About Modal */}
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

                {/* Replace Modal */}
                {openModal === 'replace' && createPortal(
                    <ReplaceModal
                        onClose={() => setOpenModal(null)}
                        textareaRef={textareaRef}
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
