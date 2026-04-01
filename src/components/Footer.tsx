import { useState, useEffect } from 'react';
import './Footer.css'
import windowsLogo from '../img/logo.png'

interface FooterProps {
    handleFullscreen : () => void;
}

const Footer = ({ handleFullscreen }: FooterProps) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer); // cleanup on unmount
    }, []);

    return (
        <footer>
        <div className="left-menu">
            <div className="start" onClick={handleFullscreen}>
                <img src={windowsLogo} alt='Windows XP Logo' />
                <span>Start</span>
            </div>
            <div className="game-bar"></div>
        </div>
        <div className="time">
            {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
        </footer>
    )
}

export default Footer
