import { useState } from "react";
import tickSound from '../sounds/tick.mp3'
import winSound from '../sounds/win.mp3'
import loseSound from '../sounds/lose.mp3'

const useSound = () => {
    const [tick] = useState(new Audio(tickSound));
    const [win] = useState(new Audio(winSound));
    const [lose] = useState(new Audio(loseSound));

    const playSound = (sound: HTMLAudioElement) => {
        sound.currentTime = 0;
        sound.play();
    }

    return { 
        playTick: () => playSound(tick), 
        playWin: () => playSound(win), 
        playLose: () => playSound(lose) 
    };
}

export default useSound


