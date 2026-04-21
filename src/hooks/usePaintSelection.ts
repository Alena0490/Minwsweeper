import { useRef, useEffect } from "react";

interface SelectionParams {
  tool: string;
  bgColor: string;
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>;
  selection: { x: number; y: number; w: number; h: number } | null;
  setSelection: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number } | null>>;
  selectionData: ImageData | null;
  setSelectionData: React.Dispatch<React.SetStateAction<ImageData | null>>;
  snapshot: () => void;
}

export const usePaintSelection = ({
  tool,
  bgColor,
  ctxRef,
  selection,
  setSelection,
  selectionData,
  setSelectionData,
  snapshot,
}: SelectionParams) => {
  const selStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingSelectionRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const cleanCanvasRef = useRef<ImageData | null>(null);
  const freeSelectPathRef = useRef<{ x: number; y: number }[]>([]);
  const freeSelectClipPathRef = useRef<{ x: number; y: number }[]>([]);

  /* ── Keyboard actions ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((tool !== 'rectselect' && tool !== 'freeselect') || !selection || !selectionData) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      if (e.key === 'Delete') {
        snapshot();
        ctx.fillStyle = bgColor;
        ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
        setSelection(null);
        setSelectionData(null);
      }

      if (e.key === 'c' && e.ctrlKey) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = selection.w;
        tempCanvas.height = selection.h;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(selectionData, 0, 0);
        tempCanvas.toBlob((blob) => {
          if (!blob) return;
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        });
      }

      if (e.key === 'x' && e.ctrlKey) {
        snapshot();
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = selection.w;
        tempCanvas.height = selection.h;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(selectionData, 0, 0);
        tempCanvas.toBlob((blob) => {
          if (!blob) return;
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        });
        ctx.fillStyle = bgColor;
        ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
        setSelection(null);
        setSelectionData(null);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tool, selection, selectionData, bgColor, ctxRef, snapshot, setSelection, setSelectionData]);

  return {
    selStartRef,
    isDraggingSelectionRef,
    dragOffsetRef,
    cleanCanvasRef,
    freeSelectPathRef,
    freeSelectClipPathRef,
  };
};