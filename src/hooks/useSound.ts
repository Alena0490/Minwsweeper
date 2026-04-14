import { useState } from "react";
import tickSound from '../sounds/tick.mp3'
import winSound from '../sounds/win.mp3'
import loseSound from '../sounds/lose.mp3'

const useSound = () => {
    const [enabled, setEnabled] = useState(true);
    const [tick] = useState(() => {
        const audio = new Audio(tickSound);
        audio.preload = 'auto';
        return audio;
    });
    const [win] = useState(new Audio(winSound));
    const [lose] = useState(new Audio(loseSound));

    const playSound = (sound: HTMLAudioElement) => {
        if (!enabled) return;
        sound.currentTime = 0;
        sound.play();
    }

    return { 
        playTick: () => playSound(tick), 
        playWin: () => playSound(win), 
        playLose: () => playSound(lose),
        enabled,
        toggleSound: () => setEnabled(prev => !prev),
    };
}

export default useSound


