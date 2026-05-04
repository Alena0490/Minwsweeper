import { useRef, useCallback } from 'react';

export const usePaintHistory = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    ctxRef: React.RefObject<CanvasRenderingContext2D | null>
) => {
    const historyRef = useRef<string[]>([]);
    const redoRef = useRef<string[]>([]);

    // Save current canvas state to history
    const snapshot = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        try {
            historyRef.current.push(canvas.toDataURL('image/png'));
            redoRef.current = [];
        } catch (err) {
            console.warn('Failed to save snapshot:', err);
        }
    }, [canvasRef]);

    // Restore canvas from a data URL
    const restoreFrom = useCallback((url: string) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx || !url) return;
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = url;
    }, [canvasRef, ctxRef]);

    const undo = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || historyRef.current.length === 0) return;
        redoRef.current.push(canvas.toDataURL('image/png'));
        restoreFrom(historyRef.current.pop()!);
    }, [canvasRef, restoreFrom]);

    const redo = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || redoRef.current.length === 0) return;
        historyRef.current.push(canvas.toDataURL('image/png'));
        restoreFrom(redoRef.current.pop()!);
    }, [canvasRef, restoreFrom]);

    return { snapshot, undo, redo };
};