import { useEffect, useRef } from 'react';

export const usePaintPanning = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    pan: { x: number; y: number },
    setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    setZoom: React.Dispatch<React.SetStateAction<number>>
) => {
    const isPanningRef = useRef(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    // Touch pinch-to-zoom
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const initialDistanceRef = { current: 0 };
        const initialZoomRef = { current: 1 };

        const getDistance = (t1: Touch, t2: Touch) =>
            Math.sqrt((t2.clientX - t1.clientX) ** 2 + (t2.clientY - t1.clientY) ** 2);

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                initialDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
                setZoom((z) => { initialZoomRef.current = z; return z; });
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const scale = getDistance(e.touches[0], e.touches[1]) / initialDistanceRef.current;
                setZoom(+Math.min(4, Math.max(0.25, initialZoomRef.current * scale)).toFixed(3));
            }
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
        };
    }, [canvasRef, setZoom]);

    // Middle mouse button panning
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handlePanStart = (e: MouseEvent) => {
            if (e.button === 1) {
                e.preventDefault();
                isPanningRef.current = true;
                panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            }
        };

        const handlePanMove = (e: MouseEvent | TouchEvent) => {
            if (!isPanningRef.current) return;
            e.preventDefault();
            const te = e as TouchEvent;
            const me = e as MouseEvent;
            const clientX = te.touches?.[0]?.clientX ?? me.clientX;
            const clientY = te.touches?.[0]?.clientY ?? me.clientY;
            setPan({ x: clientX - panStartRef.current.x, y: clientY - panStartRef.current.y });
        };

        const handlePanEnd = () => { isPanningRef.current = false; };

        canvas.addEventListener('mousedown', handlePanStart);
        window.addEventListener('mousemove', handlePanMove);
        window.addEventListener('mouseup', handlePanEnd);
        window.addEventListener('touchmove', handlePanMove, { passive: false });
        window.addEventListener('touchend', handlePanEnd);

        return () => {
            canvas.removeEventListener('mousedown', handlePanStart);
            window.removeEventListener('mousemove', handlePanMove);
            window.removeEventListener('mouseup', handlePanEnd);
            window.removeEventListener('touchmove', handlePanMove);
            window.removeEventListener('touchend', handlePanEnd);
        };
    }, [pan, setPan, canvasRef]);

    return { isPanningRef, panStartRef };
};