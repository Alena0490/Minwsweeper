import { useState, useEffect, useRef } from "react"
import Toolbox from './Toolbox'
import Canvas from './Canvas'
import './PaintApp.css'

interface PaintAppProps {
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<string>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomReset: () => void;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  onDownloadRef: React.RefObject<() => void>;
  onClearRef: React.RefObject<() => void>;

}

const XP_PALETTE = [
  '#000000','#808080','#800000','#FF0000','#FF8040','#FFFF00',
  '#808000','#008000','#008080','#00FFFF','#000080','#0000FF',
  '#800080','#FF00FF','#804000','#FF8080','#FF8000','#FFFF80',
  '#80FF00','#004040',
  '#FFFFFF','#C0C0C0','#FF0080','#804040','#FF8000','#FFFF40',
  '#80FF80','#00FF80','#40FFFF','#80C0FF','#4040FF','#8000FF',
  '#FF40FF','#FF80C0','#C08040','#FFD0A0','#FFC080','#FFFFC0',
  '#C0FFC0','#008040',
];

const PaintApp = ({ onDownloadRef, onClearRef, tool, setTool, zoom, setZoom, onZoomIn, onZoomOut, zoomReset, pan, setPan }: PaintAppProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [lineOpacity, setLineOpacity] = useState(1);

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
    ctxRef.current = ctx;
    ctx.filter = 'none';
  }, [lineColor, lineWidth, lineOpacity]);

  useEffect(() => {
    onDownloadRef.current = () => setTool('download');
    onClearRef.current = () => {
      if (window.confirm('Do you want to delete the picture?')) {
        zoomReset();
        setTool('clear');
      }
    };
  }, [onClearRef, onDownloadRef, setTool, zoomReset ]);

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
    if (tool === 'pencil') {
      const prev = ctx.filter;
      ctx.filter = `blur(${Math.min(1.0, lineWidth * 0.06)}px)`;
      ctx.stroke();
      ctx.filter = prev;
    } else if (tool === 'brush') {
      const prev = ctx.filter;
      ctx.filter = `blur(${Math.min(3.0, lineWidth * 0.3)}px)`;
      ctx.stroke();
      ctx.filter = prev;
      } else if (tool === 'spray') {
        const density = 30;
        const radius = lineWidth * 2;
        for (let i = 0; i < density; i++) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * radius;
          const sx = x + r * Math.cos(angle);
          const sy = y + r * Math.sin(angle);
          ctx.fillStyle = lineColor;
          ctx.globalAlpha = lineOpacity * 0.3;
          ctx.fillRect(sx, sy, 1, 1);
        }
      } else {
      ctx.stroke();
    }
  };

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

  return (
    <div className="app-wrap">
      <div className="top-part">
        <Toolbox
          lineColor={lineColor}
          setLineColor={setLineColor}
          lineWidth={lineWidth} 
          setLineWidth={setLineWidth}
          lineOpacity={lineOpacity} 
          setLineOpacity={setLineOpacity}
          tool={tool} 
          setTool={setTool}
          onZoomIn={onZoomIn} 
          onZoomOut={onZoomOut} 
          onZoomReset={zoomReset}
          zoom={zoom}
        />
        <Canvas
          canvasRef={canvasRef} ctxRef={ctxRef}
          startDrawing={startDrawing} draw={draw} endDrawing={endDrawing}
          lineColor={lineColor} setLineColor={setLineColor}
          lineWidth={lineWidth} lineOpacity={lineOpacity}
          tool={tool} setTool={setTool} floodFill={floodFill}
          zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan}
        />
      </div>
      <div className="colors">
        <div className="colors__swatches">
          <div className="colors__bg" />
          <div className="colors__fg" style={{ background: lineColor }} />
        </div>
        <div className="colors__sep" />
        <div className="colors__grid">
          {XP_PALETTE.map(color => (
            <button
              key={color} type="button"
              className={`colors__chip${lineColor === color ? ' colors__chip--active' : ''}`}
              style={{ background: color }} title={color}
              onClick={() => setLineColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaintApp