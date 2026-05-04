import { useState } from 'react';
import tickSound from '../sounds/tick.mp3';
import winSound from '../sounds/win.mp3';
import loseSound from '../sounds/lose.mp3';
import startApp from '../sounds/Windows XP Start.wav';
import startAppShort from '../sounds/Windows Navigation Start.wav';
import minimize from '../sounds/Windows XP Minimize.wav';
import startXP from '../sounds/Windows XP Startup.wav';
import balloon from '../sounds/Windows XP Balloon.wav';
import error from '../sounds/Windows XP Error.wav';
import criticalError from '../sounds/Windows XP Critical Stop.wav';
import startMenu from '../sounds/Windows XP Menu Command.wav';
import logOff from '../sounds/Windows XP Logoff Sound.wav';
import shutDown from '../sounds/Windows XP Shutdown.wav';

const useSound = () => {
    const [enabled, setEnabled] = useState(true);

    const playSound = (soundSrc: string) => {
        if (!enabled) return;
        const audio = new Audio(soundSrc);
        audio.play();
    };

    return {
        playTick: () => playSound(tickSound),
        playWin: () => playSound(winSound),
        playLose: () => playSound(loseSound),
        playStart: () => playSound(startApp),
        playNavStart: () => playSound(startAppShort),
        playMinimize: () => playSound(minimize),
        playStartXP: () => playSound(startXP),
        playBalloon: () => playSound(balloon),
        playError: () => playSound(error),
        playCriticalError: () => playSound(criticalError),
        playStartMenu: () => playSound(startMenu),
        playLogOff: () => playSound(logOff),
        playShutDown: () => playSound(shutDown),
        enabled,
        toggleSound: () => setEnabled(prev => !prev),
    };
};

export default useSound;