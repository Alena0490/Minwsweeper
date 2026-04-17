import { useState, useEffect, useRef } from 'react';
import useSound from '../hooks/useSound'
import MenuModal from './MenuModal';
import './Footer.css'
import windowsLogo from '../img/logo.webp'
import InternetShortcut from '../img/InternetShortcut.webp'
import IEIcon from '../img/InternetExplorer6.webp'
import PaintIcon from '../img/Paint.webp'
import volume from '../img/Volume.webp'
import gameIcon from '../img/minesweeperIcon.webp'
import securityError from '../img/SecurityError.webp'

interface FooterProps {
    handleFullscreen: () => void;
    onIEOpen: () => void;
    onPaintOpen: () => void; 
    minesweeperMinimized: boolean;
    setMinesweeperMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    ieMinimized: boolean;
    setIeMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isIEOpen: boolean;
    isPaintOpen: boolean;
    paintMinimized: boolean; 
    setPaintMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const Footer = ({ 
    handleFullscreen, 
    onIEOpen, 
    onPaintOpen,  
    minesweeperMinimized, 
    setMinesweeperMinimized, 
    ieMinimized, 
    setIeMinimized, 
    isIEOpen,
    isPaintOpen,
    paintMinimized,
    setPaintMinimized,  
}: FooterProps) => {
    const [time, setTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // XP Sounds
    const { playStart, playMinimize } = useSound();

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
                        className={`start-menu ${isMenuOpen ? 'open' : ''}`} 
                        onIEOpen={onIEOpen}
                        onPaintOpen={onPaintOpen}
                    />
                    <img src={windowsLogo} alt='Windows XP Logo' />
                    <span>Start</span>
                </div>
                <div className="menu-item">
                    <img src={InternetShortcut} alt="Internet Shortcut Icon" />
                </div>
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
            </div>
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
