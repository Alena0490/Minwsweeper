import { useState } from 'react'
import type { ErrorType } from './CriticalError'
import useSound from '../hooks/useSound'
import UserCat from '../img/user-cat.webp'

import Internet from '../img/InternetExplorer6.webp'
import OutlookExpress from '../img/OutlookExpress.webp'
import Calculator from '../img/Calculator.webp'
import MinesweeperIcon from '../img/minesweeperIcon.webp'   
import MyDocuments from '../img/MyDocuments.webp'
import MyRecentDocuments from '../img/RecentDocuments.webp'
import MyPictures from '../img/MyPictures.webp'
import MyMusic from '../img/MyMusic.webp'   
import ControlPanel from '../img/ControlPanel.webp'
import MyComputer from '../img/MyComputer.webp'
import ProgramAccess from '../img/set-program-acess.webp'
import PrintersAndFaxes from '../img/PrintersAndFaxes.webp'
import Search from '../img/Search.webp'
import Run from '../img/Run.webp'
import Help from '../img/HelpAndSupport.webp'
import LogOff from '../img/Logout.webp'
import TurnOff from '../img/Power.webp'
import PaintIcon from '../img/Paint.webp'
import TerminalIcon from '../img/CommandPrompt.webp'
import NotepadIcon from '../img/Notepad.webp'
import AllProgramsIcon from '../img/AllPrograms.webp'
import WindowsCatalog from '../img/WindowsCatalog.webp'
import WindowsUpdate from '../img/WindowsUpdate.webp'
import StartMenuPrograms from '../img/StarMenuPrograms.webp'

import './StartMenu.css'

interface ModalProps {
    className?: string;
    onIEOpen: () => void;
    onPaintOpen: () => void;
    onCalculatorOpen: () => void;
    onMinesweeperOpen: () => void;
    onTerminalOpen: () => void;
    onNotepadOpen: () => void;
    onAppUnavailable: (type: ErrorType) => void;
    onLogOff: () => void;
    onTurnOff: () => void;
}

const MenuModal = ({ 
    className, 
    onIEOpen, 
    onPaintOpen, 
    onCalculatorOpen, 
    onMinesweeperOpen,
    onTerminalOpen,
    onNotepadOpen,
    onAppUnavailable,
    onLogOff,
    onTurnOff
}: ModalProps) => { 
    const {playStart } = useSound();
    const [showAllPrograms, setShowAllPrograms] = useState(false);
    const [showAccessories, setShowAccessories] = useState(false);
    const [showGames, setShowGames] = useState(false);

    return (
        <div 
            className={className}
            onClick={(e) => e.stopPropagation()}
        >
        <div className='user'>
            <img src={UserCat} alt="Cat" />
            <span>Alena</span>
        </div>
            <div className='menu'>
                {/* MENU - LEFT PART */}
                <div 
                    className="menu-left-outer"
                    onMouseLeave={() => setShowAllPrograms(false)}
                >
                    <div className="menu-left">
                        <div 
                            className="menu-item menu-item-detailed"
                            onClick={() => { onIEOpen(); playStart(); }}
                        >
                            <img src={Internet} alt="Internet Icon" />
                            <span>
                                Internet
                                <small>Internet Explorer</small>
                            </span>
                        </div>

                        <div 
                            className="menu-item menu-item-detailed" 
                            onClick={() => onAppUnavailable('appNotFound')}
                        >
                            <img src={OutlookExpress} alt="Email Icon" />
                            <span>
                                E-mail
                                <small>Outlook Express</small>
                            </span>
                        </div>
                        <hr />
                        <div className="menu-item" onClick={() => { onMinesweeperOpen(); playStart(); }}>
                            <img src={MinesweeperIcon} alt="Minesweeper Icon" />
                            Minesweeper
                        </div>

                        <div className="menu-item" onClick={() => { onCalculatorOpen(); playStart(); }}>
                            <img src={Calculator} alt="Calculator Icon" />
                            Calculator
                        </div>

                        <div className="menu-item" onClick={() => { onTerminalOpen(); playStart(); }}>
                            <img src={TerminalIcon} alt="Command Prompt Icon" />
                            Command Prompt
                        </div>

                        <div className="menu-item" onClick={() => { onPaintOpen(); playStart(); }}>
                            <img src={PaintIcon} alt="Paint Icon" />
                            Paint
                        </div>

                        <div className="menu-item" onClick={() => { onNotepadOpen(); playStart(); }}>
                            <img src={NotepadIcon} alt="Notepad Icon" />
                            Notepad
                        </div>

                        <div 
                            className="menu-item bottom"
                            onMouseEnter={() => setShowAllPrograms(true)}
                        >
                            All Programs
                            <img src={AllProgramsIcon} alt="All Programs Icon" />
                        </div>
                    </div>

                    {/* ALL ITEMS SUBMENU */}
                    {showAllPrograms && (
                        <div className="all-programs-menu">
                            <div className="menu-item is-disabled">
                                <img src={ProgramAccess} alt="Program Access" />
                                Set Program Access and Default
                            </div>
                            <div className="menu-item is-disabled">
                                <img src={WindowsCatalog} alt="Windows Catalog" />
                                Windows Catalog
                            </div>
                            <div className="menu-item is-disabled">
                                <img src={WindowsUpdate} alt="Windows Update" />
                                Windows Update
                            </div>
                            <hr />
                            {/* SECOND SUBMENU */}
                            <div 
                                className="menu-item has-submenu"
                                onMouseEnter={() => { setShowAccessories(true); setShowGames(false) }}
                                onMouseLeave={() => setShowAccessories(false)}
                            >
                                <img src={StartMenuPrograms} alt="Accessories" />
                                Accessories
                                {showAccessories && (
                                    <div className="all-programs-submenu">
                                        <div className="menu-item" onClick={() => { onNotepadOpen(); playStart(); }}>
                                            <img src={NotepadIcon} alt="Notepad" />
                                            Notepad
                                        </div>
                                        <div className="menu-item" onClick={() => { onPaintOpen(); playStart(); }}>
                                            <img src={PaintIcon} alt="Paint" />
                                            Paint
                                        </div>
                                        <div className="menu-item" onClick={() => { onCalculatorOpen(); playStart(); }}>
                                            <img src={Calculator} alt="Calculator" />
                                            Calculator
                                        </div>
                                        <div className="menu-item" onClick={() => { onTerminalOpen(); playStart(); }}>
                                            <img src={TerminalIcon} alt="Command Prompt" />
                                            Command Prompt
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div 
                                className="menu-item has-submenu"
                                onMouseEnter={() => { setShowGames(true); setShowAccessories(false) }}
                                onMouseLeave={() => setShowGames(false)}
                            >
                                <img src={StartMenuPrograms} alt="Games" />
                                Games
                                {showGames && (
                                    <div className="all-programs-submenu">
                                        <div className="menu-item" onClick={() => { onMinesweeperOpen(); playStart(); }}>
                                            <img src={MinesweeperIcon} alt="Minesweeper" />
                                            Minesweeper
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr />
                            <div className="menu-item" onClick={() => onAppUnavailable('appNotFound')}>
                                <img src={OutlookExpress} alt="Outlook Express" />
                                Outlook Express
                            </div>
                            <div className="menu-item" onClick={() => { onIEOpen(); playStart(); }}>
                                <img src={Internet} alt="Internet Explorer" />
                                Internet Explorer
                            </div>
                        </div>
                    )}
                </div>

                {/* MENU - RIGHT PART */}
                <div className="menu-right">
                    <div className="menu-item top-menu-item">
                        <img src={MyDocuments} alt="My Documents Icon" />
                        <span>My Documents</span>
                    </div>
                    <div className="menu-item top-menu-item">
                        <img src={MyRecentDocuments} alt="My Recent Documents Icon" />
                        <span>My Recent Documents</span>
                    </div>
                    <div className="menu-item top-menu-item">
                        <img src={MyPictures} alt="My Pictures Icon" />
                        <span>My Pictures</span>
                    </div>
                    <div className="menu-item top-menu-item">
                        <img src={MyMusic} alt="My Music Icon" />
                        <span>My Music</span>
                    </div>
                    <div className="menu-item top-menu-item">
                        <img src={MyComputer} alt="My Computer Icon" />
                        <span>My Computer</span>
                    </div>
                    <hr />
                    <div className="menu-item">
                        <img src={ControlPanel} alt="Control Panel Icon" />
                        <span>Control Panel</span>
                    </div>      
                    <div className="menu-item">
                        <img src={ProgramAccess} alt="Program Access Icon" />
                        <span>Set Program Access<br />and Defaults</span>
                    </div>
                    <div className="menu-item">
                        <img src={PrintersAndFaxes} alt="Printers and Faxes Icon" />
                        <span>Printers and Faxes</span>
                    </div>
                    <hr />
                    <div className="menu-item">
                        <img src={Help} alt="Help Icon" />
                        <span>Help and Support</span>
                    </div>
                    <div className="menu-item">
                        <img src={Search} alt="Search Icon" />
                        <span>Search</span>
                    </div>
                    <div className="menu-item">
                        <img src={Run} alt="Run Icon" />
                        <span>Run...</span>
                    </div>  
                </div>
            </div>
            <div className='power'>
                <div className="power-button" onClick={onLogOff}>
                    <img src={LogOff} alt="Log Off" />
                    Log Off
                </div>
                <div className="power-button" onClick={onTurnOff}>
                    <img src={TurnOff} alt="Turn Off" />
                    Turn Off Computer
                </div>
            </div>
        </div>
    )
}

export default MenuModal