import { useState } from 'react'
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

const IEWindow = ({ onClose }: { onClose: () => void }) => {
    const [isMinimized, setIsMinimized] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    return (
        <div className={`ie-window ${isMinimized ? 'minimized' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
            <div className='title-bar'>
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
                        <li>File</li>
                        <li>Edit</li>
                        <li>View</li>
                        <li>Favourites</li>
                        <li>Tools</li>
                        <li>Help</li>
                    </ul>
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
                            <span>Address</span>
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
            <iframe 
                src="https://alena-pumprova.cz/"
                width="100%"
                height="100%"
                title="Internet Explorer"
            />
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