import { useState, useRef, useEffect } from 'react'
import './Terminal.css'

interface TerminalWindowProps {
    onClose: () => void;
    apps: { name: string; size: string }[];
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
                '  help     - Show this help', // working
                '  cls      - Clear screen', // working
                '  dir      - List files', // working
                '  echo     - Print text', // working
                '  ver      - Show version', // working
                '  date     - Show date',
                '  time     - Show time',
                '  exit     - Close window', // working
                ''
            )
        } else if (trimmed === 'ver') {
            newLines.push('Microsoft Windows XP [Version 5.1.2600]', '')
        } else if (trimmed === 'date') {
            const now = new Date()
            const day = now.toLocaleDateString('en-US', { weekday: 'short' })
            const date = now.toLocaleDateString('en-GB')
            newLines.push(
                `The current date is: ${day} ${date}`,
                'Enter the new date: (mm-dd-yy)',
                ''
            )
        } else if (trimmed === 'time') {
            const now = new Date()
            const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.00'
            newLines.push(
                `The current time is: ${time}`,
                'Enter the new time:',
                ''
            )
        } else if (trimmed.match(/^\d{2}-\d{2}-\d{2}$/) || trimmed.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
            newLines.push('')
        } else if (trimmed === 'dir') {
            newLines.push(
                ' Volume in drive C has no label.',
                ' Directory of C:\\',
                '',
                ...apps.map(app => `28/04/2003  09:00    <DIR>          ${app.name.padEnd(25)} ${app.size.padStart(10)} bytes`),
                `0 File(s)              ${'0 bytes'.padStart(20)}`,
                `${apps.length} Dir(s)  ${apps.reduce((sum, app) => sum + parseInt(app.size.replace(/,/g, '')), 0).toLocaleString('en-US')} bytes free`,
                ''
            )
        } else if (trimmed === 'echo') {
            newLines.push('ECHO is on.', '')
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