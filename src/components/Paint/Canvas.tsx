import { useEffect, useRef } from 'react';
import { usePaintHistory } from '../../hooks/usePaintHistory';
import { usePaintFileActions } from '../../hooks/usePaintFileActions';
import { usePaintShapeDrawing } from '../../hooks/usePaintShapeDrawing';
import { usePaintSelection } from '../../hooks/usePaintSelection';
import { usePaintPanning } from '../../hooks/usePaintPanning';
import { BACKGROUND_PRESETS } from '../../data/paintToolPresets';
import TextBox from './TextBox';
import './Canvas.css';

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
        tolerance?: number,
    ) => void;

    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    pan: { x: number; y: number };
    setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;

    onStatusChange: (message: string) => void;

    saveAsOpen: boolean;
    setSaveAsOpen: React.Dispatch<React.SetStateAction<boolean>>;

    selectedShapePreset: number;
    bgColor: string;

    selection: { x: number; y: number; w: number; h: number } | null;
    setSelection: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number } | null>>;
    selectionData: ImageData | null;
    setSelectionData: React.Dispatch<React.SetStateAction<ImageData | null>>;
    selectedBgPreset: number;

    textBoxPos: { x: number; y: number; w: number; h: number } | null;
    setTextBoxPos: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number } | null>>;

    snapshotRef: React.RefObject<() => void>;
    canvasWidth: number;
    canvasHeight: number;
    showGrid: boolean;
}

const Canvas = ({
    canvasRef,
    ctxRef,

    startDrawing,
    draw,
    endDrawing,

    lineColor,
    setLineColor,
    lineWidth,
    lineOpacity,

    tool,
    setTool,

    floodFill,

    zoom,
    setZoom,
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
    selectedBgPreset,

    textBoxPos,
    setTextBoxPos,

    snapshotRef,
    canvasWidth,
    canvasHeight,
    showGrid,
}: CanvasProps) => {
    const previewRef = useRef<ImageData | null>(null);
    const invertedRef = useRef(false);

    const transparentBg = BACKGROUND_PRESETS[selectedBgPreset].transparent;

    // Convert mouse/touch event to canvas coordinates accounting for zoom and pan
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

    // History
    const { snapshot, undo, redo } = usePaintHistory(canvasRef, ctxRef);
    useEffect(() => {
        snapshotRef.current = snapshot;
    }, [snapshot, snapshotRef]);

    // Shape drawing
    const {
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
    } = usePaintShapeDrawing({ canvasRef, lineWidth, lineOpacity, lineColor, bgColor, selectedShapePreset });

    // File actions
    const {
        fileName,
        setFileName,
        playMinimize,
        handleSaveAsConfirm,
        handleOpenFile,
    } = usePaintFileActions(canvasRef, ctxRef, snapshot, onStatusChange, saveAsOpen, setSaveAsOpen);

    const handleOpenFileRef = useRef(handleOpenFile);
    useEffect(() => {
        handleOpenFileRef.current = handleOpenFile;
    }, [handleOpenFile]);

    // Selection
    const {
        selStartRef,
        isDraggingSelectionRef,
        dragOffsetRef,
        cleanCanvasRef,
        freeSelectPathRef,
        freeSelectClipPathRef,
    } = usePaintSelection({
        tool,
        bgColor,
        ctxRef,
        selection,
        setSelection,
        selectionData,
        setSelectionData,
        snapshot,
        setTool,
    });

    // Tool side effects — clear, download, undo, redo, open, invert
    useEffect(() => {
        if (!canvasRef.current || !ctxRef.current) return;
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (tool === 'clear') {
            snapshot();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setTimeout(() => setTool('pencil'), 0);
        } else if (tool === 'download') {
            const a = document.createElement('a');
            a.download = 'drawing.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
            setTimeout(() => setTool('pencil'), 0);
        } else if (tool === 'undo') {
            undo();
            setTimeout(() => setTool('pencil'), 0);
        } else if (tool === 'redo') {
            redo();
            setTimeout(() => setTool('pencil'), 0);
        } else if (tool === 'open') {
            handleOpenFileRef.current();
            setTimeout(() => setTool('pencil'), 0);
        } else if (tool === 'invert') {
            if (invertedRef.current) { invertedRef.current = false; return; }
            invertedRef.current = true;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            ctx.putImageData(imageData, 0, 0);
            setTimeout(() => setTool('pencil'), 0);
        }
    }, [tool, canvasRef, ctxRef, setTool, snapshot, undo, redo]);

    // Canvas panning (middle mouse + drag)
    const { isPanningRef, panStartRef } = usePaintPanning(canvasRef, pan, setPan, setZoom);

    /* ── Mouse Down ── */
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        if ((e as React.TouchEvent).touches?.length >= 2) return;
        const ctx = ctxRef.current;

        // Text tool
        if (tool === 'text') {
            if (textBoxPos) return;
            snapshot();
            const { x, y } = getCanvasXY(e);
            rectStartRef.current = { x, y };
            previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            return;
        }

        // Line tool
        if (tool === 'line') {
            snapshot();
            const { x, y } = getCanvasXY(e);
            lineStartRef.current = { x, y };
            previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            return;
        }

        // Curve tool
        if (tool === 'curve') {
            const { x, y } = getCanvasXY(e);
            if (curvePhaseRef.current === 0) {
                snapshot();
                curveStartRef.current = { x, y };
                previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            } else if (curvePhaseRef.current === 1) {
                curveCtrl1Ref.current = { x, y };
            } else if (curvePhaseRef.current === 2) {
                curveCtrl2Ref.current = { x, y };
            }
            return;
        }

        // Rectangle tool
        if (tool === 'rectangle') {
            snapshot();
            const { x, y } = getCanvasXY(e);
            rectStartRef.current = { x, y };
            previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            return;
        }

        // Rounded rectangle tool
        if (tool === 'roundedRectangle') {
            snapshot();
            const { x, y } = getCanvasXY(e);
            rectStartRef.current = { x, y };
            previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            return;
        }

        // Ellipse tool
        if (tool === 'ellipse') {
            snapshot();
            const { x, y } = getCanvasXY(e);
            rectStartRef.current = { x, y };
            previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            return;
        }

        // Polygon tool
        if (tool === 'polygon') {
            const { x, y } = getCanvasXY(e);
            const me = e as React.MouseEvent;

            // Double click — finalize
            if (me.detail === 2 && polygonPointsRef.current.length > 1) {
                const ctx = ctxRef.current;
                if (!ctx || !previewRef.current) return;
                ctx.putImageData(previewRef.current, 0, 0);
                drawPolygon(ctx, polygonPointsRef.current, true);
                polygonPointsRef.current = [];
                previewRef.current = null;
                return;
            }

            // First click — start
            if (polygonPointsRef.current.length === 0) {
                snapshot();
                previewRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            }

            polygonPointsRef.current = [...polygonPointsRef.current, { x, y }];
            return;
        }

        // Rect select tool
        if (tool === 'rectselect') {
            const { x, y } = getCanvasXY(e);
            cleanCanvasRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            previewRef.current = cleanCanvasRef.current;

            // Clicking inside existing selection — start drag
            if (selection &&
                x >= selection.x && x <= selection.x + selection.w &&
                y >= selection.y && y <= selection.y + selection.h
            ) {
                isDraggingSelectionRef.current = true;
                dragOffsetRef.current = { x: x - selection.x, y: y - selection.y };
                return;
            }

            // Start new selection
            isDraggingSelectionRef.current = false;
            selStartRef.current = { x, y };
            setSelection(null);
            setSelectionData(null);
            cleanCanvasRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            previewRef.current = cleanCanvasRef.current;
            return;
        }

        // Free select tool
        if (tool === 'freeselect') {
            const { x, y } = getCanvasXY(e);

            // Clicking inside existing selection — start drag
            if (selection &&
                x >= selection.x && x <= selection.x + selection.w &&
                y >= selection.y && y <= selection.y + selection.h
            ) {
                isDraggingSelectionRef.current = true;
                dragOffsetRef.current = { x: x - selection.x, y: y - selection.y };
                return;
            }

            // Start new free selection
            isDraggingSelectionRef.current = false;
            freeSelectPathRef.current = [{ x, y }];
            setSelection(null);
            setSelectionData(null);
            cleanCanvasRef.current = ctxRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            previewRef.current = cleanCanvasRef.current;
            return;
        }

        if (!ctx) return;

        // Move tool
        if (tool === 'move') {
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
        if (tool === 'zoom') {
            const me = e as React.MouseEvent;
            if (me.nativeEvent.button !== 2) {
                setZoom((z) => (z !== 1 ? 1 : Math.min(4, +(z * 1.1).toFixed(3))));
            }
            return;
        }

        // Bucket tool
        if (tool === 'bucket') {
            snapshot();
            const { x, y } = getCanvasXY(e);
            const hex = lineColor.replace('#', '');
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const a = Math.round((lineOpacity ?? 1) * 255);
            floodFill(ctx, x, y, [r, g, b, a], 8);
            setTool('pencil');
            return;
        }

        // Eyedropper tool
        if (tool === 'eyedropper') {
            const { x, y } = getCanvasXY(e);
            const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
            setLineColor('#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join(''));
            setTool('pencil');
            return;
        }

        // Freehand tools — pencil, brush, spray, eraser
        snapshot();
        const { x, y } = getCanvasXY(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
        ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
        startDrawing(e);
    };

    /* ── Mouse Move ── */
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCanvasXY(e);
        onStatusChange(`${Math.round(x)}, ${Math.round(y)}`);

        // Text tool — preview rectangle
        if (tool === 'text' && rectStartRef.current && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.putImageData(previewRef.current, 0, 0);
            const w = x - rectStartRef.current.x;
            const h = y - rectStartRef.current.y;
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([]);
            ctx.strokeRect(rectStartRef.current.x, rectStartRef.current.y, w, h);
            ctx.strokeStyle = '#000000';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(rectStartRef.current.x, rectStartRef.current.y, w, h);
            ctx.restore();
            return;
        }

        // Line preview
        if (tool === 'line' && lineStartRef.current && previewRef.current) {
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

        // Curve preview
        if (tool === 'curve' && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            if (curvePhaseRef.current === 0 && curveStartRef.current) {
                ctx.putImageData(previewRef.current, 0, 0);
                ctx.lineWidth = lineWidth;
                ctx.globalAlpha = lineOpacity;
                ctx.strokeStyle = lineColor;
                ctx.beginPath();
                ctx.moveTo(curveStartRef.current.x, curveStartRef.current.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            } else if (curvePhaseRef.current === 1) {
                curveCtrl1Ref.current = { x, y };
                ctx.putImageData(previewRef.current, 0, 0);
                drawCurve(ctx);
            } else if (curvePhaseRef.current === 2) {
                curveCtrl2Ref.current = { x, y };
                ctx.putImageData(previewRef.current, 0, 0);
                drawCurve(ctx);
            }
            return;
        }

        // Rectangle preview
        if (tool === 'rectangle' && rectStartRef.current && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.putImageData(previewRef.current, 0, 0);
            const shift = (e as React.MouseEvent).shiftKey;
            drawRect(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
            return;
        }

        // Rounded rectangle preview
        if (tool === 'roundedRectangle' && rectStartRef.current && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.putImageData(previewRef.current, 0, 0);
            const shift = (e as React.MouseEvent).shiftKey;
            drawRoundedRect(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
            return;
        }

        // Ellipse preview
        if (tool === 'ellipse' && rectStartRef.current && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.putImageData(previewRef.current, 0, 0);
            const shift = (e as React.MouseEvent).shiftKey;
            drawEllipse(ctx, rectStartRef.current.x, rectStartRef.current.y, x, y, shift);
            return;
        }

        // Polygon preview
        if (tool === 'polygon' && polygonPointsRef.current.length > 0 && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.putImageData(previewRef.current, 0, 0);
            drawPolygon(ctx, [...polygonPointsRef.current, { x, y }]);
            return;
        }

        // Rect select preview
        if (tool === 'rectselect' && selStartRef.current && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            ctx.putImageData(previewRef.current, 0, 0);
            const w = x - selStartRef.current.x;
            const h = y - selStartRef.current.y;
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([]);
            ctx.strokeRect(selStartRef.current.x, selStartRef.current.y, w, h);
            ctx.strokeStyle = '#000000';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(selStartRef.current.x, selStartRef.current.y, w, h);
            ctx.restore();
            return;
        }

        // Rect select / free select drag
        if ((tool === 'rectselect' || tool === 'freeselect') && isDraggingSelectionRef.current && selection && selectionData) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const newX = x - dragOffsetRef.current.x;
            const newY = y - dragOffsetRef.current.y;
            ctx.putImageData(previewRef.current!, 0, 0);
            if (!transparentBg) {
                ctx.fillStyle = bgColor;
                if (tool === 'freeselect' && freeSelectClipPathRef.current.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(freeSelectClipPathRef.current[0].x, freeSelectClipPathRef.current[0].y);
                    freeSelectClipPathRef.current.forEach(p => ctx.lineTo(p.x, p.y));
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
                }
            }
            ctx.putImageData(selectionData, newX, newY);
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([]);
            ctx.strokeRect(newX, newY, selection.w, selection.h);
            ctx.strokeStyle = '#000000';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(newX, newY, selection.w, selection.h);
            ctx.restore();
            return;
        }

        // Draw active selection border when hovering
        if ((tool === 'rectselect' || tool === 'freeselect') && selection && !selStartRef.current && !isDraggingSelectionRef.current) {
            const ctx = ctxRef.current;
            if (!ctx || !cleanCanvasRef.current) return;
            ctx.putImageData(cleanCanvasRef.current, 0, 0);
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([]);
            ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
            ctx.strokeStyle = '#000000';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
            ctx.restore();
        }

        // Free select preview
        if (tool === 'freeselect' && freeSelectPathRef.current.length > 0 && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const path = freeSelectPathRef.current;
            freeSelectPathRef.current = [...path, { x, y }];
            ctx.putImageData(previewRef.current, 0, 0);
            ctx.save();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            freeSelectPathRef.current.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
            ctx.strokeStyle = '#000000';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            freeSelectPathRef.current.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
            ctx.restore();
            return;
        }

        draw(e);
    };

    /* ── Mouse Up ── */
    const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        if ((e as React.TouchEvent).touches?.length >= 2) return;

        // Text tool — finalize rectangle
        if (tool === 'text' && rectStartRef.current && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const { x, y } = getCanvasXY(e);
            const sx = Math.min(rectStartRef.current.x, x);
            const sy = Math.min(rectStartRef.current.y, y);
            const sw = Math.abs(x - rectStartRef.current.x);
            const sh = Math.abs(y - rectStartRef.current.y);
            ctx.putImageData(previewRef.current, 0, 0);
            if (sw > 5 && sh > 5) {
                setTextBoxPos({ x: sx, y: sy, w: sw, h: sh });
            }
            rectStartRef.current = null;
            previewRef.current = null;
            return;
        }

        // Line finalize
        if (tool === 'line' && lineStartRef.current && previewRef.current) {
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

        // Curve finalize
        if (tool === 'curve') {
            const { x, y } = getCanvasXY(e);
            const ctx = ctxRef.current;
            if (!ctx) return;
            if (curvePhaseRef.current === 0 && curveStartRef.current) {
                curveEndRef.current = { x, y };
                curveCtrl1Ref.current = { x, y };
                curveCtrl2Ref.current = { x, y };
                ctx.putImageData(previewRef.current!, 0, 0);
                drawCurve(ctx);
                previewRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                curvePhaseRef.current = 1;
            } else if (curvePhaseRef.current === 1) {
                ctx.putImageData(previewRef.current!, 0, 0);
                drawCurve(ctx);
                previewRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                curvePhaseRef.current = 2;
            } else if (curvePhaseRef.current === 2) {
                ctx.putImageData(previewRef.current!, 0, 0);
                drawCurve(ctx);
                curvePhaseRef.current = 0;
                curveStartRef.current = null;
                curveEndRef.current = null;
                curveCtrl1Ref.current = null;
                curveCtrl2Ref.current = null;
                previewRef.current = null;
            }
            return;
        }

        // Rectangle finalize
        if (tool === 'rectangle' && rectStartRef.current && previewRef.current) {
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
        if (tool === 'roundedRectangle' && rectStartRef.current && previewRef.current) {
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
        if (tool === 'ellipse' && rectStartRef.current && previewRef.current) {
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

        // Rect select finalize
        if (tool === 'rectselect' && selStartRef.current && previewRef.current) {
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

        // Select drag finalize (rect + free)
        if ((tool === 'rectselect' || tool === 'freeselect') && isDraggingSelectionRef.current && selection && selectionData) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const { x, y } = getCanvasXY(e);
            const newX = x - dragOffsetRef.current.x;
            const newY = y - dragOffsetRef.current.y;
            snapshot();
            if (!transparentBg) {
                ctx.fillStyle = bgColor;
                if (tool === 'freeselect' && freeSelectClipPathRef.current.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(freeSelectClipPathRef.current[0].x, freeSelectClipPathRef.current[0].y);
                    freeSelectClipPathRef.current.forEach(p => ctx.lineTo(p.x, p.y));
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
                }
            }
            ctx.putImageData(selectionData, newX, newY);
            cleanCanvasRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            previewRef.current = cleanCanvasRef.current;
            setSelection({ x: newX, y: newY, w: selection.w, h: selection.h });
            isDraggingSelectionRef.current = false;
            return;
        }

        // Free select finalize
        if (tool === 'freeselect' && freeSelectPathRef.current.length > 1 && previewRef.current) {
            const ctx = ctxRef.current;
            if (!ctx) return;
            const path = freeSelectPathRef.current;
            const xs = path.map(p => p.x);
            const ys = path.map(p => p.y);
            const sx = Math.floor(Math.min(...xs));
            const sy = Math.floor(Math.min(...ys));
            const sw = Math.ceil(Math.max(...xs)) - sx;
            const sh = Math.ceil(Math.max(...ys)) - sy;
            if (sw > 0 && sh > 0) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = sw;
                tempCanvas.height = sh;
                const tempCtx = tempCanvas.getContext('2d')!;
                tempCtx.beginPath();
                tempCtx.moveTo(path[0].x - sx, path[0].y - sy);
                path.forEach(p => tempCtx.lineTo(p.x - sx, p.y - sy));
                tempCtx.closePath();
                tempCtx.clip();
                const sourceCanvas = document.createElement('canvas');
                sourceCanvas.width = sw;
                sourceCanvas.height = sh;
                const sourceCtx = sourceCanvas.getContext('2d')!;
                sourceCtx.putImageData(ctx.getImageData(sx, sy, sw, sh), 0, 0);
                tempCtx.drawImage(sourceCanvas, 0, 0);
                const data = tempCtx.getImageData(0, 0, sw, sh);
                setSelectionData(data);
                setSelection({ x: sx, y: sy, w: sw, h: sh });
                ctx.putImageData(previewRef.current!, 0, 0);
                cleanCanvasRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                previewRef.current = cleanCanvasRef.current;
            }
            freeSelectClipPathRef.current = path;
            freeSelectPathRef.current = [];
            return;
        }

        endDrawing();

        // Keep cleanCanvasRef up to date after any drawing
        if (canvasRef.current && ctxRef.current) {
            cleanCanvasRef.current = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className={`draw-area-outer${zoom > 1 ? ' is-zoomed' : ''}`}>
            <div className='draw-area-arrows-h' />
            <div className='draw-area-shadow' />
            <section
                className={`draw-area${zoom > 1 ? ' is-zoomed' : ''}`}
                data-tool={tool}
                style={{ '--zoom': zoom, '--pan-x': `${pan.x}px`, '--pan-y': `${pan.y}px` } as React.CSSProperties}
            >
                <canvas
                    id='draw-canvas'
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={(e) => {
                        handleMouseUp(e);
                        onStatusChange(tool.charAt(0).toUpperCase() + tool.slice(1));
                        onStatusChange('__clear_coords__');
                    }}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                    onTouchCancel={handleMouseUp}
                    onContextMenu={(e) => {
                        if (tool === 'zoom') {
                            e.preventDefault();
                            setZoom((z) => Math.max(0.25, +(z * 0.9).toFixed(3)));
                        }
                    }}
                />

                {showGrid && (
                    <div
                        className='canvas-grid'
                        style={{
                            width: canvasWidth * zoom,
                            height: canvasHeight * zoom,
                        }}
                    />
                )}

                {textBoxPos && (
                    <TextBox
                        x={textBoxPos.x}
                        y={textBoxPos.y}
                        w={textBoxPos.w}
                        h={textBoxPos.h}
                        zoom={zoom}
                        pan={pan}
                        canvasRef={canvasRef}
                        lineColor={lineColor}
                        transparentBg={transparentBg}
                        bgColor={bgColor}
                        onCommit={(text, fontFamily, fontSize, bold, italic, underline) => {
                            const ctx = ctxRef.current;
                            const pos = textBoxPos;
                            if (!ctx || !text.trim() || !pos) {
                                setTextBoxPos(null);
                                return;
                            }
                            // snapshot() was already called in handleMouseDown
                            ctx.save();
                            ctx.globalAlpha = 1;
                            if (!transparentBg) {
                                ctx.fillStyle = bgColor;
                                ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
                            }
                            ctx.fillStyle = lineColor;
                            ctx.font = `${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${fontSize}px ${fontFamily}`;
                            const lines = text.split('\n');
                            lines.forEach((line, i) => {
                                ctx.fillText(line, pos.x, pos.y + fontSize + (i * fontSize * 1.2));
                            });
                            // Canvas API does not support underline natively — draw manually
                            if (underline) {
                                lines.forEach((line, i) => {
                                    const textWidth = ctx.measureText(line).width;
                                    ctx.strokeStyle = lineColor;
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(pos.x, pos.y + fontSize + (i * fontSize * 1.2) + 2);
                                    ctx.lineTo(pos.x + textWidth, pos.y + fontSize + (i * fontSize * 1.2) + 2);
                                    ctx.stroke();
                                });
                            }
                            ctx.restore();
                            setTextBoxPos(null);
                        }}
                        onCancel={() => setTextBoxPos(null)}
                    />
                )}
            </section>

            {/* Save As dialog */}
            {saveAsOpen && (
                <div
                    className={`notepad-dialog-backdrop ${saveAsOpen ? 'is-open' : ''}`}
                    onClick={() => setSaveAsOpen(false)}
                >
                    <div
                        className={`xp-dialog notepad-dialog ${saveAsOpen ? 'is-open' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='save-as-title'
                    >
                        <div className='title-bar'>
                            <div className='title-bar-text' id='save-as-title'>Save As</div>
                            <div className='title-bar-buttons'>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => { playMinimize(); setSaveAsOpen(false); }}
                                    aria-label='Close'
                                >
                                    &#215;
                                </button>
                            </div>
                        </div>
                        <div className='notepad-dialog-body'>
                            <label htmlFor='filename-input'>File name:</label>
                            <input
                                id='filename-input'
                                type='text'
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className='notepad-dialog-actions'>
                            <button type='button' onClick={handleSaveAsConfirm}>Save</button>
                            <button type='button' onClick={() => { playMinimize(); setSaveAsOpen(false); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Canvas;