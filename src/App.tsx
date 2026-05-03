import { useState } from "react"
import useSound from './hooks/useSound'
import useWindowState from './hooks/useWindowState';
import type { ErrorType } from './components/CriticalError'
import CriticalError from './components/CriticalError'
import ShutdownScreen from './components/ShutdownScreen'

import LoadingScreen from './components/XPLoading'
import LoginScreen from "./components/LoginScreen";
import Game from "./components/minesweeper/Game"
import Paint from './components/Paint/Paint'
import IEWindow from "./components/IE/IEWindow"
import Calculator from "./components/Calculator/Calculator"
import Footer from "./components/Footer"
import Terminal from "./components/terminal/Terminal";
import Notepad from './components/notepad/Notepad'

import MyComputer from './img/MyComputer.webp'
import IntertExplorer from './img/InternetExplorer6.webp'
import Bin from './img/RecycleBinEmpty.webp'
import MinesweeperIcon from './img/Minesweeper.webp'
import PaintIcon from './img/Paint.webp'
import CalculatorIcon from './img/Calculator.webp'
import TerminalIcon from './img/CommandPrompt.webp'
import NotepadIcon from './img/Notepad.webp'

import './App.css'

interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

type WindowId =
  | 'minesweeper'
  | 'ie'
  | 'paint'
  | 'calculator'
  | 'terminal'
  | 'notepad'
  | 'error'


const App = () => {
  const { playStart, playMinimize, playCriticalError, playShutDown, playLogOff } = useSound();

  const minesweeper = useWindowState();
  const ie = useWindowState();
  const paint = useWindowState();
  const calculator = useWindowState();
  const terminal = useWindowState();
  const notepad = useWindowState();

  const [isIEOpen, setIsIEOpen] = useState(false);
  const [isPaintOpen, setIsPaintOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeError, setActiveError] = useState<ErrorType | null>(null);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [windowOrder, setWindowOrder] = useState<WindowId[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shutdownMode, setShutdownMode] = useState<'logoff' | 'turnoff' | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);


  // Bring active window to the front
  const bringToFront = (id: WindowId) => {
    setWindowOrder(prev => [...prev.filter(item => item !== id), id]);
  }

  // Remove closed window from order
  const removeFromOrder = (id: WindowId) => {
    setWindowOrder(prev => prev.filter(item => item !== id));
  }

  // Handle Fullscreen
  const handleFullscreen = () => {
    const elem = document.documentElement as FullscreenHTMLElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

  // Show Error Window
  const openError = (type: ErrorType) => {
    playCriticalError();
    setActiveError(type);
    bringToFront('error');
  }

  /*** MINIMIZE APPS */

  // Minimize Minesweeper
  const handleMinesweeperMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(minesweeper.isMinimized) : value;
    if (nextValue) playMinimize();
    else playStart();
    minesweeper.setIsMinimized(nextValue);
  };

  // Minimize IE
  const handleIEMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(ie.isMinimized) : value;
    if (nextValue) playMinimize();
    else playStart();
    ie.setIsMinimized(nextValue);
  };

  // Minimize Paint
  const handlePaintMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(paint.isMinimized) : value;
    if (nextValue) playMinimize();
    else playStart();
    paint.setIsMinimized(nextValue);
  };

  // Minimize Calculator
  const handleCalculatorMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(calculator.isMinimized) : value;
    if (nextValue) playMinimize();
    else playStart();
    calculator.setIsMinimized(nextValue);
  };

   // Minimize Terminal
  const handleTerminalMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(terminal.isMinimized) : value;
    if (nextValue) playMinimize();
    else playStart();
    terminal.setIsMinimized(nextValue);
  };

  // Minimize Notepad
  const handleNotepadMinimize = (value: boolean | ((prev: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(notepad.isMinimized) : value;
    if (nextValue) playMinimize();
    else playStart();
    notepad.setIsMinimized(nextValue);
  };

  /*** OPEN APPS */
  // Open IE
  const openIE = () => {
    if (!isIEOpen) {
      playStart();
      setIsIEOpen(true);
    } else if (ie.isMinimized) {
      handleIEMinimize(false);
    }
    bringToFront('ie')
  };

  // Open Minesweeper
  const openMinesweeper = () => {
    if (!isMinesweeperOpen) {
      playStart();
      setIsMinesweeperOpen(true);
    } else if (minesweeper.isMinimized) {
      handleMinesweeperMinimize(false);
    }
    bringToFront('minesweeper')
  };

  // Open Paint
  const openPaint = () => {
    if (!isPaintOpen) {
      playStart();
      setIsPaintOpen(true);
    } else if (paint.isMinimized) {
      handlePaintMinimize(false);
    }
    bringToFront('paint')
  };

  // Open Calculator
  const openCalculator = () => {
    if (!isCalculatorOpen) {
      playStart();
      setIsCalculatorOpen(true);
    } else if (calculator.isMinimized) {
      handleCalculatorMinimize(false);
    }
    bringToFront('calculator')
  };

  // Open Terminal
  const openTerminal = () => {
    if (!isTerminalOpen) {
      playStart();
      setIsTerminalOpen(true);
    } else if (terminal.isMinimized) {
      handleTerminalMinimize(false);
    }
    bringToFront('terminal')
  };

  // Open Notepad
  const openNotepad = () => {
    if (!isNotepadOpen) {
      playStart();
      setIsNotepadOpen(true);
    } else if (notepad.isMinimized) {
      handleNotepadMinimize(false);
    }
    bringToFront('notepad')
  };

  // Handler
  const openShutdown = (mode: 'logoff' | 'turnoff') => {
    setShutdownMode(mode);
  };

  // SHUTDOWN
  const handleShutdownAction = (action: 'switchuser' | 'logoff' | 'standby' | 'turnoff' | 'restart') => {
    setShutdownMode(null);

    if (action === 'turnoff' || action === 'restart' || action === 'standby') {
        playShutDown();
    } else {
        playLogOff();
    }

    setIsFadingOut(true);
    setTimeout(() => {
        setIsFadingOut(false);
        if (action === 'logoff' || action === 'switchuser' || action === 'standby' || action === 'turnoff') {
            setIsLoggedIn(false);
        }
        if (action === 'restart') {
            setIsLoggedIn(false);
            setLoading(true);
        }
    }, 3000);
  };

  const handleShutdownCancel = () => {
    setShutdownMode(null);
  };

  // APLICATION RENDERING
  const renderWindow = (id: WindowId) => {

    /*** Game Window */
    if (id === 'minesweeper' && isMinesweeperOpen) {
      return (
        <Game
          key="minesweeper"
          onClose={() => {
            playMinimize()
            setIsMinesweeperOpen(false)
            removeFromOrder('minesweeper')
          }}
          isMinimized={minesweeper.isMinimized}
          isFullscreen={minesweeper.isFullscreen}
          setIsMinimized={handleMinesweeperMinimize}
          setIsFullscreen={() => minesweeper.toggleFullscreen()}
          onMouseDown={() => bringToFront('minesweeper')}
        />
      )
    }

    /*** IE Window */
    if (id === 'ie' && isIEOpen) {
      return (
        <IEWindow
          key="ie"
          onClose={() => { 
            playMinimize(); 
            setIsIEOpen(false); 
            removeFromOrder('ie') 
          }}
          isMinimized={ie.isMinimized}
          setIsMinimized={handleIEMinimize}
          isFullscreen={ie.isFullscreen}
          toggleFullscreen={ie.toggleFullscreen}
          onMouseDown={() => bringToFront('ie')}
        />
      )
    }

    /*** Paint Window */
    if (id === 'paint' && isPaintOpen) {
      return (
        <Paint
          key="paint"
          onClose={() => { 
            playMinimize(); 
            setIsPaintOpen(false); 
            removeFromOrder('paint') 
          }}
          isMinimized={paint.isMinimized}
          setIsMinimized={handlePaintMinimize}
          isFullscreen={paint.isFullscreen}
          setIsFullscreen={() => paint.toggleFullscreen()}
          onMouseDown={() => bringToFront('paint')}
        />
      )
    }

    /*** Calculator Window */
    if (id === 'calculator' && isCalculatorOpen) {
      return (
        <Calculator
          key="calculator"
          onClose={() => { 
            playMinimize(); 
            setIsCalculatorOpen(false); 
            removeFromOrder('calculator') 
          }}
          isMinimized={calculator.isMinimized}
          setIsMinimized={handleCalculatorMinimize}
          isFullscreen={calculator.isFullscreen}
          toggleFullscreen={calculator.toggleFullscreen}
          onMouseDown={() => bringToFront('calculator')}
        />
      )
    }

    /*** Terminal Window */
    if (id === 'terminal' && isTerminalOpen) {
      return (
        <Terminal
          key="terminal"
          onClose={() => { 
            playMinimize(); 
            setIsTerminalOpen(false); 
            removeFromOrder('terminal') 
          }}
          isMinimized={terminal.isMinimized}
          setIsMinimized={handleTerminalMinimize}
          isFullscreen={terminal.isFullscreen}
          toggleFullscreen={terminal.toggleFullscreen}
          onMouseDown={() => bringToFront('terminal')}
          apps={[
            { name: 'Minesweeper', size: '21,850' },
            { name: 'Internet Explorer', size: '85,900' },
            { name: 'Paint', size: '80,860' },
            { name: 'Calculator', size: '16,510' },
            { name: 'Command Prompt', size: '5,290' },
            { name: 'Loading Screen', size: '9,800' },
            { name: 'Start Menu', size: '14,270' },
            { name: 'Taskbar', size: '3,670' },
            { name: 'Error Bubble', size: '590' },
            { name: 'Critical Error', size: '10,540' },
            { name: 'Notepad', size: '13,410' },
            { name: 'Shutdown Screen', size: '11,680' },
            { name: 'Shutdown Display', size: '1,160' },
        ]}
        />
      )
    }

    /*** Notepad Window */
    if (id === 'notepad' && isNotepadOpen) {
      return (
        <Notepad
          key="notepad"
          onClose={() => { 
            playMinimize(); 
            setIsNotepadOpen(false); 
            removeFromOrder('notepad') 
          }}
          isMinimized={notepad.isMinimized}
          setIsMinimized={handleNotepadMinimize}
          isFullscreen={notepad.isFullscreen}
          toggleFullscreen={notepad.toggleFullscreen}
          onMouseDown={() => bringToFront('notepad')}
        />
      )
    }

    /*** Error Window */
    if (id === 'error' && activeError) {
      return (
        <CriticalError
          key="error"
          type={activeError}
          onClose={() => {
            setActiveError(null);
            removeFromOrder('error');
          }}
          onMouseDown={() => bringToFront('error')}
        />
      )
    }

    return null
  }

 
  return !isLoggedIn ? (
    <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      ) : loading ? (
          <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
          <div className={`app`}>
            <div className="app-wrapper">
              <a 
                  href="#" 
                  className="desktop-item"
                  onDoubleClick={() => openError('appNotFound')}
                >
                <img className="app-icon my-computer" src={MyComputer} alt="My Computer" />
                <span className="desktop-item-label">My Computer</span>
              </a>
              <div className="desktop-item" onDoubleClick={openIE}>
                <img className="app-icon ie" src={IntertExplorer} alt="Internet Explorer" />
                <span className="desktop-item-label">Internet Explorer</span>
              </div>

              <div className="desktop-item" onDoubleClick={openMinesweeper}>
                <img className="app-icon paint" src={MinesweeperIcon} alt="Minesweeper" />
                <span className="desktop-item-label">Minesweeper</span>
              </div>

              <div className="desktop-item" onDoubleClick={openPaint}>
                <img className="app-icon paint" src={PaintIcon} alt="Paint" />
                <span className="desktop-item-label">Paint</span>
              </div>

              <div className="desktop-item" onDoubleClick={openCalculator}>
                <img className="app-icon paint" src={CalculatorIcon} alt="Calculator" />
                <span className="desktop-item-label">Calculator</span>
              </div>

              <div className="desktop-item" onDoubleClick={openTerminal}>
                <img className="app-icon paint" src={TerminalIcon} alt="Windows CMD" />
                <span className="desktop-item-label">Terminal</span>
              </div>

              <div className="desktop-item" onDoubleClick={openNotepad}>
                  <img className="app-icon" src={NotepadIcon} alt="Notepad" />
                  <span className="desktop-item-label">Notepad</span>
              </div>

              <a href="#" className="desktop-item">
                <img className="app-icon bin" src={Bin} alt="Recycle Bin" />
                <span className="desktop-item-label">Recycle Bin</span>
              </a>
            </div>

            {windowOrder.map(renderWindow)}

            {shutdownMode && (
                <ShutdownScreen
                    mode={shutdownMode}
                    onCancel={handleShutdownCancel}
                    onAction={handleShutdownAction}
                />
            )}

            <Footer
              handleFullscreen={handleFullscreen}
              onAppUnavailable={openError}
              onIEOpen={openIE}
              onPaintOpen={openPaint}
              onMinesweeperOpen={openMinesweeper}
              onTerminalOpen={openTerminal}
              onCalculatorOpen={openCalculator}
              onNotepadOpen={openNotepad}
              minesweeperMinimized={minesweeper.isMinimized}
              setMinesweeperMinimized={handleMinesweeperMinimize}
              ieMinimized={ie.isMinimized}
              setIeMinimized={handleIEMinimize}
              terminalMinimized={terminal.isMinimized}
              setTerminalMinimized={handleTerminalMinimize}
              paintMinimized={paint.isMinimized}
              setPaintMinimized={handlePaintMinimize}
              calculatorMinimized={calculator.isMinimized}
              setCalculatorMinimized={handleCalculatorMinimize}
              notepadMinimized={notepad.isMinimized}
              setNotepadMinimized={handleNotepadMinimize}
              isMinesweeperOpen={isMinesweeperOpen}
              isIEOpen={isIEOpen}
              isPaintOpen={isPaintOpen}
              isCalculatorOpen={isCalculatorOpen}
              isTerminalOpen={isTerminalOpen}
              isNotepadOpen={isNotepadOpen}
              onLogOff={() => openShutdown('logoff')}
              onTurnOff={() => openShutdown('turnoff')}
            />

            {/* FadeOut Overlay */}
            {isFadingOut && (
              <div style={{
                  position: 'fixed',
                  inset: 0,
                  background: '#000',
                  opacity: 1,
                  zIndex: 99999,
                  animation: 'fadeToBlack 0.8s ease forwards',
              }} />
          )}
          </div>
      )
};

export default App;