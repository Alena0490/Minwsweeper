import { useDraggableDialog } from '../hooks/useDraggableDialog';
import './minesweeper/GameMiniModal.css'
import './ModalStyle.css';

interface AboutDialogProps {
    onClose: () => void;
    style?: React.CSSProperties;
    title: string;
}

const ABOUT_DATA: Record<string, { description: string }> = {
    'Calculator': {
        description: 'A two-mode calculator with standard and scientific functions. Supports keyboard input, memory operations (MC, MR, MS, M+), and number bases — Hex, Dec, Oct and Bin.',
    },
    'Notepad': {
        description: 'A lightweight text editor with a custom undo/redo history stack, Find & Replace, Word Wrap, Date/Time insert, and open/save support for .txt files.',
    },
    'Paint': {
        description: 'A feature-rich recreation of MS Paint with 16 drawing tools, a 40-colour XP palette, selection tools, text with font toolbar, shapes, image editing and Save As .png.',
    },
    'Internet Explorer': {
        description: 'A working browser window powered by iframe, styled as Internet Explorer 6. Features a full menu bar, navigation history, retro Favourites from the Wayback Machine, and a blocked domains list.',
    },
    'Minesweeper': {
        description: 'The classic Minesweeper with Beginner, Intermediate and Expert difficulty, custom board size, best times saved per difficulty, safe first click, and flag and question mark markers.',
    },
};

const AboutDialog = ({ onClose, style, title }: AboutDialogProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();
    const data = ABOUT_DATA[title];

    return (
        <div
            id='about'
            className='xp-dialog'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar'>
                <div className='title-bar-text'>About {title}</div>
                <div className='title-bar-buttons'>
                    <button
                        type='button'
                        className='btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        &#215;
                    </button>
                </div>
            </div>
            <div className='xp-dialog-body'>
                <div className='info'>
                    <p>Version 1.0</p>
                    <p>Copyright Alena Pumprová 2026</p>
                </div>
                {data && (
                    <p>{data.description}</p>
                )}
                    <a
                    href='https://alena-pumprova.cz/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    About me
                </a>
                <button
                    type='button'
                    onClick={onClose}
                    autoFocus
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default AboutDialog;