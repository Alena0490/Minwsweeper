import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutCalculator from './AboutCalculator';
import './Calculator.css';

interface CalculatorMenuProps {
    windowPosition: { x: number; y: number };
    display: string;
    onPaste: (value: string) => void;
    digitGrouping: boolean;
    onToggleDigitGrouping: () => void;
    isScientific: boolean;
    onToggleScientific: () => void;
}

const CalculatorMenu = ({
    windowPosition,
    display,
    onPaste,
    digitGrouping,
    onToggleDigitGrouping,
    isScientific,
    onToggleScientific,
}: CalculatorMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'edit' | 'view' | 'help' | null>(null);
    const [openModal, setOpenModal] = useState<'about' | null>(null);

    const { playStartMenu } = useSound();
    const menuRef = useRef<HTMLElement>(null);

    // Close menu on outside click
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
                        <li onClick={() => { playStartMenu(); navigator.clipboard.writeText(display); setOpenMenu(null); }}>
                            Copy <span>Ctrl+C</span>
                        </li>
                        <li onClick={() => {
                            playStartMenu();
                            navigator.clipboard.readText().then(text => {
                                const num = parseFloat(text);
                                if (!isNaN(num)) onPaste(String(num));
                            });
                            setOpenMenu(null);
                        }}>
                            Paste <span>Ctrl+V</span>
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li
                            className={isScientific ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleScientific(); setOpenMenu(null); }}
                        >
                            Scientific
                        </li>
                        <li
                            className={!isScientific ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleScientific(); setOpenMenu(null); }}
                        >
                            Standard
                        </li>
                        <li className='separator' />
                        <li
                            className={digitGrouping ? 'checked' : ''}
                            onClick={() => { playStartMenu(); onToggleDigitGrouping(); setOpenMenu(null); }}
                        >
                            Digit grouping
                        </li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className='is-disabled'>Help Topics</li>
                        <li className='separator' />
                        <li onClick={() => { playStartMenu(); setOpenModal('about'); setOpenMenu(null); }}>
                            About Calculator
                        </li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutCalculator
                    onClose={() => setOpenModal(null)}
                    style={{
                        position: 'fixed',
                        top: windowPosition.y + 145,
                        left: windowPosition.x + 90,
                    }}
                />,
                document.body
            )}
        </menu>
    );
};

export default CalculatorMenu;