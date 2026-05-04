import { useEffect, useRef, useState } from 'react';

type Position = {
    left: number;
    top: number;
};

type DragState = {
    startX: number;
    startY: number;
    originLeft: number;
    originTop: number;
    dragging: boolean;
};

interface UseDraggableDialogOptions {
    initialPosition?: Position;
    autofocus?: boolean;
}

export const useDraggableDialog = (options: UseDraggableDialogOptions = {}) => {
    const { initialPosition, autofocus = true } = options;

    const dialogRef = useRef<HTMLDivElement>(null);
    const dragStateRef = useRef<DragState | null>(null);

    const [position, setPosition] = useState<Position | null>(
        initialPosition ?? null
    );

    useEffect(() => {
        if (autofocus) {
            dialogRef.current?.focus();
        }
    }, [autofocus]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const dragState = dragStateRef.current;
            if (!dragState?.dragging) return;

            const nextLeft = dragState.originLeft + (event.clientX - dragState.startX);
            const nextTop = dragState.originTop + (event.clientY - dragState.startY);

            setPosition({
                left: nextLeft,
                top: nextTop,
            });
        };

        const handleMouseUp = () => {
            if (dragStateRef.current) {
                dragStateRef.current.dragging = false;
            }
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, []);

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        if (!target.closest('.title-bar')) return;
        if (target.closest('button, input, select, textarea, label')) return;

        const dialog = dialogRef.current;
        if (!dialog) return;

        const rect = dialog.getBoundingClientRect();
        const originLeft = position ? position.left : rect.left;
        const originTop = position ? position.top : rect.top;

        dragStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            originLeft,
            originTop,
            dragging: true,
        };

        document.body.style.userSelect = 'none';
        dialog.focus();
    };

    const draggableStyle: React.CSSProperties = position
        ? {
            left: `${position.left}px`,
            top: `${position.top}px`,
            transform: 'none',
        }
        : {};

    return {
        dialogRef,
        onMouseDown,
        draggableStyle,
    };
};