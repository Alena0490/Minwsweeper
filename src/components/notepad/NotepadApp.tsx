import { useState, useRef, useEffect } from 'react'

interface NotepadAppProps {
    showStatusBar: boolean
    wordWrap: boolean
}

const NotepadApp = ({ showStatusBar, wordWrap }: NotepadAppProps) => {
    const [text, setText] = useState('')
    const [cursor, setCursor] = useState({ ln: 1, col: 1 })
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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

    useEffect(() => {
        textareaRef.current?.focus()
    }, [])

    return (
        <div className="notepad-app">
            <div className="xp-notepad-wrapper">
                <textarea
                    ref={textareaRef}
                    className="xp-notepad"
                    spellCheck={false}
                    autoComplete="off"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onClick={updateCursor}
                    onKeyUp={updateCursor}
                    style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
                />
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
        </div>
    )
}

export default NotepadApp