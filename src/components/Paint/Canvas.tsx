import { useState, useEffect, useRef, useCallback } from "react";
import useSound from "../../hooks/useSound";
import { RECT_PRESETS, BACKGROUND_PRESETS } from '../../data/paintToolPresets'
import "./Canvas.css";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>;
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  endDrawing: () => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  lineWidth: number;
  lineOpacity: number;
  tool: string;
  setTool: (tool: string) => void;
  floodFill: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    fillRGBA: number[],
    tolerance?: number
  ) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  onStatusChange: (message: string) => void;
  saveAsOpen: boolean;
  setSaveAsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedShapePreset: number;
  bgColor: string,
  selection: { x: number; y: number; w: number; h: number } | null;
  setSelection: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number } | null>>;
  selectionData: ImageData | null;
  setSelectionData: React.Dispatch<React.SetStateAction<ImageData | null>>;
  selectedBgPreset: number;
}

const Canvas = ({
  canvasRef,
  startDrawing,
  draw,
  endDrawing,
  ctxRef,
  tool,
  lineColor,
  lineWidth,
  lineOpacity,
  setLineColor,
  setTool,
  zoom,
  setZoom,
  floodFill,
  pan,
  setPan,
  onStatusChange,
  saveAsOpen,
  setSaveAsOpen,
  selectedShapePreset,
  bgColor,
  selection,
  setSelection,
  selectionData,
  setSelectionData,
  selectedBgPreset
}: CanvasProps) => {

  /* ── State ── */
  const [fileName, setFileName] = useState("drawing.png");

  const { playNavStart, playMinimize } = useSound();

  /* ── Refs ── */
  const historyRef = useRef<string[]>([]);
  const redoRef = useRef<string[]>([]);
  const previewRef = useRef<ImageData | null>(null);
  const lineStartRef = useRef<{ x: number; y: number } | null>(null);
  const rectStartRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const selStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingSelectionRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const cleanCanvasRef = useRef<ImageData | null>(null);

  const transparentBg = BACKGROUND_PRESETS[selectedBgPreset].transparent;

  /* ── Coordinate helpers ── */
  const getCanvasXY = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width / zoom);
    const scaleY = canvas.height / (rect.height / zoom);
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
      historyRef.current.push(canvas.toDataURL("image/png"));
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
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = url;
  }, [canvasRef, ctxRef]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    redoRef.current.push(canvas.toDataURL("image/png"));
    restoreFrom(historyRef.current.pop()!);
  }, [canvasRef, restoreFrom]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || redoRef.current.length === 0) return;
    historyRef.current.push(canvas.toDataURL("image/png"));
    restoreFrom(redoRef.current.pop()!);
  }, [canvasRef, restoreFrom]);

  /* ── Rectangle drawing helper ── */
  const drawRect = (
    ctx: CanvasRenderingContext2D,
    sx: number, sy: number,
    ex: number, ey: number,
    shift = false
  ) => {
    // Constrain to square if Shift is held
    let w = ex - sx;
    let h = ey - sy;
    if (shift) {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const visualW = Math.abs(w) * rect.width / canvas.width;
      const visualH = Math.abs(h) * rect.height / canvas.height;
      const visualSize = Math.min(visualW, visualH);
      w = (w < 0 ? -1 : 1) * visualSize * canvas.width / rect.width;
      h = (h < 0 ? -1 : 1) * visualSize * canvas.height / rect.height;
    }

    // Apply stroke style
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;

    // Draw shape according to selected preset
    const preset = RECT_PRESETS[selectedShapePreset];
    if (preset.id === 'rect-outline') {
      ctx.strokeRect(sx, sy, w, h);
    } else if (preset.id === 'rect-outline-fill') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(sx, sy, w, h);
      ctx.strokeRect(sx, sy, w, h);
    } else if (preset.id === 'rect-fill') {
      ctx.fillStyle = lineColor;
      ctx.fillRect(sx, sy, w, h);
    }
  };

  /* ── Ellipse drawing helper ── */
  const drawEllipse = (
    ctx: CanvasRenderingContext2D,
    sx: number, sy: number,
    ex: number, ey: number,
    shift = false,
    
  ) => {
    // Constrain to circle if Shift is held
    let w = ex - sx;
    let h = ey - sy;
    if (shift) {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      // Convert to visual pixels to find equal visual size
      const visualW = Math.abs(w) * rect.width / canvas.width;
      const visualH = Math.abs(h) * rect.height / canvas.height;
      const visualSize = Math.min(visualW, visualH);
      // Convert back to canvas pixels
      w = (w < 0 ? -1 : 1) * visualSize * canvas.width / rect.width;
      h = (h < 0 ? -1 : 1) * visualSize * canvas.height / rect.height;
    }

    // Compute center and radii from constrained dimensions
    const cx = sx + w / 2;
    const cy = sy + h / 2;
    const rx = Math.abs(w) / 2;
    const ry = Math.abs(h) / 2;  
    
    // Apply stroke style
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;

    console.log('w:', w, 'h:', h, 'size:', Math.min(Math.abs(w), Math.abs(h)));
    // Draw shape according to selected preset
    const preset = RECT_PRESETS[selectedShapePreset];
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (preset.id === 'rect-outline') {
      ctx.stroke();
    } else if (preset.id === 'rect-outline-fill') {
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.stroke();
    } else if (preset.id === 'rect-fill') {
      ctx.fillStyle = lineColor;
      ctx.fill();
    }
  };

  /* ── Rounded Rectangle drawing helper ── */
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    sx: number, sy: number,
    ex: number, ey: number,
    shift = false
  ) => {
    // Constrain to square if Shift is held
    let w = ex - sx;
    let h = ey - sy;
    if (shift) {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const visualW = Math.abs(w) * rect.width / canvas.width;
      const visualH = Math.abs(h) * rect.height / canvas.height;
      const visualSize = Math.min(visualW, visualH);
      w = (w < 0 ? -1 : 1) * visualSize * canvas.width / rect.width;
      h = (h < 0 ? -1 : 1) * visualSize * canvas.height / rect.height;
    }

    // Radius — 15% of shorter side
    const radius = Math.min(Math.abs(w), Math.abs(h)) * 0.15;

    // Apply stroke style
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;

    // Draw shape according to selected preset
    const preset = RECT_PRESETS[selectedShapePreset];
    ctx.beginPath();
    ctx.roundRect(sx, sy, w, h, radius);
    if (preset.id === 'rect-outline') {
      ctx.stroke();
    } else if (preset.id === 'rect-outline-fill') {
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.stroke();
    } else if (preset.id === 'rect-fill') {
      ctx.fillStyle = lineColor;
      ctx.fill();
    }
  };

  /* ── File actions ── */
  const handleSaveAsConfirm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safeName = fileName.trim() || "drawing.png";
    const finalName = safeName.toLowerCase().endsWith(".png") ? safeName : `${safeName}.png`;
    playNavStart();
    const a = document.createElement("a");
    a.download = finalName;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setSaveAsOpen(false);
  }, [canvasRef, fileName, setSaveAsOpen, playNavStart]);

  const handleOpenFile = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result !== "string") return;
        const img = new Image();
        img.onload = () => {
          snapshot();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          onStatusChange("Image opened");
        };
        img.onerror = () => onStatusChange("Failed to open image");
        img.src = result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [canvasRef, ctxRef, snapshot, onStatusChange]);

  /* ── Keyboard: Save As dialog ── */
  useEffect(() => {
    if (!saveAsOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); handleSaveAsConfirm(); }
      if (e.key === "Escape") { e.preventDefault(); setSaveAsOpen(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [saveAsOpen, handleSaveAsConfirm, setSaveAsOpen]);

  /* ── Tool side effects (clear, download, undo, redo, open) ── */
  useEffect(() => {
    if (!canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (tool === "clear") {
      snapshot();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setTimeout(() => setTool("pencil"), 0);
    }
    if (tool === "download") {
      const a = document.createElement("a");
      a.download = "drawing.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      setTimeout(() => setTool("pencil"), 0);
    }
    if (tool === "undo") { undo(); setTimeout(() => setTool("pencil"), 0); }
    if (tool === "redo") { redo(); setTimeout(() => setTool("pencil"), 0); }
    if (tool === "open") { handleOpenFile(); setTimeout(() => setTool("pencil"), 0); }
  }, [tool, canvasRef, ctxRef, setTool, snapshot, undo, redo, handleOpenFile]);

  /* ── Touch zoom ── */
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
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [canvasRef, setZoom]);

  /* ── Canvas panning (middle mouse + drag) ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handlePanStart = (e: MouseEvent) => {
      if (e.button === 1) {  // middle mouse
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
    canvas.addEventListener("mousedown", handlePanStart);
    window.addEventListener("mousemove", handlePanMove);
    window.addEventListener("mouseup", handlePanEnd);
    window.addEventListener("touchmove", handlePanMove, { passive: false });
    window.addEventListener("touchend", handlePanEnd);
    return () => {
      canvas.removeEventListener("mousedown", handlePanStart);
      window.removeEventListener("mousemove", handlePanMove);
      window.removeEventListener("mouseup", handlePanEnd);
      window.removeEventListener("touchmove", handlePanMove);
      window.removeEventListener("touchend", handlePanEnd);
    };
  }, [pan, setPan, canvasRef]);

  /* ── Pointer: Mouse Down ── */
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e as React.TouchEvent).touches?.length >= 2) return;
    const ctx = ctxRef.current;

    // Line tool
    if (tool === "line") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      lineStartRef.current = { x, y };
      previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      return;
    }

    // Rectangle tool
    if (tool === "rectangle") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      rectStartRef.current = { x, y };
      previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      return;
    }

    // Rounded rectangle tool
    if (tool === "roundedRectangle") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      rectStartRef.current = { x, y };
      previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      return;
    }

    // Ellipse tool
    if (tool === "ellipse") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      rectStartRef.current = { x, y };
      previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      return;
    }

    // Rect Select tool
    if (tool === "rectselect") {
      const { x, y } = getCanvasXY(e);
      cleanCanvasRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height); // ← přidat
      previewRef.current = cleanCanvasRef.current;

      // If clicking inside existing selection — start drag
      if (selection &&
        x >= selection.x && x <= selection.x + selection.w &&
        y >= selection.y && y <= selection.y + selection.h
      ) {
        isDraggingSelectionRef.current = true;
        dragOffsetRef.current = { x: x - selection.x, y: y - selection.y };
        return;
      }

      // Otherwise start new selection
      isDraggingSelectionRef.current = false;
      selStartRef.current = { x, y };
      setSelection(null);
      setSelectionData(null);
      cleanCanvasRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height); // ← přidat
      previewRef.current = cleanCanvasRef.current;
      return;
    }

    if (!ctx) return;

    // Move tool
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

    // Zoom tool
    if (tool === "zoom") {
      const me = e as React.MouseEvent;
      if (me.nativeEvent.button !== 2) {
        setZoom((z) => (z !== 1 ? 1 : Math.min(4, +(z * 1.1).toFixed(3))));
      }
      return;
    }

    // Bucket tool
    if (tool === "bucket") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      const hex = lineColor.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = Math.round((lineOpacity ?? 1) * 255);
      floodFill(ctx, x, y, [r, g, b, a], 8);
      setTool("pencil");
      return;
    }

    // Eyedropper tool
    if (tool === "eyedropper") {
      const { x, y } = getCanvasXY(e);
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      setLineColor("#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join(""));
      setTool("pencil");
      return;
    }

    // Freehand tools (pencil, brush, spray, eraser)
    snapshot();
    const { x, y } = getCanvasXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    startDrawing(e);
  };

  /* ── Pointer: Mouse Move ── */
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasXY(e);
    onStatusChange(`${Math.round(x)}, ${Math.round(y)}`);

    // Line preview
    if (tool === "line" && lineStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
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

    // Rectangle preview
    if (tool === "rectangle" && rectStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.putImageData(previewRef.current, 0, 0);
      const shift = (e as React.MouseEvent).shiftKey;
      drawRect(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
      return;
    }

    // Rounded rectangle preview
     if (tool === "roundedRectangle" && rectStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.putImageData(previewRef.current, 0, 0);
      const shift = (e as React.MouseEvent).shiftKey;
      drawRoundedRect(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
      return;
    }

    // Ellipse preview
    if (tool === "ellipse" && rectStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.putImageData(previewRef.current, 0, 0);
      const shift = (e as React.MouseEvent).shiftKey;
      drawEllipse(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
      return;
    }

    // Rect Select preview
      if (tool === "rectselect" && selStartRef.current && previewRef.current) {
        const ctx = ctxRef.current;
        if (!ctx) return;

        // Restore canvas without selection overlay
        ctx.putImageData(previewRef.current, 0, 0);

        // Draw dashed selection rectangle
        const w = x - selStartRef.current.x;
        const h = y - selStartRef.current.y;
        ctx.save();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.globalAlpha = 1;
        ctx.strokeRect(selStartRef.current.x, selStartRef.current.y, w, h);
        ctx.restore();
        return;
      }

    // Rect Select drag
    if (tool === "rectselect" && isDraggingSelectionRef.current && selection && selectionData) {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const newX = x - dragOffsetRef.current.x;
      const newY = y - dragOffsetRef.current.y;

      // Restore base canvas
      ctx.putImageData(previewRef.current!, 0, 0);

      // Fill original position with bgColor
      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
}

      // Draw selection at new position
      ctx.putImageData(selectionData, newX, newY);

      // Draw dashed border
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 1;
      ctx.strokeRect(newX, newY, selection.w, selection.h);
      ctx.restore();
      return;
    }

    // Draw active selection border when hovering
    if (tool === "rectselect" && selection && !selStartRef.current && !isDraggingSelectionRef.current) {
      const ctx = ctxRef.current;
      if (!ctx || !cleanCanvasRef.current) return;
      ctx.putImageData(cleanCanvasRef.current, 0, 0);
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = 1;
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      ctx.restore();
    }

    draw(e);
  };

  /* ── Pointer: Mouse Up ── */
  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e as React.TouchEvent).touches?.length >= 2) return;

    // Line finalize
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

    // Rectangle finalize
    if (tool === "rectangle" && rectStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getCanvasXY(e);
      ctx.putImageData(previewRef.current, 0, 0);
      const shift = (e as React.MouseEvent).shiftKey;
      drawRect(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
      rectStartRef.current = null;
      previewRef.current = null;
      return;
    }

    // Rounded rectangle finalize
    if (tool === "roundedRectangle" && rectStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getCanvasXY(e);
      ctx.putImageData(previewRef.current, 0, 0);
      const shift = (e as React.MouseEvent).shiftKey;
      drawRoundedRect(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
      rectStartRef.current = null;
      previewRef.current = null;
      return;
    }

    // Ellipse finalize
    if (tool === "ellipse" && rectStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getCanvasXY(e);
      ctx.putImageData(previewRef.current, 0, 0);
      const shift = (e as React.MouseEvent).shiftKey;
      drawEllipse(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
      rectStartRef.current = null;
      previewRef.current = null;
      return;
    }

    // Rect Select finalize
    if (tool === "rectselect" && selStartRef.current && previewRef.current) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getCanvasXY(e);

      const sx = Math.min(selStartRef.current.x, x);
      const sy = Math.min(selStartRef.current.y, y);
      const sw = Math.abs(x - selStartRef.current.x);
      const sh = Math.abs(y - selStartRef.current.y);

      if (sw > 0 && sh > 0) {
        const data = ctx.getImageData(sx, sy, sw, sh);
        setSelectionData(data);
        setSelection({ x: sx, y: sy, w: sw, h: sh });
        ctx.putImageData(previewRef.current!, 0, 0);
        cleanCanvasRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        previewRef.current = cleanCanvasRef.current;
      }

      selStartRef.current = null;
      return;
    }

    // Rect Select drag finalize
    if (tool === "rectselect" && isDraggingSelectionRef.current && selection && selectionData) {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const { x, y } = getCanvasXY(e);

      const newX = x - dragOffsetRef.current.x;
      const newY = y - dragOffsetRef.current.y;

      snapshot();
      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
      }
      ctx.putImageData(selectionData, newX, newY);
      cleanCanvasRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      previewRef.current = cleanCanvasRef.current;
      setSelection({ x: newX, y: newY, w: selection.w, h: selection.h });
      isDraggingSelectionRef.current = false;
      return;
    }

    endDrawing();
    // Keep cleanCanvasRef up to date after any drawing
    if (canvasRef.current && ctxRef.current) {
      cleanCanvasRef.current = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    endDrawing();
  };

  /* ── Rect Select keyboard actions ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (tool !== 'rectselect' || !selection || !selectionData) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      // Delete — fill selection with bgColor
      if (e.key === 'Delete') {
        snapshot();
        ctx.fillStyle = bgColor;
        ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
        setSelection(null);
        setSelectionData(null);
      }

      // Ctrl+C — copy to clipboard
      if (e.key === 'c' && e.ctrlKey) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = selection.w;
        tempCanvas.height = selection.h;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(selectionData, 0, 0);
        tempCanvas.toBlob((blob) => {
          if (!blob) return;
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        });
      }

      // Ctrl+X — cut
      if (e.key === 'x' && e.ctrlKey) {
        snapshot();
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = selection.w;
        tempCanvas.height = selection.h;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.putImageData(selectionData, 0, 0);
        tempCanvas.toBlob((blob) => {
          if (!blob) return;
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
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

  /* ── Render ── */
  return (
    <div className={`draw-area-outer${zoom > 1 ? " is-zoomed" : ""}`}>
      <div className="draw-area-arrows-h" />
      <div className="draw-area-shadow" />

      <section
        className={`draw-area${zoom > 1 ? " is-zoomed" : ""}`}
        data-tool={tool}
        style={{ "--zoom": zoom, "--pan-x": `${pan.x}px`, "--pan-y": `${pan.y}px` } as React.CSSProperties}
      >
        <canvas
          id="draw-canvas"
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={(e) => {
            handleMouseUp(e);
            onStatusChange(tool.charAt(0).toUpperCase() + tool.slice(1));
          }}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseUp}
          onContextMenu={(e) => {
            if (tool === "zoom") {
              e.preventDefault();
              setZoom((z) => Math.max(0.25, +(z * 0.9).toFixed(3)));
            }
          }}
        />
      </section>

      {/* Save As Dialog */}
      {saveAsOpen && (
        <div
          className={`paint-dialog-backdrop ${saveAsOpen ? "is-open" : ""}`}
          onClick={() => setSaveAsOpen(false)}
        >
          <div
            className={`paint-dialog ${saveAsOpen ? "is-open" : ""}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-as-title"
          >
            <div className="title-bar">
              <div className="title-bar-text">Save As</div>
              <div className="title-bar-buttons">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => { playMinimize(); setSaveAsOpen(false); }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="paint-dialog-body">
              <label htmlFor="filename-input">File name:</label>
              <input
                id="filename-input"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="paint-dialog-actions">
              <button type="button" onClick={handleSaveAsConfirm}>Save</button>
              <button type="button" onClick={() => { playMinimize(); setSaveAsOpen(false); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;