import { useState } from 'react'
import useDraggable from '../hooks/useDraggable'
import Logo from '../img/logo2.webp'
import InternetIcon from '../img/InternetShortcut.webp'
import URL from '../img/URL.webp'
import Back from '../img/Back.webp'
import Forward from '../img/Forward.webp'
import Refresh from '../img/IERefresh.webp'
import Stop from '../img/IEStop.webp'
import Home from '../img/IEHome.webp'
import Search from '../img/Search.webp'
import Favourites from '../img/Favourites.webp'
import History from '../img/IEHistory.webp'
import Mail from '../img/Email.webp'
import Printer from '../img/Printer.webp'
import Edit from '../img/IEEdit.webp'
import Discuss from '../img/IEDiscuss.webp'
import Go from '../img/Go.webp'
import './IEWindow.css'

interface IEWindowProps {
    onClose: () => void;
}

const IEWindow = ({ onClose }: IEWindowProps) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { position, handleMouseDown } = useDraggable(200, 100);

    return (
        <div 
            className={`ie-window ${isMinimized ? 'ie-window--minimized' : ''} ${isFullscreen ? 'ie-window--fullscreen' : ''}`}
            style={{ left: position.x, top: position.y }}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <div className="title">
                    <img  className="browser-icon" src={URL} alt="Internet Link Icon" />
                    <span className='title-bar-text'>Alena Pumprová – Microsoft Internet Explorer</span>
                </div>
                 <div className='title-bar-buttons'>
                    <button
                        className='btn-minimize'
                        onClick={() => setIsMinimized(true)}
                        type="button"
                    >
                        _
                    </button>
                    <button
                        className='btn-maximize'
                        onClick={() => {
                        setIsMinimized(false);
                        setIsFullscreen(prev => !prev);
                        }}
                        type="button"
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>

                    <button
                        className='btn-close'
                        onClick={() => setIsMinimized(true)}
                        type="button"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    </div>
            </div>
            <div className="ie-toolbars">
                <div className='ie-menu'>
                    <ul>
                        <li><span className="mnemonic">F</span>ile</li>
                        <li><span className="mnemonic">E</span>dit</li>
                        <li><span className="mnemonic">V</span>iew</li>
                        <li>F<span className="mnemonic">a</span>vourites</li>
                        <li><span className="mnemonic">T</span>ools</li>
                        <li><span className="mnemonic">H</span>elp</li>
                    </ul>
                    <div className='windows-corner-panel'>
                        <img className='windows-corner-icon' src={Logo} alt="Internet Explorer Logo" />
                    </div>
                </div>
                <div className='ie-toolbar'>
                    <div className="ie-toolbar-top">
                        <button className='toolbar-btn' aria-label='go back'>
                            <img className='toolbar-img' src={Back} alt="Back" />
                            Back
                        </button>
                        <button className='toolbar-btn disabled' aria-label='go forward'>
                            <img className='toolbar-img' src={Forward} alt="Forward" />
                            Forward
                        </button>
                        <button className='toolbar-btn' aria-label='refresh'>
                            <img className='toolbar-img' src={Refresh} alt="Refresh" />
                        </button>
                        <button className='toolbar-btn' aria-label='stop'>
                            <img className='toolbar-img' src={Stop} alt="Stop" />
                        </button>
                        <button className='toolbar-btn border-right' aria-label='go home'>
                            <img className='toolbar-img' src={Home} alt="Home" />
                            Home
                        </button>
                        <button className='toolbar-btn' aria-label='search'>
                            <img className='toolbar-img' src={Search} alt="Search" />
                            Search
                        </button>
                        <button className='toolbar-btn' aria-label='favourites'>
                            <img className='toolbar-img' src={Favourites} alt="Favourites" />
                            Favourites
                        </button>
                        <button className='toolbar-btn border-right' aria-label='view history'>
                            <img className='toolbar-img' src={History} alt="History" />
                            History
                        </button>
                        <button className='toolbar-btn' aria-label='mail'>
                            <img className='toolbar-img' src={Mail} alt="Mail" />
                        </button>
                        <button className='toolbar-btn' aria-label='print'>
                            <img className='toolbar-img' src={Printer} alt="Print" />
                        </button>
                        <button className='toolbar-btn' aria-label='edit page'>
                            <img className='toolbar-img' src={Edit} alt="Edit" />
                        </button>
                        <button className='toolbar-btn' aria-label='discuss'>
                            <img className='toolbar-img' src={Discuss} alt="Discuss" />
                        </button>
                    </div>
                    <div className="ie-toolbar-bottom">
                        <div className="left">
                            <span>A<span className="mnemonic">d</span>dress</span>
                            <div className="input-wrapper">
                                <img className='toolbar-img-small absolute' src={URL} alt="URL Icon" />
                                <input 
                                    type="text" 
                                    className='address-bar' 
                                    defaultValue="https://alena-pumprova.cz/"
                                />
                            </div>
                        </div>
                        <div className="right">
                            <button className='toolbar-btn' aria-label='go to address'>
                                <img className='toolbar-img-small' src={Go} alt="Go" />
                                Go
                            </button>
                            <button className='toolbar-btn' aria-label='view links'>
                                Links
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-window-outer">
                 <div className="page-window-wrap">
                    <iframe
                        className="page-window"
                        src="https://alena-pumprova.cz/"
                        title="Internet Explorer"
                        scrolling="no"
                    />
                </div>    
            </div>       
            <div className='ie-statusbar'>
                <img src={URL} alt="URL Icon" />
                <span className='status-text'>
                    <img src={InternetIcon} alt="Internet Icon" />
                    Internet
                </span>
            </div>
        </div>
    )
}

export default IEWindow