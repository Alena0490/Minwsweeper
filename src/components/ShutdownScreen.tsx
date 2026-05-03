import { useState } from 'react'

import Logo from '../img/logo.webp'
import SwitchUser from '../img/SwitchUser.webp'
import Standby from '../img/Standby.webp'
import Restart from '../img/Restart.webp'
import Power from '../img/Power.webp'
import Logout from '../img/Logout.webp'

import './ShutdownScreen.css'

interface ShutdownScreenProps {
    mode: 'logoff' | 'turnoff'
    onCancel: () => void
    onAction: (action: 'switchuser' | 'logoff' | 'standby' | 'turnoff' | 'restart') => void
}

const ShutdownScreen = ({ mode, onCancel, onAction }: ShutdownScreenProps) => {
    const [isAnimating, setIsAnimating] = useState(true)

    const handleCancel = () => {
        setIsAnimating(false)

        window.setTimeout(() => {
            onCancel()
        }, 700)
    }
  
    return (
    <div className={`shutdown-overlay ${isAnimating ? 'is-animating' : ''}`}>
        <div className="shutdown-modal">
            <div className="shutdown-top">
                <h2 className='logoff-action'>{mode === 'logoff' ? 'Log Off Windows' : 'Turn off computer'}</h2>
                <div className="logo-wrap">
                    <img src={Logo} alt="MS Windows logo" />
                    <span className='turnoff-tm'>TM</span>
                </div>
            </div>
            <div className="shutdown-middle">
                {mode === 'logoff' ? (
                    <>
                        <button type="button" className="shutdown-btn" onClick={() => onAction('switchuser')}>
                            <img src={SwitchUser} alt="Switch User" />
                            <span>Switch User</span>
                        </button>
                        <button type="button" className="shutdown-btn" onClick={() => onAction('logoff')}>
                            <img src={Logout} alt="Log Off" />
                            <span>Log Off</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button type="button" className="shutdown-btn" onClick={() => onAction('standby')}>
                            <img src={Standby} alt="Stand By" />
                            <span>Stand By</span>
                        </button>
                        <button type="button" className="shutdown-btn" onClick={() => onAction('turnoff')}>
                            <img src={Power} alt="Turn Off" />
                            <span>Turn Off</span>
                        </button>
                        <button type="button" className="shutdown-btn" onClick={() => onAction('restart')}>
                            <img src={Restart} alt="Restart" />
                            <span>Restart</span>
                        </button>
                    </>
                )}
            </div>
            <div className="shutdown-bottom">
                <button 
                    type="button"
                    onClick={handleCancel}
                >Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default ShutdownScreen