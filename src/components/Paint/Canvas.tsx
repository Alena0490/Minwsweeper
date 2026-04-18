import { useState, useEffect, useRef, useCallback } from "react";
import "./Canvas.css";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>;
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  endDrawing: (e?: React.MouseEvent | React.TouchEvent) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  lineWidth: number;
  lineOpacity: number;
  tool: string;
  setTool: (tool: string) => void;
  floodFill: (ctx: CanvasRenderingContext2D, x: number, y: number, fillRGBA: number[], tolerance?: number) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const Canvas = ({ 
  canvasRef, startDrawing, draw, endDrawing, ctxRef, 
  tool, lineColor, lineWidth, lineOpacity, setLineColor, 
  setTool, zoom, setZoom, floodFill, pan, setPan   
}: CanvasProps) => {

  /* ── State ── */
  const [gradStart, setGradStart] = useState<{x: number, y: number} | null>(null);

  /* ── Refs ── */
  const historyRef = useRef<string[]>([]);
  const redoRef = useRef<string[]>([]);
  const previewRef = useRef<ImageData | null>(null);
  const lineStartRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  /* ── Helpers ── */
  const hexToRgb = (hex: string) => {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  };

  const getCanvasXY = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const baseWidth = rect.width / zoom;
    const baseHeight = rect.height / zoom;
    const scaleX = canvas.width / baseWidth;
    const scaleY = canvas.height / baseHeight;
    const te = e as TouchEvent;
    const me = e as MouseEvent;
    const clientX = te.touches?.[0]?.clientX ?? te.changedTouches?.[0]?.clientX ?? me.clientX;
    const clientY = te.touches?.[0]?.clientY ?? te.changedTouches?.[0]?.clientY ?? me.clientY;
    return {
      x: Math.floor(((clientX - rect.left) / zoom) * scaleX),
      y: Math.floor(((clientY - rect.top) / zoom) * scaleY),
    };
  };

  /* ── History ── */
  const snapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const url = canvas.toDataURL("image/png");
      historyRef.current.push(url);
      redoRef.current = [];
    } catch (err) {
      console.warn("Failed to save snapshot:", err);
    }
  }, [canvasRef]);

  const restoreFrom = useCallback((url: string) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !url) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  }, [canvasRef, ctxRef]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    redoRef.current.push(canvas.toDataURL("image/png"));
    const prev = historyRef.current.pop()!;
    restoreFrom(prev);
  }, [canvasRef, restoreFrom]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || redoRef.current.length === 0) return;
    historyRef.current.push(canvas.toDataURL("image/png"));
    const next = redoRef.current.pop()!;
    restoreFrom(next);
  }, [canvasRef, restoreFrom]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (key === "z") { e.preventDefault(); if (e.shiftKey) { redo(); } else { undo(); } return; }
      if (key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  /* ── Tool actions (clear, download, undo, redo) ── */
  useEffect(() => {
    if (!canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (tool === "clear") {
      snapshot();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setTimeout(() => setTool?.("pencil"), 0);
    }
    if (tool === "download") {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "drawing.png";
      a.href = url;
      a.click();
      setTimeout(() => setTool?.("pencil"), 0);
    }
    if (tool === "undo") { undo(); setTimeout(() => setTool?.("pencil"), 0); }
    if (tool === "redo") { redo(); setTimeout(() => setTool?.("pencil"), 0); }
  }, [tool, canvasRef, ctxRef, setTool, snapshot, undo, redo]);

  

  /* ── Pinch to zoom ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const initialDistanceRef = { current: 0 };
    const initialZoomRef = { current: 1 };
    const getDistance = (t1: Touch, t2: Touch) => {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
        setZoom?.((currentZoom) => { initialZoomRef.current = currentZoom; return currentZoom; });
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const scale = getDistance(e.touches[0], e.touches[1]) / initialDistanceRef.current;
        setZoom?.(+(Math.min(4, Math.max(0.25, initialZoomRef.current * scale)).toFixed(3)));
      }
    };
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canvasRef, setZoom]);

  /* ── Panning ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handlePanStart = (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
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
      setPan?.({ x: clientX - panStartRef.current.x, y: clientY - panStartRef.current.y });
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

  /* ── Mouse / Touch handlers ── */
  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e as React.TouchEvent).touches?.length >= 2) return;
    if (tool === "gradient" && gradStart) {
      const end = getCanvasXY(e);
      const ctx = ctxRef.current!;
      const { r, g, b } = hexToRgb(lineColor);
      snapshot?.();
      const lg = ctx.createLinearGradient(gradStart.x, gradStart.y, end.x, end.y);
      lg.addColorStop(0, `rgba(${r},${g},${b},0)`);
      lg.addColorStop(1, `rgba(${r},${g},${b},${lineOpacity})`);
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
      setGradStart(null);
      setTool?.("pencil");
      return;
    }
    if (tool === "line" && lineStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getCanvasXY(e);
      ctx.putImageData(previewRef.current, 0, 0);
      ctx.beginPath();
      ctx.moveTo(lineStartRef.current.x, lineStartRef.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = lineOpacity;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
      lineStartRef.current = null;
      previewRef.current = null;
      return;
    }
    endDrawing(e);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e as React.TouchEvent).touches?.length >= 2) return;
    const ctx = ctxRef.current;
    // if (tool === "gradient") { setGradStart(getCanvasXY(e)); return; }
    if (tool === "line") {
        snapshot();
        const { x, y } = getCanvasXY(e);
        lineStartRef.current = { x, y };
        previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        return;
      }
    if (!ctx) return;
    if (tool === "move") {
      e.preventDefault();
      isPanningRef.current = true;
      const te = e as React.TouchEvent;
      const me = e as React.MouseEvent;
      const clientX = te.touches ? te.touches[0].clientX : me.clientX;
      const clientY = te.touches ? te.touches[0].clientY : me.clientY;
      panStartRef.current = { x: clientX - pan.x, y: clientY - pan.y };
      return;
    }
    if (tool === "zoom") {
      const me = e as React.MouseEvent;
      if (me.nativeEvent.button !== 2) {
        setZoom(z => z !== 1 ? 1 : Math.min(4, +(z * 1.1).toFixed(3)));
      }
      return;
    }
    if (tool === "bucket") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      const hex = lineColor.replace('#', '');
      const r = parseInt(hex.slice(0,2),16);
      const g = parseInt(hex.slice(2,4),16);
      const b = parseInt(hex.slice(4,6),16);
      const a = Math.round((lineOpacity ?? 1) * 255);
      floodFill(ctx, x, y, [r,g,b,a], 8);
      setTool?.("pencil");
      return;
    }
    if (tool === "eyedropper") {
      const { x, y } = getCanvasXY(e);
      const [r,g,b] = ctx.getImageData(x, y, 1, 1).data;
      setLineColor?.("#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join(""));
      setTool?.("pencil");
      return;
    }
    snapshot();
    const { x, y } = getCanvasXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.globalCompositeOperation = (tool === "eraser") ? "destination-out" : "source-over";
    startDrawing(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
  if (tool === "line" && lineStartRef.current && previewRef.current) {
  const ctx = ctxRef.current;
  if (!ctx) return;
  const { x, y } = getCanvasXY(e);
  ctx.putImageData(previewRef.current, 0, 0);
  ctx.beginPath();
  ctx.moveTo(lineStartRef.current.x, lineStartRef.current.y);
  ctx.lineTo(x, y);
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = lineOpacity;
  ctx.strokeStyle = lineColor;
  ctx.stroke();
  return;
}
  draw(e);
};

  /* ── Render ── */
  return (
    <div className={`draw-area-outer${zoom > 1 ? ' is-zoomed' : ''}`}>
      <div className="draw-area-arrows-h" />
      <div className="draw-area-shadow" />
      <section
        className={`draw-area${zoom > 1 ? ' is-zoomed' : ''}`}
        style={{
          '--zoom': zoom,
          '--pan-x': `${pan.x}px`,
          '--pan-y': `${pan.y}px`,
        } as React.CSSProperties}
      >
        <canvas
          id="draw-canvas"
          ref={canvasRef}
          width={800}
          height={600}
          data-tool={tool}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseUp}
          onContextMenu={(e) => {
            if (tool === "zoom") {
              e.preventDefault();
              setZoom(z => Math.max(0.25, +(z * 0.9).toFixed(3)));
            }
          }}
        />
      </section>
    </div>
  );
}

export default Canvas;