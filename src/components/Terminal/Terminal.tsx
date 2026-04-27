// import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import TerminalWindow from './TerminalWindow';
import TerminalIcon from '../../img/CommandPrompt.webp'
import '../../App.css'
import './Terminal.css'

interface TerminalProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    apps: string[];
}

const Terminal = ({
    onClose, 
    isMinimized, 
    setIsMinimized, 
    isFullscreen, 
    toggleFullscreen,
    apps
}: TerminalProps) => {

    const { position, handleMouseDown } = useDraggable(400, 150);

  return (
    <div
    className={[
        'app-window',
        'terminal-window',
        isMinimized && 'terminal--minimized', 
        isMinimized && 'app-window--minimized',
        isFullscreen && 'terminal--fullscreen',
        isFullscreen && 'app-window--fullscreen',
    ].filter(Boolean).join(' ')}
    style={isFullscreen ? {} : { left: position.x, top: position.y }}
    >
         <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>
                <img className='paint-icon' src={TerminalIcon} alt="MS Windows Terminal Icon" />
                C:\WINDOWS\system32\cmd.exe
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
        <TerminalWindow 
            onClose={onClose} 
            apps={apps} 
        />
    </div>
  )
}

export default Terminal