import { useState, useEffect, useRef } from 'react';
import FontToolbar from './FontToolbar';
import './TextTool.css';

interface TextBoxProps {
    x: number;
    y: number;
    w: number;
    h: number;
    zoom: number;
    lineColor: string;
    transparentBg: boolean;
    bgColor: string;
    onCommit: (
        text: string,
        fontFamily: string,
        fontSize: number,
        bold: boolean,
        italic: boolean,
        underline: boolean,
        width: number,
        height: number
    ) => void;
    onCancel: () => void;
    pan: { x: number; y: number };
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const TextBox = ({
    x,
    y,
    w,
    h,
    zoom,
    lineColor,
    transparentBg,
    bgColor,
    onCommit,
    onCancel,
    pan,
    canvasRef,
}: TextBoxProps) => {
    const [text, setText] = useState('');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(12);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [textWay, setTextWay] = useState<'vertical' | 'horizontal'>('horizontal');
    const [toolbarPlacement, setToolbarPlacement] = useState<'top' | 'bottom'>('top');
    const [screenBox, setScreenBox] = useState({ left: 0, top: 0, width: 0, height: 0 });

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textBoxRef = useRef<HTMLDivElement>(null);

    // Refs to always have latest values in event handlers without re-registering listeners
    const textRef = useRef(text);
    useEffect(() => { textRef.current = text; }, [text]);

    const fontFamilyRef = useRef(fontFamily);
    useEffect(() => { fontFamilyRef.current = fontFamily; }, [fontFamily]);

    const fontSizeRef = useRef(fontSize);
    useEffect(() => { fontSizeRef.current = fontSize; }, [fontSize]);

    const boldRef = useRef(bold);
    useEffect(() => { boldRef.current = bold; }, [bold]);

    const italicRef = useRef(italic);
    useEffect(() => { italicRef.current = italic; }, [italic]);

    const underlineRef = useRef(underline);
    useEffect(() => { underlineRef.current = underline; }, [underline]);

    // Keep stable refs to callbacks to avoid re-registering listeners on every render
    const onCommitRef = useRef(onCommit);
    useEffect(() => { onCommitRef.current = onCommit; }, [onCommit]);

    const onCancelRef = useRef(onCancel);
    useEffect(() => { onCancelRef.current = onCancel; }, [onCancel]);

    // Focus textarea on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Commit on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.xp-toolbox')) return;
            if (textBoxRef.current && !textBoxRef.current.contains(e.target as Node)) {
                onCommitRef.current(
                    textRef.current,
                    fontFamilyRef.current,
                    fontSizeRef.current,
                    boldRef.current,
                    italicRef.current,
                    underlineRef.current,
                    textareaRef.current?.offsetWidth ?? 0,
                    textareaRef.current?.offsetHeight ?? 0
                );
            }
        };
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // empty — all values accessed via refs

    // Cancel on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancelRef.current();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // empty — onCancel accessed via ref

    // Calculate screen position from canvas coordinates
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = (rect.width / canvas.width) * zoom;
        const scaleY = (rect.height / canvas.height) * zoom;
        const nextScreenBox = {
            left: x * scaleX + pan.x,
            top: y * scaleY + pan.y,
            width: w * scaleX,
            height: h * scaleY,
        };
        setScreenBox(nextScreenBox);
        setToolbarPlacement(nextScreenBox.top < 59 ? 'bottom' : 'top');
    }, [x, y, w, h, zoom, pan, canvasRef]);

    return (
        <div
            className='text-overlay'
            ref={textBoxRef}
            style={{ left: screenBox.left, top: screenBox.top }}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                if (
                    target === textareaRef.current ||
                    target.tagName === 'SELECT' ||
                    target.tagName === 'INPUT' ||
                    target.tagName === 'OPTION'
                ) return;
                e.preventDefault();
            }}
        >
            <FontToolbar
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                fontSize={fontSize}
                setFontSize={setFontSize}
                bold={bold}
                setBold={setBold}
                italic={italic}
                setItalic={setItalic}
                underline={underline}
                setUnderline={setUnderline}
                textWay={textWay}
                setTextWay={setTextWay}
                onClose={onCancel}
                placement={toolbarPlacement}
            />
            <textarea
                ref={textareaRef}
                className='paint-textarea'
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                    width: w * zoom,
                    height: h * zoom,
                    writingMode: textWay === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
                    fontFamily,
                    fontSize,
                    fontWeight: bold ? 'bold' : 'normal',
                    fontStyle: italic ? 'italic' : 'normal',
                    textDecoration: underline ? 'underline' : 'none',
                    color: lineColor,
                    background: transparentBg ? 'transparent' : bgColor,
                }}
            />
        </div>
    );
};

export default TextBox;