// STATES
import { useState } from 'react'
import useDraggable from '../../hooks/useDraggable'
import { favourites } from '../../data/IEData'
import { blockedDomains } from '../../data/blockedDomains'

// COMPONENTS
import IEMenu from './IEMenu'
import IEFavourites from './IEFavourites'

// IMAGES
import Logo from '../../img/logo2.webp'
import InternetIcon from '../../img/InternetShortcut.webp'
import URL from '../../img/URL.webp'
import Back from '../../img/Back.webp'
import Forward from '../../img/Forward.webp'
import Refresh from '../../img/IERefresh.webp'
import Stop from '../../img/IEStop.webp'
import Home from '../../img/IEHome.webp'
import Search from '../../img/Search.webp'
import Favourites from '../../img/Favourites.webp'
import History from '../../img/IEHistory.webp'
import Mail from '../../img/Email.webp'
import Printer from '../../img/Printer.webp'
import Edit from '../../img/IEEdit.webp'
import Discuss from '../../img/IEDiscuss.webp'
import Go from '../../img/Go.webp'
import NetworkError from '../../img/netError.webp'

//STYLES
import '../../App.css'
import './IEWindow.css'

interface IEWindowProps {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void
}

const IEWindow = ({ 
    onClose, 
    isMinimized, 
    setIsMinimized, 
    isFullscreen, 
    toggleFullscreen,
    onMouseDown 
}: IEWindowProps) => {
    const HOME_URL = "https://web.archive.org/web/20031024040025if_/http://www.google.com/";

    const [history, setHistory] = useState([HOME_URL, "https://alena-pumprova.cz/"]);
    const [historyIndex, setHistoryIndex] = useState(1);
    const [inputUrl, setInputUrl] = useState("https://alena-pumprova.cz/");
    const [hasError, setHasError] = useState(false);
    const [showFavourites, setShowFavourites] = useState(false);
    const [showStatusBar, setShowStatusBar] = useState(true)
    const [showStandardToolbar, setShowStandardToolbar] = useState(true)
    const [showAddressBar, setShowAddressBar] = useState(true)
    const [iframeKey, setIframeKey] = useState(0);
    const [isStopped, setIsStopped] = useState(false);

    // const [openMenu, setOpenMenu] = useState<string | null>(null);

    const handleOpen = () => {
        const url = prompt('Open:')
        if (url) navigateTo(url)
    }

    const currentUrl = history[historyIndex];
    const { position, handleMouseDown } = useDraggable(200, 100);
    const handleRefresh = () => {
        setIsStopped(false)
        setIframeKey(prev => prev + 1)
    }
    const handleStop = () => setIsStopped(true);

    // Show current Favicon
    const getFavicon = (url: string): string => {
        for (const group of favourites) {
            const item = group.items.find(i => i.url === url)
            if (item) return item.icon
        }
        return URL 
    }

    // Show Page Title
    const getPageTitle = (url: string): string => {
    for (const group of favourites) {
        const item = group.items.find(i => i.url === url)
        if (item && item.title) {
            const title = item.title.length > 45 
                ? item.title.slice(0, 45) + '...' 
                : item.title
            return `${title} – Microsoft Internet Explorer`
        }
    }
        return 'Alena Pumprová – Microsoft Internet Explorer'
    }

    // Navigate to a new URL, updating history and resetting error state

    const navigateTo = (url: string) => {
        setHasError(false);
        setIsStopped(false)
        const isBlocked = blockedDomains.some(domain => url.includes(domain));
        
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, url]);
        setHistoryIndex(newHistory.length);
        setInputUrl(url);
        
        if (isBlocked) {
            setHasError(true);
        }
    };

    // Back button
    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setInputUrl(history[historyIndex - 1]);
        }
    };

    // Forward button
    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setInputUrl(history[historyIndex + 1]);
        }
    };

    // Cut, Copy & Paste
    const handleCut = async () => {
        await navigator.clipboard.writeText(inputUrl)
        setInputUrl('')
    }

   const handleCopy = async () => {
        await navigator.clipboard.writeText(inputUrl)
    }

    const handlePaste = async () => {
        const text = await navigator.clipboard.readText()
        setInputUrl(prev => prev + text)
    }

    return (
        <div 
            className={[
                'ie-window',
                'app-window',
                isMinimized && 'ie-window--minimized',
                isMinimized && 'app-window--minimized',
                isFullscreen && 'ie-window--fullscreen',
                isFullscreen && 'app-window--fullscreen',
            ].filter(Boolean).join(' ')}
            style={isFullscreen ? {} : { left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <div className="title">
                    <img  className="browser-icon" src={URL} alt="Internet Link Icon" />
                    <span className='title-bar-text'>{getPageTitle(currentUrl)}</span>
                </div>
                 <div className="title-bar-buttons xp-title-controls">
                    <button
                        className="xp-title-control btn-minimize"
                        onClick={() => setIsMinimized(true)}
                        type="button"
                        aria-label="Minimize"
                    >
                        _
                    </button>

                    <button
                        className={`xp-title-control ${isFullscreen ? 'btn-restore' : 'btn-maximize'}`}
                        onClick={toggleFullscreen}
                        type="button"
                        aria-label={isFullscreen ? 'Restore' : 'Maximize'}
                    >
                        {isFullscreen ? '❐' : '□'}
                    </button>

                    <button
                        className="xp-title-control btn-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    </div>
            </div>
            <div className="ie-toolbars">
                <div className='ie-menu'>
                    <IEMenu 
                        onNavigate={navigateTo}
                        onForward={goForward}
                        onBack={goBack}
                        onHome={() => navigateTo("https://alena-pumprova.cz/")}
                        onOpen={handleOpen}
                        onClose={onClose}
                        favouritesVisible={showFavourites}
                        statusBarVisible={showStatusBar}
                        onToggleStatusBar={() => setShowStatusBar(prev => !prev)}
                        onToggleFavourites={() => setShowFavourites(prev => !prev)}
                        onToggleStandardToolbar={() => setShowStandardToolbar(prev => !prev)}
                        onToggleAddressBar={() => setShowAddressBar(prev => !prev)}
                        standardToolbarVisible={showStandardToolbar}
                        addressBarVisible={showAddressBar}
                        onToggleFullscreen={toggleFullscreen}
                        onRefresh={handleRefresh}
                        onStop={handleStop}
                        onPrint={() => window.print()}
                        onCut={handleCut}
                        onCopy={handleCopy}
                        onPaste={handlePaste}
                    />
                    <div className='windows-corner-panel'>
                        <img className='windows-corner-icon' src={Logo} alt="Internet Explorer Logo" />
                    </div>
                </div>
                <div className='ie-toolbar'>
                    {showStandardToolbar &&
                        <div className="ie-toolbar-top">
                            <button 
                                className={`toolbar-btn ${historyIndex === 0 ? 'disabled' : ''}`}
                                onClick={goBack}
                                aria-label='go back'
                            >
                                <img className='toolbar-img' src={Back} alt="Back" />
                                Back
                            </button>
                            <button className={`toolbar-dropdown-arrow toolbar-btn ${historyIndex === 0 ? 'disabled' : ''}`} onClick={() => {}}>▾</button>
                            <button 
                                className={`toolbar-btn ${historyIndex === history.length - 1 ? 'disabled' : ''}`}
                                onClick={goForward} 
                                aria-label='go forward'
                            >
                                <img className='toolbar-img' src={Forward} alt="Forward" />
                                Forward
                            </button>
                            <button className={`toolbar-dropdown-arrow toolbar-btn ${historyIndex === history.length - 1 ? 'disabled' : ''}`} onClick={() => {}}>▾</button>
                            <button 
                                className='toolbar-btn' 
                                aria-label='refresh'
                                onClick={handleRefresh}
                                >
                                <img className='toolbar-img' src={Refresh} alt="Refresh" />
                            </button>
                            <button 
                                className='toolbar-btn' 
                                aria-label='stop'
                                onClick={handleStop}
                                >
                                <img className='toolbar-img' src={Stop} alt="Stop" />
                            </button>
                            <button className='toolbar-btn border-right' onClick={() => navigateTo("https://alena-pumprova.cz/")} aria-label='go home'>
                                <img className='toolbar-img' src={Home} alt="Home" />
                                Home
                            </button>
                            <button className='toolbar-btn' onClick={() => navigateTo('https://web.archive.org/web/20031024040025if_/http://www.google.com/')} aria-label='search'>
                                <img className='toolbar-img' src={Search} alt="Search" />
                                Search
                            </button>
                            <button className='toolbar-btn' onClick={() => setShowFavourites(prev => !prev)}>
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
                            <button className='toolbar-btn' onClick={() => window.print()} aria-label='print'>
                                <img className='toolbar-img' src={Printer} alt="Print" />
                            </button>
                            <button className='toolbar-btn' aria-label='edit page'>
                                <img className='toolbar-img' src={Edit} alt="Edit" />
                            </button>
                            <button className='toolbar-btn' aria-label='discuss'>
                                <img className='toolbar-img' src={Discuss} alt="Discuss" />
                            </button>
                        </div>
                    }
                    {showAddressBar &&
                        <div className="ie-toolbar-bottom">
                            <div className="left">
                                <span>A<span className="mnemonic">d</span>dress</span>
                                <div className="input-wrapper">
                                    <img className='toolbar-img-xs absolute' src={getFavicon(currentUrl)} alt="URL Icon" />
                                    <input 
                                        type="text" 
                                        className='address-bar' 
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && navigateTo(inputUrl)}
                                    />
                                </div>
                            </div>
                            <div className="right">
                                <button 
                                className='toolbar-btn'
                                onClick={() => navigateTo(inputUrl)} 
                                aria-label='go to address'
                                >
                                    <img className='toolbar-img-small' src={Go} alt="Go" />
                                    Go
                                </button>
                                <button className='toolbar-btn' aria-label='view links'>
                                    Links »
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="page-window-outer">
                  {showFavourites && (
                        <IEFavourites 
                            onNavigate={(url) => { navigateTo(url); setShowFavourites(false) }}
                            onClose={() => setShowFavourites(false)}
                        />
                    )}
                <div className="page-window-wrap">
                    {hasError && (
                        <div className="ie-error">
                            <div className="ie-error-header">
                                <img className='error-icon' src={NetworkError} alt="error" />
                                <h2>Internet Explorer cannot display the webpage</h2>
                            </div>
                            <hr />
                            <p>What you can try:</p>
                            <button onClick={() => navigateTo("https://alena-pumprova.cz/")}>
                                Diagnose Connection Problems
                            </button>
                             <details>
                                <summary>
                                    <span className="ie-error-arrow"></span>
                                    More information
                                </summary>
                                <p>This problem can be caused by a variety of issues, including:</p>
                                <ul>
                                    <li>Internet connectivity has been lost.</li>
                                    <li>The website is temporarily unavailable.</li>
                                    <li>The Domain Name Server (DNS) is not reachable.</li>
                                    <li>The Domain Name Server (DNS) does not have a listing for the website's domain.</li>
                                    <li>There might be a typing error in the address.</li>
                                </ul>
                                <p><strong>For offline users</strong></p>
                                <p>You can still view subscribed feeds and some recently viewed webpages.</p>
                                <p>To view subscribed feeds:</p>
                                <ol>
                                    <li>Click the Favorites button ⭐, click <strong>Feeds</strong>, and then click the feed you want to view.</li>
                                </ol>

                                <p>To view recently visited webpages (might not work on all pages):</p>
                                <ol>
                                    <li>Press Alt, click <strong>File</strong>, and then click <strong>Work Offline</strong>.</li>
                                    <li>Click the Favorites button ⭐, click <strong>History</strong>, and then click the page you want to view.</li>
                                </ol>
                            </details>
                        </div>
                    )}
                    <iframe
                        key={`${currentUrl}-${iframeKey}`}
                        className="page-window"
                        src={hasError ? 'about:blank' : isStopped ? 'about:blank' : currentUrl}
                        title="Internet Explorer"
                        scrolling="no"
                        style={{ display: hasError ? 'none' : 'block' }}
                    />
                </div>    
            </div>
            {showStatusBar &&     
                <div className='ie-statusbar'>
                    <img src={getFavicon(currentUrl)} alt="URL Icon" />
                    <span className='status-text'>
                        <img src={InternetIcon} alt="Internet Icon" />
                        Internet
                    </span>
                </div>
            }
        </div>
    )
}

export default IEWindow