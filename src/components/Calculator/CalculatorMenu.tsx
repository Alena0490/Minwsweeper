import { useState, useEffect, useRef } from 'react'
import './Calculator.css'

const CalculatorMenu = () => {
    const [openMenu, setOpenMenu] = useState< 'edit' | 'view' |  'help' | null>(null)
    
    const menuRef = useRef<HTMLElement>(null)
    
    // const itemClass = (disabled = false, extra = '') =>
    //     `${disabled ? 'is-disabled' : ''}${extra ? ` ${extra}` : ''}`.trim()
    
    useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

   
    return (
        <menu className='calculator-menu' ref={menuRef}>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li className="is-disabled">Copy <span>Ctrl+C</span></li>
                        <li className="is-disabled">Paste <span>Ctrl+V</span></li>
                    </ul>
                </li>

                <li 
                    onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}
                >
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className="checked">Standard</li>
                        <li className="is-disabled">Scientific</li>
                        <li className="separator" />
                        <li className="is-disabled">Digit grouping</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className="is-disabled">Help Topics</li>
                        <li className="separator" />
                        <li className="is-disabled">About Calculator</li>
                    </ul>
                </li>
            </ul>
        </menu>
    )
}

export default CalculatorMenu