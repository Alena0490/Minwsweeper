import { useState } from "react";
import tickSound from '../sounds/tick.mp3'
import winSound from '../sounds/win.mp3'
import loseSound from '../sounds/lose.mp3'
import startApp from '../sounds/Windows XP Start.wav'
import stratAppShort from '../sounds/Windows Navigation Start.wav'
import minimize from '../sounds/Windows XP Minimize.wav'
import startXP from '../sounds/Windows XP Startup.wav'

const useSound = () => {
    const [enabled, setEnabled] = useState(true);

    const playSound = (soundSrc: string) => {
        if (!enabled) return;
        const audio = new Audio(soundSrc);
        audio.play();
    }

    return { 
        playTick: () => playSound(tickSound), 
        playWin: () => playSound(winSound), 
        playLose: () => playSound(loseSound),
        playStart: () => playSound(startApp),
        playNavStart: () => playSound(stratAppShort),
        playMinimize: () => playSound(minimize),
        playStartXP: () => playSound(startXP),
        enabled,
        toggleSound: () => setEnabled(prev => !prev),
    };
}

export default useSound


