import { useState } from 'react';

const useWindowState = (initialMinimized = false, initialFullscreen = false) => {
    const [isMinimized, setIsMinimized] = useState(initialMinimized);
    const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);

    const minimize = () => setIsMinimized(true);
    const restore = () => setIsMinimized(false);
    const toggleFullscreen = () => {
        setIsMinimized(false);
        restore(); 
        setIsFullscreen(prev => !prev);
    };

    const close = () => setIsMinimized(true);

    return { 
        isMinimized, 
        setIsMinimized,
        isFullscreen, 
        minimize, 
        toggleFullscreen, 
        close 
    };
};

export default useWindowState;