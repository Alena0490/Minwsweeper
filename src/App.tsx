import { useState } from "react"
import useSound from './hooks/useSound'
import useWindowState from './hooks/useWindowState';
import Game from "./components/minesweeper/Game"
import Paint from './components/Paint/Paint'
import IEWindow from "./components/IE/IEWindow"
import Footer from "./components/Footer"
import MyComputer from './img/MyComputer.webp'
import IntertExplorer from './img/InternetExplorer6.webp'
import Bin from './img/RecycleBinEmpty.webp'
import PaintIcon from './img/Paint.webp'
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

  const [isIEOpen, setIsIEOpen] = useState(false);
  const [isPaintOpen, setIsPaintOpen] = useState(false);

  const handleFullscreen = () => {
    const elem = document.documentElement as FullscreenHTMLElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

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

  // Open IE
  const openIE = () => {
    if (!isIEOpen) {
      playStart();
      setIsIEOpen(true);
    } else if (ie.isMinimized) {
      handleIEMinimize(false);
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

  return (
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
        {/* Ikona Paint na ploše */}
        <div className="desktop-item" onDoubleClick={openPaint}>
          <img className="app-icon paint" src={PaintIcon} alt="Paint" />
          <span className="desktop-item-label">Paint</span>
        </div>
        <a href="#" className="desktop-item">
          <img className="app-icon bin" src={Bin} alt="Recycle Bin" />
          <span className="desktop-item-label">Recycle Bin</span>
        </a>
      </div>

      <Game
        isMinimized={minesweeper.isMinimized}
        isFullscreen={minesweeper.isFullscreen}
        setIsMinimized={handleMinesweeperMinimize}
        setIsFullscreen={() => minesweeper.toggleFullscreen()}
      />

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

      <Footer
        handleFullscreen={handleFullscreen}
        onIEOpen={openIE}
        onPaintOpen={openPaint}
        minesweeperMinimized={minesweeper.isMinimized}
        setMinesweeperMinimized={handleMinesweeperMinimize}
        ieMinimized={ie.isMinimized}
        setIeMinimized={handleIEMinimize}
        isIEOpen={isIEOpen}
        isPaintOpen={isPaintOpen}
        paintMinimized={paint.isMinimized}
        setPaintMinimized={handlePaintMinimize}
      />
    </div>
  );
};

export default App;