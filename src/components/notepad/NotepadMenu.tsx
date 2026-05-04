import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutNotepad from './AboutNotepad';
import FindReplaceModal from './FindReplaceModal';

interface NotepadMenuProps {
    windowPosition: { x: number; y: number };
    onClose: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    wordWrap: boolean;
    onToggleWordWrap: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    onOpen: () => void;
    onSave: () => void;
    onSaveAs: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const NotepadMenu = ({
    windowPosition,
    onClose,
    showStatusBar,
    onToggleStatusBar,
    wordWrap,
    onToggleWordWrap,
    textareaRef,
    onOpen,
    onSave,
    onSaveAs,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
}: NotepadMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'format' | 'view' | 'help' | null>(null);
    const [openModal, setOpenModal] = useState<'about' | 'find' | 'replace' | null>(null);

    const { playStartMenu } = useSound();
    const menuRef = useRef<HTMLMenuElement>(null);

    // Insert current date and time at cursor position
    const insertDateTime = () => {
        const el = textareaRef.current;
        if (!el) return;
        const now = new Date();
        const formatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            + ' ' + now.toLocaleDateString('en-US');
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.setRangeText(formatted, start, end, 'end');
        el.focus();
    };

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

    return (
        <menu ref={menuRef} className='notepad-menu'>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}>
                    File
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => { playStartMenu(); onOpen(); setOpenMenu(null); }}>
                            Open
                        </li>
                        <li onClick={() => { playStartMenu(); onSave(); setOpenMenu(null); }}>
                            Save
                        </li>
                        <li onClick={() => { playStartMenu(); onSaveAs(); setOpenMenu(null); }}>
                            Save As
                        </li>
                        <li onClick={() => { playStartMenu(); onClose(); }}>
                            Exit
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li
                            className={!canUndo ? 'is-disabled' : ''}
                            onClick={canUndo ? () => { playStartMenu(); onUndo(); } : undefined}
                        >
                            Undo
                        </li>
                        <li
                            className={!canRedo ? 'is-disabled' : ''}
                            onClick={canRedo ? () => { playStartMenu(); onRedo(); } : undefined}
                        >
                            Redo
                        </li>
                        <li onClick={() => { playStartMenu(); setOpenModal('find'); setOpenMenu(null); }}>
                            Find
                        </li>
                        <li onClick={() => { playStartMenu(); setOpenModal('replace'); setOpenMenu(null); }}>
                            Replace
                        </li>
                        <li onClick={() => { playStartMenu(); insertDateTime(); setOpenMenu(null); }}>
                            Date/Time
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'format' ? null : 'format')}>
                    Format
                    <ul className={`submenu ${openMenu === 'format' ? 'open' : ''}`}>
                        <li
                            className={wordWrap ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleWordWrap(); setOpenMenu(null); }}
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
                            onClick={() => { playStartMenu(); onToggleStatusBar(); setOpenMenu(null); }}
                        >
                            Status Bar
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'>Help Topics</li>
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                            About Notepad
                        </li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutNotepad onClose={() => setOpenModal(null)} style={modalStyle} />,
                document.body
            )}

            {openModal === 'find' && createPortal(
                <FindReplaceModal
                    onClose={() => setOpenModal(null)}
                    textareaRef={textareaRef}
                    mode='find'
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'replace' && createPortal(
                <FindReplaceModal
                    onClose={() => setOpenModal(null)}
                    textareaRef={textareaRef}
                    mode='replace'
                    style={modalStyle}
                />,
                document.body
            )}
        </menu>
    );
};

export default NotepadMenu;