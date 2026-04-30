import { useState, useRef, useEffect, useCallback } from 'react'

declare global {
    interface Window {
        showSaveFilePicker: (options?: object) => Promise<FileSystemFileHandle>
    }
}
interface NotepadAppProps {
    showStatusBar: boolean;
    wordWrap: boolean;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    openRef: React.RefObject<() => void>;
    onSaved: (name: string) => void
    saveAsOpen: boolean;
    setSaveAsOpen: (value: boolean) => void;
    fileName: string;
    setFileName: (value: string) => void;
    undoRef: React.RefObject<() => void>;
    redoRef: React.RefObject<() => void>;
    onHistoryChange: (canUndo: boolean, canRedo: boolean) => void
}

const NotepadApp = ({ 
    showStatusBar, 
    wordWrap, 
    textareaRef,
    saveAsOpen,
    openRef,
    setSaveAsOpen,
    onSaved,
    fileName,
    setFileName,
    undoRef,
    redoRef,
    onHistoryChange
}: NotepadAppProps) => {
    const [text, setText] = useState('');
    const [cursor, setCursor] = useState({ ln: 1, col: 1 });
    const [history, setHistory] = useState<string[]>(['']);
    const [historyIndex, setHistoryIndex] = useState(0);
  
    const updateCursor = () => {
        const el = textareaRef.current
        if (!el) return
        const before = el.value.slice(0, el.selectionStart)
        const lines = before.split('\n')
        setCursor({
            ln: lines.length,
            col: lines[lines.length - 1].length + 1,
        })
    }

    // History
    const handleUndo = useCallback(() => {
        if (historyIndex === 0) return
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setText(history[newIndex])
    }, [history, historyIndex])

    const handleRedo = useCallback(() => {
        if (historyIndex >= history.length - 1) return
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setText(history[newIndex])
    }, [history, historyIndex])

    useEffect(() => {
        undoRef.current = handleUndo
        redoRef.current = handleRedo
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleUndo, handleRedo])

    useEffect(() => {
        onHistoryChange(historyIndex > 0, historyIndex < history.length - 1)
    }, [historyIndex, history.length, onHistoryChange])

    // Open File
    useEffect(() => {
        openRef.current = handleOpen
    })

    const handleOpen = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.txt,text/plain'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = (ev) => {
                const result = ev.target?.result
                if (typeof result !== 'string') return
                setText(result)
                setHistory([result])
                setHistoryIndex(0)
                onSaved(file.name)
            }
            reader.readAsText(file)
        }
        input.click()
    }

    // Save File
    const handleSave = () => {
        const safeName = fileName.trim() || 'Untitled.txt'
        const finalName = safeName.toLowerCase().endsWith('.txt') ? safeName : `${safeName}.txt`
        const blob = new Blob([text], { type: 'text/plain' })
        const a = document.createElement('a')
        a.download = finalName
        a.href = URL.createObjectURL(blob)
        a.click()
        URL.revokeObjectURL(a.href)
        onSaved(finalName)
        setSaveAsOpen(false)
    }

    useEffect(() => {
        textareaRef.current?.focus()
    }, [textareaRef])

    const scrollWrapperRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = textareaRef.current
        const wrapper = wrapperRef.current   // ← HLAVNÍ WRAPPER

        if (!el || !wrapper) return

        const check = () => {
            const hasVertical = el.scrollHeight > el.clientHeight
            const hasHorizontal = el.scrollWidth > el.clientWidth

            wrapper.classList.toggle('has-v-scroll', hasVertical)
            wrapper.classList.toggle('has-h-scroll', hasHorizontal)
            wrapper.classList.toggle('has-vh-scroll', hasVertical && hasHorizontal)

            wrapper.classList.toggle('has-vertical-scroll', hasVertical)
            wrapper.classList.toggle('has-horizontal-scroll', hasHorizontal)

            scrollWrapperRef.current?.classList.toggle('has-vertical-scroll', hasVertical)
        }

        check()
        el.addEventListener('input', check)
        window.addEventListener('resize', check)

        return () => {
            el.removeEventListener('input', check)
            window.removeEventListener('resize', check)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordWrap])

    return (
        <div className="notepad-app">
            <div className="xp-notepad-wrapper" ref={wrapperRef}>
                <div className="notepad-scroll-outer" ref={scrollWrapperRef}>
                    <textarea
                        ref={textareaRef}
                        className="xp-notepad"
                        spellCheck={false}
                        autoComplete="off"
                        value={text}
                        onChange={e => {
                            const newText = e.target.value
                            setText(newText)
                            const newHistory = history.slice(0, historyIndex + 1)
                            setHistory([...newHistory, newText])
                            setHistoryIndex(newHistory.length)
                        }}
                        onClick={updateCursor}
                        onKeyUp={updateCursor}
                        style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                    />
                </div>
            </div>
            {showStatusBar && (
                <div className="notepad-statusbar">
                    <div className="status sunken">Ln {cursor.ln}, Col {cursor.col}</div>
                    <div className="status sunken">{text.length} characters</div>
                    <div className="status sunken">100%</div>
                    <div className="status sunken">Windows (CRLF)</div>
                    <div className="status sunken">UTF-8</div>
                </div>
            )}

            {/* Save As dialog */}
            {saveAsOpen && (
                <div
                    className={`notepad-dialog-backdrop ${saveAsOpen ? 'is-open' : ''}`}
                    onClick={() => setSaveAsOpen(false)}
                >
                    <div
                        className={`xp-dialog notepad-dialog ${saveAsOpen ? 'is-open' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="save-as-title"
                    >
                        <div className="title-bar">
                            <div className="title-bar-text" id="save-as-title">
                                Save As
                            </div>
                            <div className="title-bar-buttons">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSaveAsOpen(false)}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="xp-dialog-body">
                            <label htmlFor="filename-input">File name:</label>
                            <input
                                id="filename-input"
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="xp-dialog-actions notepad-dialog-actions">
                            <button type="button" onClick={handleSave}>Save</button>
                            <button type="button" onClick={() => setSaveAsOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotepadApp