import { useState, useEffect, useRef } from 'react';
import type { ErrorType } from './CriticalError'
import useSound from '../hooks/useSound'
import MenuModal from './StartMenu';
import ErrorBubble from './ErrorBubble';
import './Footer.css'

import windowsLogo from '../img/logo.webp'
import InternetShortcut from '../img/InternetShortcut.webp'
import IEIcon from '../img/InternetExplorer6.webp'
import PaintIcon from '../img/Paint.webp'
import CalculatorIcon from '../img/Calculator.webp'
import TerminalIcon from '../img/CommandPrompt.webp'
import NotepadIcon from '../img/Notepad.webp'
import volume from '../img/Volume.webp'
import gameIcon from '../img/minesweeperIcon.webp'
import securityError from '../img/SecurityError.webp'

interface FooterProps {
    handleFullscreen: () => void;
    onAppUnavailable: (type: ErrorType) => void;
    onIEOpen: () => void;
    onPaintOpen: () => void; 
    onMinesweeperOpen: () => void;
    onCalculatorOpen: () => void;
    onTerminalOpen: () => void;
    onNotepadOpen: () => void;
   
    isIEOpen: boolean;
    isPaintOpen: boolean;
    isMinesweeperOpen: boolean;
    isCalculatorOpen: boolean;
    isTerminalOpen: boolean;
    isNotepadOpen: boolean;

    ieMinimized: boolean;
    paintMinimized: boolean; 
    minesweeperMinimized: boolean;
    calculatorMinimized: boolean;
    terminalMinimized:boolean;
    notepadMinimized:boolean;
    
    setIeMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    setPaintMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    setMinesweeperMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;  
    setCalculatorMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    setTerminalMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    setNotepadMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;

    onLogOff: () => void;
    onTurnOff: () => void;
}

const Footer = ({ 
    handleFullscreen, 
    onAppUnavailable, 

    onIEOpen, 
    onPaintOpen,
    onMinesweeperOpen, 
    onCalculatorOpen,
    onTerminalOpen, 
    onNotepadOpen,

    ieMinimized, 
    paintMinimized,
    minesweeperMinimized, 
    calculatorMinimized,
    terminalMinimized,
    notepadMinimized,

    setIeMinimized, 
    setPaintMinimized, 
    setMinesweeperMinimized, 
    setCalculatorMinimized,
    setTerminalMinimized,
    setNotepadMinimized,
    
    isIEOpen,
    isPaintOpen,
    isMinesweeperOpen,
    isCalculatorOpen,
    isTerminalOpen,
    isNotepadOpen,
    
    onLogOff,
    onTurnOff
}: FooterProps) => {
    const [time, setTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(false);

    // XP Sounds
    const { playStart, playMinimize, playBalloon } = useSound();

    // Closing the start menu on outside click
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer); // cleanup on unmount
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            playBalloon(); 
            setShowBubble(true);
        }, 5000);

        const hideTimer = setTimeout(() => {
            setShowBubble(false);
        }, 15000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <footer>
            <div className="left-menu">
                <div 
                    className="start"
                    ref={menuRef} 
                    onClick={() => {
                        const nextState = !isMenuOpen;
                        setIsMenuOpen(nextState);
                        if (nextState) playStart();
                    }}
                    onDoubleClick={handleFullscreen}
                >
                    <MenuModal 
                        key={isMenuOpen ? 'open' : 'closed'}
                        className={`start-menu ${isMenuOpen ? 'open' : ''}`} 
                        onIEOpen={onIEOpen}
                        onPaintOpen={onPaintOpen}
                        onCalculatorOpen={onCalculatorOpen}
                        onMinesweeperOpen={onMinesweeperOpen}
                        onTerminalOpen={onTerminalOpen}
                        onNotepadOpen={onNotepadOpen}
                        onAppUnavailable={onAppUnavailable}
                        onLogOff={onLogOff}
                        onTurnOff={onTurnOff}
                    />
                    <img src={windowsLogo} alt='Windows XP Logo' />
                    <span>Start</span>
                </div>
                <div className="menu-item">
                    <img src={InternetShortcut} alt="Internet Shortcut Icon" />
                </div>

                {isMinesweeperOpen && (
                    <div 
                        className={`game-bar taskbar-item ${!minesweeperMinimized ? 'taskbar-item--active' : ''}`}
                        onClick={() => {
                            if (minesweeperMinimized) {
                                playStart(); 
                            } else {
                                playMinimize();
                            }
                            setMinesweeperMinimized(prev => !prev);
                        }}
                    >
                        <img src={gameIcon} alt="Game Icon" />
                        <span>Minesweeper</span>
                    </div>
                )}
                
                {isIEOpen && (
                        <div 
                            className={`game-bar taskbar-item ${!ieMinimized ? 'taskbar-item--active' : ''}`}
                            onClick={() => {
                                if (ieMinimized) {
                                    playStart();
                                } else {
                                    playMinimize();
                                }
                                setIeMinimized(prev => !prev);
                            }}
                        >
                        <img src={IEIcon} alt="IE Icon" />
                        <span>Internet Explorer</span>
                    </div>
                )}

                 {isPaintOpen && (
                    <div 
                        className={`paint-bar taskbar-item ${!paintMinimized ? 'taskbar-item--active' : ''}`}
                        onClick={() => {
                            if (paintMinimized) {
                                playStart();
                            } else {
                                playMinimize();
                            }
                            setPaintMinimized(prev => !prev);
                        }}
                        >
                        <img src={PaintIcon} alt="Paint Icon" />
                        <span>untitled - Paint</span>
                    </div>
                 )}

                 {isCalculatorOpen && (
                    <div 
                        className={`taskbar-item ${!calculatorMinimized ? 'taskbar-item--active' : ''}`}
                        onClick={() => {
                        if (calculatorMinimized) playStart();
                        else playMinimize();
                        setCalculatorMinimized(prev => !prev);
                        }}
                    >
                        <img src={CalculatorIcon} alt="Calculator Icon" />
                        <span>Calculator</span>
                    </div>
                    )}

                     {isTerminalOpen && (
                        <div 
                            className={`taskbar-item ${!terminalMinimized ? 'taskbar-item--active' : ''}`}
                            onClick={() => {
                            if (terminalMinimized) playStart();
                            else playMinimize();
                            setTerminalMinimized(prev => !prev);
                            }}
                        >
                            <img src={TerminalIcon} alt="Windows Command Prompt Icon" />
                            <span>C:\WINDOWS\system32\cmd.exe</span>
                        </div>
                    )}

                    {isNotepadOpen && (
                        <div
                            className={`taskbar-item ${!notepadMinimized ? 'taskbar-item--active' : ''}`}
                            onClick={() => {
                                if (notepadMinimized) playStart();
                                else playMinimize();
                                setNotepadMinimized(prev => !prev);
                            }}
                        >
                            <img src={NotepadIcon} alt="Notepad Icon" />
                            <span>Untitled - Notepad</span>
                        </div>
                    )}

            </div>
            {showBubble && (
                <ErrorBubble 
                    onClose={() => setShowBubble(false)}
                />
            )}
            <div className="right-panel taskbar-item">
                <img src={securityError} alt="Security Error Icon" />
                <img src={volume} alt="Volume Icon" />
                <div className="time">
                    {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
