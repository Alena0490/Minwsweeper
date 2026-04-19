import { useState, useEffect, useRef, useCallback } from "react";
import useSound from "../../hooks/useSound";
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
}: CanvasProps) => {
  /* ── State ── */
  const [gradStart, setGradStart] = useState<{ x: number; y: number } | null>(null);
  const [fileName, setFileName] = useState("drawing.png");

  const { playNavStart, playMinimize } = useSound();

  /* ── Refs ── */
  const historyRef = useRef<string[]>([]);
  const redoRef = useRef<string[]>([]);
  const previewRef = useRef<ImageData | null>(null);
  const lineStartRef = useRef<{ x: number; y: number } | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  /* ── Coordinate helpers ── */
  const hexToRgb = (hex: string) => {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  };

  const getCanvasXY = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const baseWidth = rect.width / zoom;
    const baseHeight = rect.height / zoom;
    const scaleX = canvas.width / baseWidth;
    const scaleY = canvas.height / baseHeight;

    const te = e as TouchEvent;
    const me = e as MouseEvent;

    const clientX =
      te.touches?.[0]?.clientX ??
      te.changedTouches?.[0]?.clientX ??
      me.clientX;

    const clientY =
      te.touches?.[0]?.clientY ??
      te.changedTouches?.[0]?.clientY ??
      me.clientY;

    return {
      x: Math.floor(((clientX - rect.left) / zoom) * scaleX),
      y: Math.floor(((clientY - rect.top) / zoom) * scaleY),
    };
  };

  /* ── History helpers ── */
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

  const restoreFrom = useCallback(
    (url: string) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || !url) return;

      const img = new Image();

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.src = url;
    },
    [canvasRef, ctxRef]
  );

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

  /* ── File actions ── */
  const handleSaveAsConfirm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const safeName = fileName.trim() || "drawing.png";
    const finalName = safeName.toLowerCase().endsWith(".png")
      ? safeName
      : `${safeName}.png`;

    playNavStart();

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = finalName;
    a.href = url;
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

        img.onerror = () => {
          onStatusChange("Failed to open image");
        };

        img.src = result;
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }, [canvasRef, ctxRef, snapshot, onStatusChange]);

  /* ── Dialog keyboard handling ── */
  useEffect(() => {
    if (!saveAsOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSaveAsConfirm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setSaveAsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [saveAsOpen, handleSaveAsConfirm, setSaveAsOpen]);

  /* ── Tool side effects ── */
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
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "drawing.png";
      a.href = url;
      a.click();
      setTimeout(() => setTool("pencil"), 0);
    }

    if (tool === "undo") {
      undo();
      setTimeout(() => setTool("pencil"), 0);
    }

    if (tool === "redo") {
      redo();
      setTimeout(() => setTool("pencil"), 0);
    }

    if (tool === "open") {
      handleOpenFile();
      setTimeout(() => setTool("pencil"), 0);
    }
  }, [tool, canvasRef, ctxRef, setTool, snapshot, undo, redo, handleOpenFile]);

  /* ── Touch zoom handling ── */
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
        setZoom((currentZoom) => {
          initialZoomRef.current = currentZoom;
          return currentZoom;
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const scale =
          getDistance(e.touches[0], e.touches[1]) / initialDistanceRef.current;

        setZoom(
          +Math.min(4, Math.max(0.25, initialZoomRef.current * scale)).toFixed(3)
        );
      }
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [canvasRef, setZoom]);

  /* ── Canvas panning ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePanStart = (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        e.preventDefault();
        isPanningRef.current = true;
        panStartRef.current = {
          x: e.clientX - pan.x,
          y: e.clientY - pan.y,
        };
      }
    };

    const handlePanMove = (e: MouseEvent | TouchEvent) => {
      if (!isPanningRef.current) return;

      e.preventDefault();

      const te = e as TouchEvent;
      const me = e as MouseEvent;

      const clientX = te.touches?.[0]?.clientX ?? me.clientX;
      const clientY = te.touches?.[0]?.clientY ?? me.clientY;

      setPan({
        x: clientX - panStartRef.current.x,
        y: clientY - panStartRef.current.y,
      });
    };

    const handlePanEnd = () => {
      isPanningRef.current = false;
    };

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

  /* ── Pointer handlers ── */
  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e as React.TouchEvent).touches?.length >= 2) return;

    if (tool === "gradient" && gradStart) {
      const end = getCanvasXY(e);
      const ctx = ctxRef.current!;
      const { r, g, b } = hexToRgb(lineColor);

      snapshot();

      const lg = ctx.createLinearGradient(gradStart.x, gradStart.y, end.x, end.y);
      lg.addColorStop(0, `rgba(${r},${g},${b},0)`);
      lg.addColorStop(1, `rgba(${r},${g},${b},${lineOpacity})`);

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();

      setGradStart(null);
      setTool("pencil");
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

    if (tool === "line") {
      snapshot();
      const { x, y } = getCanvasXY(e);
      lineStartRef.current = { x, y };
      previewRef.current = ctxRef.current!.getImageData(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
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

      panStartRef.current = {
        x: clientX - pan.x,
        y: clientY - pan.y,
      };
      return;
    }

    if (tool === "zoom") {
      const me = e as React.MouseEvent;

      if (me.nativeEvent.button !== 2) {
        setZoom((z) => (z !== 1 ? 1 : Math.min(4, +(z * 1.1).toFixed(3))));
      }
      return;
    }

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

    if (tool === "eyedropper") {
      const { x, y } = getCanvasXY(e);
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;

      setLineColor(
        "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
      );
      setTool("pencil");
      return;
    }

    snapshot();

    const { x, y } = getCanvasXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";

    startDrawing(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getCanvasXY(e);
    onStatusChange(`${Math.round(x)}, ${Math.round(y)}`);

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

    draw(e);
  };

  /* ── Render ── */
  return (
    <div className={`draw-area-outer${zoom > 1 ? " is-zoomed" : ""}`}>
      <div className="draw-area-arrows-h" />
      <div className="draw-area-shadow" />

      <section
        className={`draw-area${zoom > 1 ? " is-zoomed" : ""}`}
        style={
          {
            "--zoom": zoom,
            "--pan-x": `${pan.x}px`,
            "--pan-y": `${pan.y}px`,
          } as React.CSSProperties
        }
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

      {/* Dialog Window */}
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
                  onClick={() => {
                    playMinimize();
                    setSaveAsOpen(false);
                  }}
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
              <button type="button" onClick={handleSaveAsConfirm}>
                Save
              </button>
              <button 
                type="button" 
                onClick={() => {
                  playMinimize();
                  setSaveAsOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;