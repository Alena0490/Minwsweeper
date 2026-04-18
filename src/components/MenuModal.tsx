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
import './MenuModal.css'

interface ModalProps {
  className?: string;
  onIEOpen: () => void;
  onPaintOpen: () => void;
}

const MenuModal = ({ className, onIEOpen, onPaintOpen }: ModalProps) => { 
    const {playStart } = useSound();

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

                    <div className="menu-item menu-item-detailed">
                        <img src={OutlookExpress} alt="Email Icon" />
                        <span>
                            E-mail
                            <small>Outlook Express</small>
                        </span>
                    </div>
                    <hr />
                    <div className="menu-item">
                        <img src={MinesweeperIcon} alt="Minesweeper Icon" />
                        Minesweeper
                        </div>
                    <div className="menu-item">
                        <img src={Calculator} alt="Calculator Icon" />
                        Calculator
                        </div>
                </div>
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
                        <img src={ProgramAccess} alt="Printers and Faxes Icon" />
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
                {/* <div className="power-button"></div> */}
                <div className="power-button">
                    <img src={LogOff} alt="Log Off" />
                    Log Off
                </div>
                <div className="power-button">
                    <img src={TurnOff} alt="Turn Off" />
                    Turn Off Computer
                </div>
            </div>
        </div>
    )
}

export default MenuModal
