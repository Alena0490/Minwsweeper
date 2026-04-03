import { useState, useEffect } from 'react';
import MenuModal from './MenuModal';
import './Footer.css'
import windowsLogo from '../img/logo.webp'
import InternetShortcut from '../img/InternetShortcut.webp'
import volume from '../img/Volume.webp'
import gameIcon from '../img/minesweeperIcon.webp'
import securityError from '../img/SecurityError.webp'

interface FooterProps {
    handleFullscreen : () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const Footer = ({ handleFullscreen, isMinimized, setIsMinimized }: FooterProps) => {
    const [time, setTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer); // cleanup on unmount
    }, []);

    return (
        <footer>
        <div className="left-menu">
            <div className="start" 
                onClick={() => setIsMenuOpen(prev => !prev)}
                onDoubleClick={handleFullscreen}
            >
                <MenuModal className={`start-menu ${isMenuOpen ? 'open' : ''}`} />
                <img src={windowsLogo} alt='Windows XP Logo' />
                <span>Start</span>
            </div>
            <div className="menu-item">
                <img src={InternetShortcut} alt="Internet Shortcut Icon" />
            </div>
            <div 
                className={`game-bar taskbar-item ${!isMinimized ? 'taskbar-item--active' : ''}`}
                onClick={() => setIsMinimized(prev => !prev)}
            >
                <img src={gameIcon} alt="Game Icon" />
                <span>Minesweeper</span>
            </div>
        </div>
        <div className="right-panel taskbar-item">
            <img src={securityError} alt="Security Error Icon" />
            <img src={volume} alt="Volume Icon" />
            <div className="time">
                {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
        </div>
        </footer>
    )
}

export default Footer
