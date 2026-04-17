import { useState } from "react";
import tickSound from '../sounds/tick.mp3'
import winSound from '../sounds/win.mp3'
import loseSound from '../sounds/lose.mp3'

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
        enabled,
        toggleSound: () => setEnabled(prev => !prev),
    };
}

export default useSound


