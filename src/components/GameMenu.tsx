import { useState } from 'react'
import type { BoardConfig } from '../data/game'
import { beginnerConfig, intermediateConfig, expertConfig } from '../data/game'
import About from './About'
import BestTimes from './BestTimes'
import Custom from './Custom'
import './GameMenu.css'

interface GameMenuProps {
    onReset: () => void
    onMarksChange: (value: boolean) => void
    level: BoardConfig
    setLevel: (level: BoardConfig) => void
}

const GameMenu = ({ onReset, onMarksChange, level, setLevel }: GameMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'game' | 'help' | null>(null)
     const [openModal, setOpenModal] = useState<'about' | 'times' | 'custom' | null>(null)
     const [marks, setMarks] = useState(true)

    const toggleMarks = () => {
        setMarks(prev => {
            onMarksChange(!prev);
            return !prev;
        });
        setOpenMenu(null);
    }
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
                    <li onClick={onReset}>New <span>F2</span></li>
                    <li className="separator" aria-hidden="true"></li>
                    <li
                        className={level === beginnerConfig ? 'checked' : ''}
                        onClick={() => {
                            setLevel(beginnerConfig)
                            setOpenMenu(null)
                        }}
                    >
                        Beginner
                    </li>
                    <li
                        className={level === intermediateConfig ? 'checked' : ''}
                        onClick={() => {
                            setLevel(intermediateConfig)
                            setOpenMenu(null)
                        }}
                    >
                        Intermediate
                    </li>
                    <li
                        className={level === expertConfig ? 'checked' : ''}
                        onClick={() => {
                            setLevel(expertConfig)
                            setOpenMenu(null)
                        }}
                    >
                        Expert
                    </li>
                    <li onClick={() => { setOpenModal('custom'); setOpenMenu(null) }}>Custom</li>
                    <li className="separator" aria-hidden="true"></li>
                    <li
                        className={marks ? 'checked' : ''}
                        onClick={toggleMarks}
                        >
                        Marks (?)
                    </li>
                    <li>Sound</li>
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
        {openModal === 'times' && 
            <BestTimes 
                onClose={() => setOpenModal(null)} 
            />}
        {openModal === 'custom' && <Custom onClose={() => setOpenModal(null)} />}
    </menu>
  )
}

export default GameMenu
