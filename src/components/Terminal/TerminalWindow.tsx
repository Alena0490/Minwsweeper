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
    const [bgColor, setBgColor] = useState('#000000')
    const [textColor, setTextColor] = useState('#c0c0c0')

    const bottomRef = useRef<HTMLDivElement>(null)

    const colorMap: Record<string, string> = {
        '0': '#000000',
        '1': '#000080',
        '2': '#008000',
        '3': '#FF69B4',
        '4': '#800000',
        '5': '#962EFF',
        '6': '#FF8000',
        '7': '#c0c0c0',
        '8': '#808080',
        '9': '#FF0000',
        'a': '#00ff00',
        'b': '#00ffff',
        'c': '#FF00FF',
        'd': '#8B4513',
        'e': '#ffff00',
        'f': '#ffffff',
    }

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
                '  date     - Show date',   // working
                '  time     - Show time',   // working
                '  exit     - Close window', // working
                '  systeminfo - Show system information', // working
                '  color      - Change terminal color',
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
        } else if (trimmed === 'systeminfo') {
            newLines.push(
                'Host Name:                 ALENA-PC',
                'OS Name:                   Microsoft Windows XP Professional',
                'OS Version:                5.1.2600 Service Pack 2',
                'OS Manufacturer:           Microsoft Corporation',
                'System Type:               X86-based PC',
                'Total Physical Memory:     512 MB',
                '',
                '--- Developer Info ---',
                'Name:                      Alena Pumprová',
                'Role:                      Frontend Developer',
                'Skills:                    React, TypeScript, CSS',
                'GitHub:                    github.com/Alena0490',
                'Portfolio:                 alena-pumprova.cz',
                ''
            )
        } else if (trimmed === 'color') {
            newLines.push(
                'Sets the default console foreground and background colors.',
                '',
                'COLOR [attr]',
                '',
                '  0 = Black       8 = Dark Gray',
                '  1 = Dark Blue   9 = Red',
                '  2 = Dark Green  A = Light Green',
                '  3 = Pink        B = Light Blue',
                '  4 = Dark Red    C = Magenta',
                '  5 = Purple      D = Brown',
                '  6 = Orange      E = Yellow',
                '  7 = Gray        F = White',
                '',
                'Example: color 0A  (black background, green text)',
                ''
            )
        } else if (trimmed.startsWith('color ')) {
            const code = trimmed.slice(6).toLowerCase()
            if (code.length === 2 && colorMap[code[0]] && colorMap[code[1]]) {
                setBgColor(colorMap[code[0]])
                setTextColor(colorMap[code[1]])
                newLines.push('')
            } else {
                newLines.push('Invalid color code.', '')
            }
        } else {
            newLines.push(`'${trimmed}' is not recognized as an internal or external command,`, 'operable program or batch file.', '')
        }

        setLines(newLines)
    }

    return (
        <div className="terminal-body-outer">
            <div 
                className='terminal-body' 
                style={{ 
                    backgroundColor: bgColor, 
                    color: textColor,
                    ['--terminal-text' as string]: textColor 
            }}
            >
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
        </div>
    )
}

export default TerminalWindow