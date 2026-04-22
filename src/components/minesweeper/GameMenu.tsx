import { useState, useEffect, useRef  } from 'react'
import { createPortal } from 'react-dom'
import type { BoardConfig } from '../../data/game'
import { beginnerConfig, intermediateConfig, expertConfig } from '../../data/game'
import About from './About'
import BestTimes from './BestTimes'
import Custom from './Custom'
import './GameMenu.css'

interface GameMenuProps {
    onReset: (newLevel?: BoardConfig) => void
    onMarksChange: (value: boolean) => void
    level: BoardConfig
    setLevel: (level: BoardConfig) => void

    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    windowPosition: { x: number, y: number };
    soundEnabled: boolean;
    onSoundToggle: () => void;
}

const GameMenu = ({ onReset, onMarksChange, level, setLevel, setIsMinimized, windowPosition, soundEnabled, onSoundToggle }: GameMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'game' | 'help' | null>(null)
    const [openModal, setOpenModal] = useState<'about' | 'times' | 'custom' | null>(null)
    const [marks, setMarks] = useState(true)

    const menuRef = useRef<HTMLElement>(null);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        ref={menuRef}
      >
        <ul>
            <li 
                onClick={() => setOpenMenu(openMenu === 'game' ? null : 'game')}
            >
                Game
                <ul className={`submenu game ${openMenu === 'game' ? 'open' : ''}`}>
                    <li onClick={() => onReset()}>New <span>F2</span></li>
                    <li className="separator" aria-hidden="true"></li>
                    <li
                        className={level === beginnerConfig ? 'checked' : ''}
                        onClick={() => {
                            setLevel(beginnerConfig)
                            onReset(beginnerConfig)
                            setOpenMenu(null)
                        }}
                    >
                        Beginner
                    </li>
                    <li
                        className={level === intermediateConfig ? 'checked' : ''}
                        onClick={() => {
                            setLevel(intermediateConfig)
                            onReset(intermediateConfig)
                            setOpenMenu(null)
                        }}
                    >
                        Intermediate
                    </li>
                    <li
                        className={level === expertConfig ? 'checked' : ''}
                        onClick={() => {
                            setLevel(expertConfig)
                            onReset(expertConfig)
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
                    <li
                        className={soundEnabled ? 'checked' : ''}
                        onClick={() => { onSoundToggle(); setOpenMenu(null); }}
                    >Sound</li>
                    <li className="separator" aria-hidden="true"></li>
                    <li onClick={() => { setOpenModal('times'); setOpenMenu(null) }}>Best Times</li>
                    <li className="separator" aria-hidden="true"></li>
                    <li onClick={() => { setIsMinimized(true); setOpenMenu(null); }}>Exit</li>
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
        {openModal === 'about' && createPortal(
            <About 
                onClose={() => setOpenModal(null)} 
                style={{ 
                    position: 'fixed',
                    top: windowPosition.y + 145,
                    left: windowPosition.x + 90,
                }}
            />,
            document.body
        )}
        {openModal === 'times' && createPortal(
            <BestTimes 
                onClose={() => setOpenModal(null)} 
                style={{ 
                    position: 'fixed',
                    top: windowPosition.y + 145,
                    left: windowPosition.x + 90,
                }}
            />,
            document.body
            )}
       {openModal === 'custom' && createPortal(
        <Custom 
            onClose={() => setOpenModal(null)} 
            onReset={onReset}
            setLevel={setLevel} 
            style={{ 
                position: 'fixed',
                top: windowPosition.y + 150,
                left: windowPosition.x + 90,
            }}
        />,
        document.body
        )}
    </menu>
  )
}

export default GameMenu
