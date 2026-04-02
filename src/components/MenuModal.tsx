import UserCat from '../img/user-cat.jpg'
import Internet from '../img/Internet Explorer 6.png'
import Email from '../img/Email.png'
import Calculator from '../img/Calculator.png'
import MinesweeperIcon from '../img/minesweeperIcon.webp'   
import LogOff from '../img/Logout.png'
import TurnOff from '../img/Power.png'
import './MenuModal.css'

interface ModalProps {
  className?: 'start-menu';
}

const MenuModal = (props: ModalProps) => {
  return (
    <div className={props.className}>
      <div className='user'>
        <img src={UserCat} alt="Cat" />
        <span>Alena</span>
      </div>
        <div className='menu'>
            <div className="menu-left">
                <div className="menu-item">
                    <img src={Internet} alt="Internet Icon" />
                    Internet
                    </div>
                <div className="menu-item">
                    <img src={Email} alt="Email Icon" />
                    Email
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
            <div className="menu-right"></div>
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
