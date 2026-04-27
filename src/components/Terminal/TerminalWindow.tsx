import { useState, useRef, useEffect } from 'react'
import './Terminal.css'

interface TerminalWindowProps {
    onClose: () => void;
    apps: string[];
}

const WELCOME = [
    'Microsoft Windows XP [Version 5.1.2600]',
    '(C) Copyright 1985-2001 Microsoft Corp.',
    '',
]

const TerminalWindow = ({ onClose, apps }: TerminalWindowProps) => {
    const [lines, setLines] = useState<string[]>(WELCOME)
    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [lines])

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase()
        const newLines = [...lines, `C:\\>${cmd}`]

        if (trimmed === 'cls') {
            setLines([])
            return
        }

        if (trimmed === 'help') {
            newLines.push(
                'Available commands:',
                '  help     - Show this help',
                '  cls      - Clear screen',
                '  dir      - List files',
                '  echo     - Print text',
                '  ver      - Show version',
                '  date     - Show date',
                '  time     - Show time',
                '  exit     - Close window',
                ''
            )
        } else if (trimmed === 'ver') {
            newLines.push('Microsoft Windows XP [Version 5.1.2600]', '')
        } else if (trimmed === 'date') {
            newLines.push(new Date().toLocaleDateString(), '')
        } else if (trimmed === 'time') {
            newLines.push(new Date().toLocaleTimeString(), '')
        } else if (trimmed === 'dir') {
            newLines.push(
                ' Volume in drive C has no label.',
                ' Directory of C:\\',
                '',
                ...apps.map(app => `28/04/2003  09:00    <DIR>          ${app}`),
                `               0 File(s)              0 bytes`,
                `               ${apps.length} Dir(s)   4,096,000 bytes free`,
                ''
            )
        } else if (trimmed.startsWith('echo ')) {
            newLines.push(cmd.slice(5), '')
        } else if (trimmed === '') {
            newLines.push('')
        } else if (trimmed === 'exit') {
            onClose()
            return
        } else {
            newLines.push(`'${trimmed}' is not recognized as an internal or external command,`, 'operable program or batch file.', '')
        }

        setLines(newLines)
    }

    return (
        <div className='terminal-body'>
            <div className='terminal-output'>
                {lines.map((line, i) => (
                    <div key={i}>{line || '\u00A0'}</div>
                ))}
                <div className='terminal-input-row'>
                    <span>C:\&gt;</span>
                    <input
                        className='terminal-input'
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleCommand(input)
                                setInput('')
                            }
                        }}
                        autoFocus
                        spellCheck={false}
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

export default TerminalWindow