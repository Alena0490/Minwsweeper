import { useState, useRef } from 'react'
import useDraggable from '../../hooks/useDraggable';
import NotepadMenu from './NotepadMenu';
import NotepadApp from './NotepadApp'
import NotepadIcon from '../../img/Notepad.webp'
import './Notepad.css'
import '../../App.css'

interface NotepadProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void
}

const Notepad = ({
    onClose, 
    isMinimized, 
    setIsMinimized, 
    isFullscreen, 
    toggleFullscreen,
    onMouseDown
}: NotepadProps) => {
    const { position, handleMouseDown } = useDraggable(400, 150);
    const [showStatusBar, setShowStatusBar] = useState(true);
    const [wordWrap, setWordWrap] = useState(false);
    const [saveAsOpen, setSaveAsOpen] = useState(false);
    const [fileName, setFileName] = useState('Untitled.txt');
    const [savedName, setSavedName] = useState<string | null>(null)


    // const fileHandle = useRef<FileSystemFileHandle | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSaveFromMenu = () => {
        if (savedName) {
            const text = textareaRef.current?.value ?? ''
            const blob = new Blob([text], { type: 'text/plain' })
            const a = document.createElement('a')
            a.download = savedName
            a.href = URL.createObjectURL(blob)
            a.click()
            URL.revokeObjectURL(a.href)
        } else {
            setSaveAsOpen(true)
        }
    }
 
    return (
        <div
            className={[
                'app-window',
                'notepad-window',
                isMinimized && 'notepad--minimized', 
                isMinimized && 'app-window--minimized',
                isFullscreen && 'notepad--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                    <img className='notepad-icon' src={NotepadIcon} alt="MS Notepad Icon" />
                    {fileName.replace('.txt', '')} - Notepad
                </span>
                <div className="title-bar-buttons xp-title-controls">
                    <button
                        className="xp-title-control btn-minimize"
                        onClick={() => setIsMinimized(true)}
                        type="button"
                        aria-label="Minimize"
                    >
                        _
                    </button>
                    <button
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={() => {
                            setIsMinimized(false);
                            toggleFullscreen();
                        }}
                        type="button"
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>
                    <button
                        className="xp-title-control btn-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>
            <NotepadMenu
                windowPosition={position}
                onClose={onClose}
                showStatusBar={showStatusBar}
                onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                wordWrap={wordWrap}
                onToggleWordWrap={() => setWordWrap(prev => !prev)}
                textareaRef={textareaRef}
                onSave={handleSaveFromMenu}
                onSaveAs={() => setSaveAsOpen(true)}
            />
            <NotepadApp
                showStatusBar={showStatusBar}
                wordWrap={wordWrap}
                textareaRef={textareaRef}
                saveAsOpen={saveAsOpen}
                setSaveAsOpen={setSaveAsOpen}
                fileName={fileName}
                setFileName={setFileName}
                onSaved={(name) => {
                    setFileName(name)
                    setSavedName(name)
                }}
            />
        </div>
    )
}

export default Notepad