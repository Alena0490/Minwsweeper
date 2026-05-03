import { useState, useEffect, useRef } from 'react'
import Logo from '../img/logo.webp'
import './ShutdownDisplay.css'

interface ShutdownDisplayProps {
    action: 'switchuser' | 'logoff' | 'standby' | 'turnoff' | 'restart'
    onDone: () => void
}

const LOGOFF_MESSAGES = [
    'Saving your settings...',
    'Logging off...',
]

const TURNOFF_MESSAGES = [
    'Saving your settings...',
    'Logging off...',
    'Windows is shutting down...',
]

const ShutdownDisplay = ({ action, onDone }: ShutdownDisplayProps) => {
    const messages = (action === 'logoff' || action === 'switchuser')
        ? LOGOFF_MESSAGES
        : TURNOFF_MESSAGES

    const [messageIndex, setMessageIndex] = useState(0)

    const onDoneRef = useRef(onDone)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => {
                if (prev < messages.length - 1) return prev + 1
                clearInterval(interval)
                return prev
            })
        }, 1500)

        const timeout = setTimeout(() => {
            onDoneRef.current()
        }, messages.length * 1500 + 500)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return (
    <div className='shutdown-display'>
        <div className="shutdown-top"></div>
        <div className="shutdown-middle">
             <div className="logo shutdown-logo">
                <img src={Logo} className="xp-logo" alt="" aria-hidden="true" />
                <span className="tm">™</span>
                <p className="top">Microsoft</p>
                <p className="mid">Windows<sup className="reg-mark">®</sup><span>xp</span></p>
            </div>
            <p className="shutdown-message">{messages[messageIndex]}</p>
        </div>
        <div className="shutdown-bottom"></div>
    </div>
  )
}

export default ShutdownDisplay
