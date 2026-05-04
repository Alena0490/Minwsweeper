import { useState, useEffect, useCallback } from 'react';
import useSound from './useSound';

export const usePaintFileActions = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
    snapshot: () => void,
    onStatusChange: (message: string) => void,
    saveAsOpen: boolean,
    setSaveAsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const [fileName, setFileName] = useState('drawing.png');
    const { playNavStart, playMinimize } = useSound();

    // Save the canvas as a PNG file with the current filename
    const handleSaveAsConfirm = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const safeName = fileName.trim() || 'drawing.png';
        const finalName = safeName.toLowerCase().endsWith('.png') ? safeName : `${safeName}.png`;
        playNavStart();
        const a = document.createElement('a');
        a.download = finalName;
        a.href = canvas.toDataURL('image/png');
        a.click();
        setSaveAsOpen(false);
    }, [canvasRef, fileName, setSaveAsOpen, playNavStart]);

    // Open an image file and draw it onto the canvas
    const handleOpenFile = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target?.result;
                if (typeof result !== 'string') return;
                const img = new Image();
                img.onload = () => {
                    snapshot();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    onStatusChange('Image opened');
                };
                img.onerror = () => onStatusChange('Failed to open image');
                img.src = result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }, [canvasRef, ctxRef, snapshot, onStatusChange]);

    // Keyboard shortcuts for Save As dialog
    useEffect(() => {
        if (!saveAsOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter') { e.preventDefault(); handleSaveAsConfirm(); }
            if (e.key === 'Escape') { e.preventDefault(); setSaveAsOpen(false); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [saveAsOpen, handleSaveAsConfirm, setSaveAsOpen]);

    return {
        fileName,
        setFileName,
        playMinimize,
        handleSaveAsConfirm,
        handleOpenFile,
    };
};