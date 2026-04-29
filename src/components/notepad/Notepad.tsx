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
}

const Notepad = ({
    onClose, 
    isMinimized, 
    setIsMinimized, 
    isFullscreen, 
    toggleFullscreen 
}: NotepadProps) => {
     const { position, handleMouseDown } = useDraggable(400, 150);

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
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                <img className='notepad-icon' src={NotepadIcon} alt="MS Notepad Icon" />
                Notepad
                </span>
                <div className='title-bar-buttons'>
                    <button
                        className='btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        type="button"
                    >
                        _
                    </button>
                    <button
                        className='btn-maximize'
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
                        className='btn-close'
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
        />
        <NotepadApp/>
    </div>
  )
}

export default Notepad
