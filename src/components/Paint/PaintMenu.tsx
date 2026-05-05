import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSound from '../../hooks/useSound';
import AboutDialog from '../AboutDialog';
import FlipRotate from './FlipRotate';
import StretchSkew from './StretchSkew';
import Attributes from './Attributes';
import CustomZoom from './CustomZoom';
import './PaintMenu.css';

interface PaintMenuProps {
    setTool: React.Dispatch<React.SetStateAction<string>>;
    onSaveAs: () => void;
    onClose: () => void;
    windowPosition: { x: number; y: number };
    onCut: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onFullscreen: () => void;
    onInvertColors: () => void;
    showToolbox: boolean;
    onToggleToolbox: () => void;
    showStatusBar: boolean;
    onToggleStatusBar: () => void;
    showColorBox: boolean;
    onToggleColorBox: () => void;
    onFlipRotate: (action: 'flipH' | 'flipV' | 'rotate', angle?: number) => void;
    onStretchSkew: (stretchH: number, stretchV: number, skewH: number, skewV: number) => void;
    onDrawOpaque: () => void;
    isDrawOpaque: boolean;
    onAttributes: (width: number, height: number) => void;
    canvasWidth: number;
    canvasHeight: number;
    onViewBitmap: () => void;
    onZoomLevel: (value: number) => void;
    currentZoom: number;
    onZoomToWindow: () => void;
    showGrid: boolean;
    onToggleGrid: () => void;
    showThumbnail: boolean;
    onToggleThumbnail: () => void;
    openModal: 'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null;
    setOpenModal: React.Dispatch<React.SetStateAction<'about' | 'fliprotate' | 'stretchskew' | 'attributes' | 'customzoom' | null>>;
}

const PaintMenu = ({
    setTool,
    onZoomLevel,
    currentZoom,
    onZoomToWindow,
    onSaveAs,
    onClose,
    windowPosition,
    onCut,
    onCopy,
    onPaste,
    onFullscreen,
    onInvertColors,
    showColorBox,
    showStatusBar,
    showToolbox,
    onToggleColorBox,
    onToggleStatusBar,
    onToggleToolbox,
    onFlipRotate,
    onStretchSkew,
    onDrawOpaque,
    isDrawOpaque,
    onAttributes,
    canvasHeight,
    canvasWidth,
    onViewBitmap,
    showGrid,
    onToggleGrid,
    showThumbnail,
    onToggleThumbnail,
    openModal,
    setOpenModal,
}: PaintMenuProps) => {
    const [openMenu, setOpenMenu] = useState<'file' | 'edit' | 'view' | 'image' | 'colors' | 'help' | null>(null);

    const { playStartMenu } = useSound();
    const menuRef = useRef<HTMLElement>(null);

    const itemClass = (disabled = false, extra = '') =>
        `${disabled ? 'is-disabled' : ''}${extra ? ` ${extra}` : ''}`.trim();

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

    const handleAction = (action: () => void) => {
        playStartMenu();
        action();
        setOpenMenu(null);
    };

    const modalStyle = {
        position: 'fixed' as const,
        top: windowPosition.y + 145,
        left: windowPosition.x + 90,
    };

    return (
        <menu className='paint-menu' ref={menuRef}>
            <ul>
                <li onClick={() => setOpenMenu(openMenu === 'file' ? null : 'file')}>
                    File
                    <ul className={`submenu ${openMenu === 'file' ? 'open' : ''}`}>
                        <li onClick={() => handleAction(() => setTool('clear'))}>New <span>Ctrl+N</span></li>
                        <li onClick={() => handleAction(() => setTool('open'))}>Open... <span>Ctrl+O</span></li>
                        <li onClick={() => handleAction(() => setTool('download'))}>Save <span>Ctrl+S</span></li>
                        <li onClick={() => handleAction(onSaveAs)}>Save As...</li>
                        <li className='separator' aria-hidden='true' />
                        <li className={itemClass(true)} aria-disabled='true'>Print Preview</li>
                        <li className={itemClass(true)} aria-disabled='true'>Print... <span>Ctrl+P</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(onClose)}>Exit</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'edit' ? null : 'edit')}>
                    Edit
                    <ul className={`submenu ${openMenu === 'edit' ? 'open' : ''}`}>
                        <li onClick={() => handleAction(() => setTool('undo'))}>Undo <span>Ctrl+Z</span></li>
                        <li className={itemClass(true)} aria-disabled='true'>Repeat <span>F4</span></li>
                        <li className={itemClass(true)} aria-disabled='true'>History <span>Ctrl+Shift+Y</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(onCut)}>Cut <span>Ctrl+X</span></li>
                        <li onClick={() => handleAction(onCopy)}>Copy <span>Ctrl+C</span></li>
                        <li onClick={() => handleAction(onPaste)}>Paste <span>Ctrl+V</span></li>
                        <li onClick={() => handleAction(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true })))}>
                            Clear Selection <span>Del</span>
                        </li>
                        <li onClick={() => handleAction(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true })))}>
                            Select All <span>Ctrl+A</span>
                        </li>
                        <li className='separator' aria-hidden='true' />
                        <li className={itemClass(true)} aria-disabled='true'>Copy To...</li>
                        <li className={itemClass(true)} aria-disabled='true'>Paste From...</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'view' ? null : 'view')}>
                    View
                    <ul className={`submenu ${openMenu === 'view' ? 'open' : ''}`}>
                        <li className={showToolbox ? 'checked' : ''} onClick={() => handleAction(onToggleToolbox)}>Tool Box</li>
                        <li className={showColorBox ? 'checked' : ''} onClick={() => handleAction(onToggleColorBox)}>Color Box <span>Ctrl+L</span></li>
                        <li className={showStatusBar ? 'checked' : ''} onClick={() => handleAction(onToggleStatusBar)}>Status Bar</li>
                        <li className='is-disabled' aria-disabled='true'>Text Toolbar</li>
                        <li className='separator' aria-hidden='true' />
                        <li className='has-submenu'>
                            Zoom
                            <ul className='submenu'>
                                <li onClick={() => handleAction(() => onZoomLevel(1))}>Normal Size</li>
                                <li onClick={() => handleAction(() => onZoomLevel(2))}>Large Size</li>
                                <li onClick={() => handleAction(onZoomToWindow)}>Zoom To Window</li>
                                <li onClick={() => handleAction(() => setOpenModal('customzoom'))}>Custom...</li>
                                <li className='separator' aria-hidden='true' />
                                <li className={showGrid ? 'checked' : ''} onClick={() => handleAction(onToggleGrid)}>Show Grid <span>Ctrl+G</span></li>
                                <li className={showThumbnail ? 'checked' : ''} onClick={() => handleAction(onToggleThumbnail)}>Show Thumbnail</li>
                            </ul>
                        </li>
                        <li onClick={() => handleAction(onViewBitmap)}>View Bitmap <span>Ctrl+F</span></li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(onFullscreen)}>Fullscreen <span>F11</span></li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'image' ? null : 'image')}>
                    Image
                    <ul className={`submenu ${openMenu === 'image' ? 'open' : ''}`}>
                        <li onClick={() => handleAction(() => setOpenModal('fliprotate'))}>Flip/Rotate <span>Ctrl+Alt+R</span></li>
                        <li onClick={() => handleAction(() => setOpenModal('stretchskew'))}>Stretch/Skew <span>Ctrl+Shift+K</span></li>
                        <li onClick={() => handleAction(onInvertColors)}>Invert Colors <span>Ctrl+I</span></li>
                        <li onClick={() => handleAction(() => setOpenModal('attributes'))}>Attributes... <span>Ctrl+E</span></li>
                        <li onClick={() => handleAction(() => setTool('clear'))}>Clear Image</li>
                        <li className={isDrawOpaque ? 'checked' : ''} onClick={() => handleAction(onDrawOpaque)}>Draw Opaque</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'colors' ? null : 'colors')}>
                    Colors
                    <ul className={`submenu ${openMenu === 'colors' ? 'open' : ''}`}>
                        <li className={itemClass(true)} aria-disabled='true'>Edit Colors...</li>
                        <li className={itemClass(true)} aria-disabled='true'>Get Colors</li>
                        <li className={itemClass(true)} aria-disabled='true'>Save Colors</li>
                    </ul>
                </li>

                <li onClick={() => setOpenMenu(openMenu === 'help' ? null : 'help')}>
                    Help
                    <ul className={`submenu ${openMenu === 'help' ? 'open' : ''}`}>
                        <li className={itemClass(true)} aria-disabled='true'>Help Topics</li>
                        <li className='separator' aria-hidden='true' />
                        <li onClick={() => handleAction(() => setOpenModal('about'))}>About Paint</li>
                    </ul>
                </li>
            </ul>

            {openModal === 'about' && createPortal(
                <AboutDialog
                    title='Paint'
                    onClose={() => setOpenModal(null)}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'fliprotate' && createPortal(
                <FlipRotate
                    onClose={() => setOpenModal(null)}
                    onConfirm={(action, angle) => { onFlipRotate(action, angle); setOpenModal(null); }}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'stretchskew' && createPortal(
                <StretchSkew
                    onClose={() => setOpenModal(null)}
                    onConfirm={(stretchH, stretchV, skewH, skewV) => { onStretchSkew(stretchH, stretchV, skewH, skewV); setOpenModal(null); }}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'attributes' && createPortal(
                <Attributes
                    onClose={() => setOpenModal(null)}
                    onConfirm={(w, h) => { onAttributes(w, h); setOpenModal(null); }}
                    currentWidth={canvasWidth}
                    currentHeight={canvasHeight}
                    style={modalStyle}
                />,
                document.body
            )}

            {openModal === 'customzoom' && createPortal(
                <CustomZoom
                    onClose={() => setOpenModal(null)}
                    onConfirm={(zoom) => { onZoomLevel(zoom); setOpenModal(null); }}
                    currentZoom={currentZoom}
                    style={modalStyle}
                />,
                document.body
            )}
        </menu>
    );
};

export default PaintMenu;