import { useState } from "react"
import useSound from './hooks/useSound'
import useWindowState from './hooks/useWindowState';

import LoadingScreen from './components/XPLoading'
import Game from "./components/minesweeper/Game"
import Paint from './components/Paint/Paint'
import IEWindow from "./components/IE/IEWindow"
import Calculator from "./components/Calculator/Calculator"
import Footer from "./components/Footer"
import Terminal from "./components/Terminal/Terminal";

import MyComputer from './img/MyComputer.webp'
import IntertExplorer from './img/InternetExplorer6.webp'
import Bin from './img/RecycleBinEmpty.webp'
import MinesweeperIcon from './img/Minesweeper.webp'
import PaintIcon from './img/Paint.webp'
import CalculatorIcon from './img/Calculator.webp'
import TerminalIcon from './img/CommandPrompt.webp'
import './App.css'

interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const App = () => {
  const { playStart, playMinimize } = useSound();

  const minesweeper = useWindowState();
  const ie = useWindowState();
  const paint = useWindowState();
  const calculator = useWindowState();
  const terminal = useWindowState();

  const [isIEOpen, setIsIEOpen] = useState(false);
  const [isPaintOpen, setIsPaintOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isMinesweeperOpen, setIsMinesweeperOpen] = useState(true)
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  const handleFullscreen = () => {
    const elem = document.documentElement as FullscreenHTMLElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

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

  /*** OPEN APPS */
  // Open IE
  const openIE = () => {
    if (!isIEOpen) {
      playStart();
      setIsIEOpen(true);
    } else if (ie.isMinimized) {
      handleIEMinimize(false);
    }
  };

  // Open Minesweeper
  const openMinesweeper = () => {
    if (!isMinesweeperOpen) {
      playStart();
      setIsMinesweeperOpen(true);
    } else if (minesweeper.isMinimized) {
      handleMinesweeperMinimize(false);
    }
  };

  // Open Paint
  const openPaint = () => {
    if (!isPaintOpen) {
      playStart();
      setIsPaintOpen(true);
    } else if (paint.isMinimized) {
      handlePaintMinimize(false);
    }
  };

  // Open Calculator
  const openCalculator = () => {
    if (!isCalculatorOpen) {
      playStart();
      setIsCalculatorOpen(true);
    } else if (calculator.isMinimized) {
      handleCalculatorMinimize(false);
    }
  };

  // Open Terminal
  const openTerminal = () => {
    if (!isTerminalOpen) {
      playStart();
      setIsTerminalOpen(true);
    } else if (terminal.isMinimized) {
      handleTerminalMinimize(false);
    }
  };

  return loading ? (
    <LoadingScreen onFinish={() => setLoading(false)} />
  ) : (
    <div className="app">
      <div className="app-wrapper">
        <a href="#" className="desktop-item">
          <img className="app-icon my-computer" src={MyComputer} alt="My Computer" />
          <span className="desktop-item-label">My Computer</span>
        </a>
        <div className="desktop-item" onDoubleClick={openIE}>
          <img className="app-icon ie" src={IntertExplorer} alt="Internet Explorer" />
          <span className="desktop-item-label">Internet Explorer</span>
        </div>

        {/* Minesweeper Desktop Icon*/}
        <div className="desktop-item" onDoubleClick={openMinesweeper}>
          <img className="app-icon paint" src={MinesweeperIcon} alt="Minesweeper" />
          <span className="desktop-item-label">Minesweeper</span>
        </div>

        {/* Paint Desktop Icon*/}
        <div className="desktop-item" onDoubleClick={openPaint}>
          <img className="app-icon paint" src={PaintIcon} alt="Paint" />
          <span className="desktop-item-label">Paint</span>
        </div>

        {/* Calculator Desktop Icon*/}
        <div className="desktop-item" onDoubleClick={openCalculator}>
          <img className="app-icon paint" src={CalculatorIcon} alt="Calculator" />
          <span className="desktop-item-label">Calculator</span>
        </div>

        {/* Terminal Desktop Icon*/}
        <div className="desktop-item" onDoubleClick={openTerminal}>
          <img className="app-icon paint" src={TerminalIcon} alt="Windows CMD" />
          <span className="desktop-item-label">Terminal</span>
        </div>

        <a href="#" className="desktop-item">
          <img className="app-icon bin" src={Bin} alt="Recycle Bin" />
          <span className="desktop-item-label">Recycle Bin</span>
        </a>
      </div>

       {/* Game window */}
      {isMinesweeperOpen && (
        <Game
          onClose={() => { playMinimize(); setIsMinesweeperOpen(false); }}
          isMinimized={minesweeper.isMinimized}
          isFullscreen={minesweeper.isFullscreen}
          setIsMinimized={handleMinesweeperMinimize}
          setIsFullscreen={() => minesweeper.toggleFullscreen()}
        />
      )}

      {/* IE window */}
      {isIEOpen && (
        <IEWindow
          onClose={() => { playMinimize(); setIsIEOpen(false); }}
          isMinimized={ie.isMinimized}
          setIsMinimized={handleIEMinimize}
          isFullscreen={ie.isFullscreen}
          toggleFullscreen={ie.toggleFullscreen}
        />
      )}

      {/* Paint window */}
      {isPaintOpen && (
        <Paint
          onClose={() => { playMinimize(); setIsPaintOpen(false); }}
          isMinimized={paint.isMinimized}
          setIsMinimized={handlePaintMinimize}
          isFullscreen={paint.isFullscreen}
          setIsFullscreen={() => paint.toggleFullscreen()}
        />
      )}

      {/* Calculator window */}
      {isCalculatorOpen && (
        <Calculator
          onClose={() => { playMinimize(); setIsCalculatorOpen(false); }}
          isMinimized={calculator.isMinimized}
          setIsMinimized={handleCalculatorMinimize}
          isFullscreen={calculator.isFullscreen}
          toggleFullscreen={calculator.toggleFullscreen}
        />
      )}

      {/* Terminal window */}
      {isTerminalOpen && (
        <Terminal
          onClose={() => { playMinimize(); setIsTerminalOpen(false); }}
          isMinimized={terminal.isMinimized}
          setIsMinimized={handleTerminalMinimize}
          isFullscreen={terminal.isFullscreen}
          toggleFullscreen={terminal.toggleFullscreen}
          apps={[
            { name: 'Minesweeper', size: '42,200' },
            { name: 'Internet Explorer', size: '101,880' },
            { name: 'Paint', size: '99,040' },
            { name: 'Calculator', size: '26,130' },
            { name: 'Command Prompt', size: '3,550' },
            { name: 'Loading Screen', size: '17,140' },
            { name: 'Start Menu', size: '22,900' },
            { name: 'Taskbar', size: '5,220' },
            { name: 'Error Bubble', size: '1,730' },
        ]}
        />
      )}

      <Footer
        handleFullscreen={handleFullscreen}

        onIEOpen={openIE}
        onPaintOpen={openPaint}
        onMinesweeperOpen={openMinesweeper}
        onTerminalOpen={openTerminal}
        onCalculatorOpen={openCalculator}

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

        isMinesweeperOpen={isMinesweeperOpen}
        isIEOpen={isIEOpen}
        isPaintOpen={isPaintOpen}
        isCalculatorOpen={isCalculatorOpen}
        isTerminalOpen={isTerminalOpen}
      />
    </div>
  );
};

export default App;