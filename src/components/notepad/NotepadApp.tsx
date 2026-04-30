import { useState, useRef, useEffect } from 'react'

interface NotepadAppProps {
    showStatusBar: boolean;
    wordWrap: boolean;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const NotepadApp = ({ showStatusBar, wordWrap, textareaRef }: NotepadAppProps) => {
    const [text, setText] = useState('')
    const [cursor, setCursor] = useState({ ln: 1, col: 1 })

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
    }, [textareaRef])

    const scrollWrapperRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = textareaRef.current
        const wrapper = scrollWrapperRef.current
        if (!el || !wrapper) return

        const check = () => {
            wrapper.classList.toggle('has-vertical-scroll', el.scrollHeight > el.clientHeight)
            wrapperRef.current?.classList.toggle('has-horizontal-scroll', el.scrollWidth > el.clientWidth)
        }

        check()
        el.addEventListener('input', check)
        window.addEventListener('resize', check)
        return () => {
            el.removeEventListener('input', check)
            window.removeEventListener('resize', check)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                        onChange={e => { setText(e.target.value);}}
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
        </div>
    )
}

export default NotepadApp