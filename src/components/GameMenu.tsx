import { useState } from 'react'
import About from './About'
import BestTimes from './BestTimes'
import Custom from './Custom'
import './GameMenu.css'

const GameMenu = () => {
    const [openMenu, setOpenMenu] = useState<'game' | 'help' | null>(null)
     const [openModal, setOpenModal] = useState<'about' | 'times' | 'custom' | null>(null)
  return (
    <menu 
        className='game-menu'
      >
        <ul>
            <li 
                onClick={() => setOpenMenu(openMenu === 'game' ? null : 'game')}
            >
                Game
                <ul className={`submenu game ${openMenu === 'game' ? 'open' : ''}`}>
                    <li>New <span>F2</span></li>
                    <li className="separator" aria-hidden="true"></li>
                    <li>Beginner</li>
                    <li>Intermediate</li>
                    <li>Expert</li>
                    <li onClick={() => { setOpenModal('custom'); setOpenMenu(null) }}>Custom</li>
                    <li className="separator" aria-hidden="true"></li>
                    <li onClick={() => { setOpenModal('times'); setOpenMenu(null) }}>Best Times</li>
                    <li className="separator" aria-hidden="true"></li>
                    <li>Exit</li>
                </ul>
            </li>
            
            <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                Help
                <ul className={`submenu help ${openMenu === 'help' ? 'open' : ''}`}>
                    <li>Contents <span>F1</span></li>
                    <li>Search for Help On...</li>
                    <li>Using Help</li>
                    <li className="separator" aria-hidden="true"></li>
                     <li onClick={() => { setOpenModal('about'); setOpenMenu(null) }}>About Minesweeper...</li>
                </ul>
            </li>
        </ul>
        {openModal === 'about' && <About onClose={() => setOpenModal(null)} />}
        {openModal === 'times' && <BestTimes onClose={() => setOpenModal(null)} />}
        {openModal === 'custom' && <Custom onClose={() => setOpenModal(null)} />}
    </menu>
  )
}

export default GameMenu
