import { useState, useEffect, useRef } from "react"
import { SPRAY_PRESETS, BRUSH_PRESETS, ERASER_PRESETS } from '../../data/paintToolPresets'
import Toolbox from './Toolbox'
import Canvas from './Canvas'
import './PaintApp.css'

/* ── Types ── */
interface PaintAppProps {
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<string>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  zoomReset: () => void;
  setZoomLevel: (value: number) => void;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  onDownloadRef: React.RefObject<() => void>;
  onClearRef: React.RefObject<() => void>;
  onOpenRef: React.RefObject<() => void>;
  onStatusChange: (message: string) => void;
  saveAsOpen: boolean;
  setSaveAsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showToolbox: boolean;
  showColorBox: boolean;
  flipRotateAction: { action: 'flipH' | 'flipV' | 'rotate'; angle?: number } | null;
  setFlipRotateAction: React.Dispatch<React.SetStateAction<{ action: 'flipH' | 'flipV' | 'rotate'; angle?: number } | null>>;
  stretchSkewAction: { stretchH: number; stretchV: number; skewH: number; skewV: number } | null;
  setStretchSkewAction: React.Dispatch<React.SetStateAction<{ stretchH: number; stretchV: number; skewH: number; skewV: number } | null>>;
  selectedBgPreset: number;
  setSelectedBgPreset: React.Dispatch<React.SetStateAction<number>>;
  canvasWidth: number;
  canvasHeight: number;
  showGrid: boolean;
}

/* ── Constants ── */
const XP_PALETTE = [
  '#000000','#808080','#800000','#FF0000','#FF8040','#FFFF00',
  '#808000','#008000','#008080','#00FFFF','#000080','#0000FF',
  '#800080','#FF00FF','#804000','#FF8080','#FF8020','#FFFF80',
  '#80FF00','#004040',
  '#FFFFFF','#C0C0C0','#FF0080','#804040','#FF8000','#FFFF40',
  '#80FF80','#00FF80','#40FFFF','#80C0FF','#4040FF','#8000FF',
  '#FF40FF','#FF80C0','#C08040','#FFD0A0','#FFC080','#FFFFC0',
  '#C0FFC0','#008040',
];

/* ── Flood fill helpers ── */
const idx = (x: number, y: number, w: number) => (y * w + x) * 4;

const colorMatch = (data: Uint8ClampedArray, i: number, target: number[], tol: number) =>
  (Math.abs(data[i]-target[0]) + Math.abs(data[i+1]-target[1]) +
   Math.abs(data[i+2]-target[2]) + Math.abs(data[i+3]-target[3])) <= tol;

function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillRGBA: number[], tolerance = 0) {
  const { width: w, height: h } = ctx.canvas;
  if (x < 0 || x >= w || y < 0 || y >= h) return;
  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  const i0 = idx(x, y, w);
  const target = [data[i0], data[i0+1], data[i0+2], data[i0+3]];
  if (target.every((v, i) => v === fillRGBA[i])) return;
  const visited = new Uint8Array(w * h);
  const stack: [number, number][] = [[x, y]];
  visited[y * w + x] = 1;
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    const i = idx(cx, cy, w);
    if (!colorMatch(data, i, target, tolerance)) continue;
    data[i]=fillRGBA[0]; data[i+1]=fillRGBA[1]; data[i+2]=fillRGBA[2]; data[i+3]=fillRGBA[3];
    if (cx>0   && !visited[cy*w+(cx-1)]) { visited[cy*w+(cx-1)]=1; stack.push([cx-1,cy]); }
    if (cx<w-1 && !visited[cy*w+(cx+1)]) { visited[cy*w+(cx+1)]=1; stack.push([cx+1,cy]); }
    if (cy>0   && !visited[(cy-1)*w+cx]) { visited[(cy-1)*w+cx]=1; stack.push([cx,cy-1]); }
    if (cy<h-1 && !visited[(cy+1)*w+cx]) { visited[(cy+1)*w+cx]=1; stack.push([cx,cy+1]); }
  }
  ctx.putImageData(img, 0, 0);
}

const PaintApp = ({
  onDownloadRef,
  onClearRef,
  onOpenRef,
  tool,
  setTool,
  zoom,
  setZoom,
  zoomReset,
  setZoomLevel,
  pan,
  setPan,
  onStatusChange,
  saveAsOpen,
  setSaveAsOpen,
  showColorBox,
  showToolbox,
  flipRotateAction,
  setFlipRotateAction,
  stretchSkewAction,
  setStretchSkewAction,
  selectedBgPreset,
  setSelectedBgPreset,
  canvasWidth,
  canvasHeight,
  showGrid
}: PaintAppProps) => {

  /* ── Refs ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<() => void>(() => {});

  /* ── State ── */
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [lineOpacity] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");

  // Presets
  const [selectedLinePreset, setSelectedLinePreset] = useState(0);
  const [selectedBrushPreset, setSelectedBrushPreset] = useState(0);
  const [selectedSprayPreset, setSelectedSprayPreset] = useState(0);
  const [selectedEraserPreset, setSelectedEraserPreset] = useState(0);
  const [selectedShapePreset, setSelectedShapePreset] = useState(0);

  // Selection
  const [selection, setSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [selectionData, setSelectionData] = useState<ImageData | null>(null);

  // Text tool
  const [textBoxPos, setTextBoxPos] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  /* ── Canvas init ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.filter = 'none';
    const brushShape = BRUSH_PRESETS[selectedBrushPreset].shape;
    ctx.lineCap = brushShape === 'square' ? 'square' : 'round';
    ctx.lineJoin = brushShape === 'square' ? 'miter' : 'round';
    ctxRef.current = ctx;
  }, [lineColor, lineWidth, lineOpacity, selectedBrushPreset]);

  /* ── Canvas resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (canvas.width === canvasWidth && canvas.height === canvasHeight) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.putImageData(imageData, 0, 0);
    ctxRef.current = ctx;
  }, [canvasWidth, canvasHeight]);

  /* ── Toolbar action refs ── */
  useEffect(() => {
    onDownloadRef.current = () => setTool('download');
    onClearRef.current = () => {
      if (window.confirm('Do you want to delete the picture?')) {
        zoomReset();
        setTool('clear');
      }
    };
    onOpenRef.current = () => setTool('open');
  }, [onClearRef, onDownloadRef, onOpenRef, setTool, zoomReset]);

  /* ── Status bar sync ── */
  useEffect(() => {
    onStatusChange(tool.charAt(0).toUpperCase() + tool.slice(1));
  }, [tool, onStatusChange]);

  /* ── Flip / Rotate ── */
  useEffect(() => {
    if (!flipRotateAction || !canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    snapshotRef.current();
    const { action, angle } = flipRotateAction;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    if (action === 'flipH') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    } else if (action === 'flipV') {
      ctx.translate(0, h);
      ctx.scale(1, -1);
    } else if (action === 'rotate') {
      const rad = ((angle ?? 90) * Math.PI) / 180;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rad);
      ctx.translate(-w / 2, -h / 2);
    }
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
    setFlipRotateAction(null);
  }, [flipRotateAction, setFlipRotateAction]);

  /* ── Stretch / Skew ── */
  useEffect(() => {
    if (!stretchSkewAction || !canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const { stretchH, stretchV, skewH, skewV } = stretchSkewAction;
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(imageData, 0, 0);
    snapshotRef.current();
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.transform(
      stretchH / 100,
      Math.tan((skewV * Math.PI) / 180),
      Math.tan((skewH * Math.PI) / 180),
      stretchV / 100,
      0,
      0
    );
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
    setStretchSkewAction(null);
  }, [stretchSkewAction, setStretchSkewAction]);

  /* ── Coordinate helper ── */
  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width / zoom);
    const scaleY = canvas.height / (rect.height / zoom);
    const te = e as React.TouchEvent;
    const me = e as React.MouseEvent;
    let clientX: number, clientY: number;
    if (te.touches?.length > 0) {
      clientX = te.touches[0].clientX; clientY = te.touches[0].clientY;
    } else if (te.changedTouches?.length > 0) {
      clientX = te.changedTouches[0].clientX; clientY = te.changedTouches[0].clientY;
    } else {
      clientX = me.clientX; clientY = me.clientY;
    }
    return { x: ((clientX - rect.left) / zoom) * scaleX, y: ((clientY - rect.top) / zoom) * scaleY };
  };

  /* ── Drawing handlers ── */
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchstart') e.preventDefault();
    const { x, y } = getEventCoordinates(e);
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const endDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if ((e as React.TouchEvent).touches?.length >= 2) return;
    if (e.type === 'touchmove') e.preventDefault();
    const { x, y } = getEventCoordinates(e);
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineTo(x, y);
    onStatusChange(`${Math.round(x)}, ${Math.round(y)}`);

    if (tool === 'pencil') {
      const prev = ctx.filter;
      ctx.filter = `blur(${Math.min(1.0, lineWidth * 0.06)}px)`;
      ctx.stroke();
      ctx.filter = prev;
    } else if (tool === 'brush') {
      const { shape, size } = BRUSH_PRESETS[selectedBrushPreset];
      const prev = ctx.filter;
      ctx.filter = `blur(${Math.min(3.0, size * 0.3)}px)`;
      if (shape === 'round' || shape === 'square') {
        ctx.stroke();
      } else if (shape === 'diag-right') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-size / 2, -size * 2, size, size * 4);
        ctx.restore();
      } else if (shape === 'diag-left') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 4);
        ctx.fillRect(-size / 2, -size * 2, size, size * 4);
        ctx.restore();
      }
      ctx.filter = prev;
    } else if (tool === 'spray') {
      const { density, radius } = SPRAY_PRESETS[selectedSprayPreset];
      for (let i = 0; i < density; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        ctx.fillStyle = lineColor;
        ctx.globalAlpha = lineOpacity * 0.3;
        ctx.fillRect(x + r * Math.cos(angle), y + r * Math.sin(angle), 1, 1);
      }
    } else if (tool === 'eraser') {
      const prevComposite = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = ERASER_PRESETS[selectedEraserPreset].size;
      ctx.stroke();
      ctx.globalCompositeOperation = prevComposite;
      ctx.lineWidth = lineWidth;
    } else {
      ctx.stroke();
    }
  };

  /* ── Render ── */
  return (
    <div className="app-wrap">
      <div className="top-part">
        {showToolbox &&
          <Toolbox
            tool={tool}
            setTool={setTool}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            selectedLinePreset={selectedLinePreset}
            setSelectedLinePreset={setSelectedLinePreset}
            selectedBrushPreset={selectedBrushPreset}
            setSelectedBrushPreset={setSelectedBrushPreset}
            selectedSprayPreset={selectedSprayPreset}
            setSelectedSprayPreset={setSelectedSprayPreset}
            selectedEraserPreset={selectedEraserPreset}
            setSelectedEraserPreset={setSelectedEraserPreset}
            selectedShapePreset={selectedShapePreset}
            setSelectedShapePreset={setSelectedShapePreset}
            selectedBgPreset={selectedBgPreset}
            setSelectedBgPreset={setSelectedBgPreset}
            setZoomLevel={setZoomLevel}
            zoom={zoom}
          />
        }
        <Canvas
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          startDrawing={startDrawing}
          draw={draw}
          endDrawing={endDrawing}
          lineColor={lineColor}
          setLineColor={setLineColor}
          lineWidth={lineWidth}
          lineOpacity={lineOpacity}
          tool={tool}
          setTool={setTool}
          selectedShapePreset={selectedShapePreset}
          floodFill={floodFill}
          zoom={zoom}
          setZoom={setZoom}
          pan={pan}
          setPan={setPan}
          onStatusChange={onStatusChange}
          saveAsOpen={saveAsOpen}
          setSaveAsOpen={setSaveAsOpen}
          bgColor={bgColor}
          selection={selection}
          setSelection={setSelection}
          selectionData={selectionData}
          setSelectionData={setSelectionData}
          selectedBgPreset={selectedBgPreset}
          textBoxPos={textBoxPos}
          setTextBoxPos={setTextBoxPos}
          snapshotRef={snapshotRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          showGrid={showGrid}
        />
      </div>

      {/* ── Color palette ── */}
      {showColorBox &&
        <div className="colors">
          <div
            className="colors__swatches"
            onClick={() => {
              const tmp = lineColor;
              setLineColor(bgColor);
              setBgColor(tmp);
            }}
          >
            <div className="colors__bg" style={{ background: bgColor }} />
            <div className="colors__fg" style={{ background: lineColor }} />
          </div>
          <div className="colors__sep" />
          <div className="colors__grid">
            {XP_PALETTE.map(color => (
              <button
                key={color}
                type="button"
                className={`colors__chip${lineColor === color ? ' colors__chip--active' : ''}`}
                style={{ background: color }}
                title={color}
                onClick={() => setLineColor(color)}
                onContextMenu={(e) => { e.preventDefault(); setBgColor(color); }}
              />
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default PaintApp;