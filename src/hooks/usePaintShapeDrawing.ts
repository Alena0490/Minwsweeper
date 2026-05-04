import { useRef } from 'react';
import { RECT_PRESETS } from '../data/paintToolPresets';

interface ShapeDrawingParams {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    lineWidth: number;
    lineOpacity: number;
    lineColor: string;
    bgColor: string;
    selectedShapePreset: number;
}

export const usePaintShapeDrawing = ({
    canvasRef,
    lineWidth,
    lineOpacity,
    lineColor,
    bgColor,
    selectedShapePreset,
}: ShapeDrawingParams) => {
    const rectStartRef = useRef<{ x: number; y: number } | null>(null);
    const lineStartRef = useRef<{ x: number; y: number } | null>(null);
    const polygonPointsRef = useRef<{ x: number; y: number }[]>([]);
    const curvePhaseRef = useRef(0);
    const curveStartRef = useRef<{ x: number; y: number } | null>(null);
    const curveEndRef = useRef<{ x: number; y: number } | null>(null);
    const curveCtrl1Ref = useRef<{ x: number; y: number } | null>(null);
    const curveCtrl2Ref = useRef<{ x: number; y: number } | null>(null);

    // Apply stroke style and opacity to the context
    const applyShapePreset = (ctx: CanvasRenderingContext2D) => {
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
    };

    // Fill/stroke the current path based on the selected shape preset
    const drawWithPreset = (ctx: CanvasRenderingContext2D) => {
        const preset = RECT_PRESETS[selectedShapePreset];
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

    // Constrain width/height to a square when Shift is held
    const getShiftConstrained = (w: number, h: number) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const visualW = Math.abs(w) * rect.width / canvas.width;
        const visualH = Math.abs(h) * rect.height / canvas.height;
        const visualSize = Math.min(visualW, visualH);
        return {
            w: (w < 0 ? -1 : 1) * visualSize * canvas.width / rect.width,
            h: (h < 0 ? -1 : 1) * visualSize * canvas.height / rect.height,
        };
    };

    const drawRect = (ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number, shift = false) => {
        let w = ex - sx;
        let h = ey - sy;
        if (shift) ({ w, h } = getShiftConstrained(w, h));
        applyShapePreset(ctx);
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

    const drawEllipse = (ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number, shift = false) => {
        let w = ex - sx;
        let h = ey - sy;
        if (shift) ({ w, h } = getShiftConstrained(w, h));
        const cx = sx + w / 2;
        const cy = sy + h / 2;
        const rx = Math.abs(w) / 2;
        const ry = Math.abs(h) / 2;
        applyShapePreset(ctx);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        drawWithPreset(ctx);
    };

    const drawRoundedRect = (ctx: CanvasRenderingContext2D, sx: number, sy: number, ex: number, ey: number, shift = false) => {
        let w = ex - sx;
        let h = ey - sy;
        if (shift) ({ w, h } = getShiftConstrained(w, h));
        const radius = Math.min(Math.abs(w), Math.abs(h)) * 0.15;
        applyShapePreset(ctx);
        ctx.beginPath();
        ctx.roundRect(sx, sy, w, h, radius);
        drawWithPreset(ctx);
    };

    const drawPolygon = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[], close = false) => {
        if (points.length < 2) return;
        applyShapePreset(ctx);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        if (close) ctx.closePath();
        drawWithPreset(ctx);
    };

    const drawCurve = (ctx: CanvasRenderingContext2D) => {
        if (!curveStartRef.current || !curveEndRef.current) return;
        const cp1 = curveCtrl1Ref.current ?? curveStartRef.current;
        const cp2 = curveCtrl2Ref.current ?? curveEndRef.current;
        applyShapePreset(ctx);
        ctx.beginPath();
        ctx.moveTo(curveStartRef.current.x, curveStartRef.current.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, curveEndRef.current.x, curveEndRef.current.y);
        ctx.stroke();
    };

    return {
        rectStartRef,
        lineStartRef,
        polygonPointsRef,
        curvePhaseRef,
        curveStartRef,
        curveEndRef,
        curveCtrl1Ref,
        curveCtrl2Ref,
        drawRect,
        drawEllipse,
        drawRoundedRect,
        drawPolygon,
        drawCurve,
    };
};