import { useState } from "react"
import useWindowState from './hooks/useWindowState';
import Game from "./components/minesweeper/Game"
import IEWindow from "./components/IE/IEWindow"
import Footer from "./components/Footer"
import MyComputer from './img/MyComputer.webp'
import IntertExplorer from './img/InternetExplorer6.webp'
import Bin from './img/RecycleBinEmpty.webp'
import './App.css'

interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}


const App = () => {
  const minesweeper = useWindowState();
  const ie = useWindowState();

  const [isIEOpen, setIsIEOpen] = useState(false)

  const handleFullscreen = () => {
    const elem = document.documentElement as FullscreenHTMLElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  return (
    <div className="app">
      <div className="app-wrapper">
        <a href="#" className="desktop-item">
          <img className="app-icon my-computer" src={MyComputer} alt="My Computer" />
          <span className="desktop-item-label">My Computer</span>
        </a>
        <div 
          className="desktop-item"
          onDoubleClick={() => setIsIEOpen(true)}
        >
          <img className="app-icon ie" src={IntertExplorer} alt="Internet Explorer" />
          <span className="desktop-item-label">Internet Explorer</span>
        </div>
          {/* {isIEOpen && <IEWindow onClose={() => setIsIEOpen(false)} />} */}
          <a href="#" className="desktop-item">
            <img className="app-icon bin" src={Bin} alt="Recycle Bin" />
            <span className="desktop-item-label">Recycle Bin</span>
          </a>
        </div>
        <Game
          isMinimized={minesweeper.isMinimized}
          isFullscreen={minesweeper.isFullscreen}
          setIsMinimized={minesweeper.setIsMinimized}
          setIsFullscreen={() => minesweeper.toggleFullscreen()}
        />
        {isIEOpen && <IEWindow 
          onClose={() => setIsIEOpen(false)}
          isMinimized={ie.isMinimized}
          setIsMinimized={ie.setIsMinimized}
          isFullscreen={ie.isFullscreen}
          toggleFullscreen={ie.toggleFullscreen}
      />}

      <Footer 
          handleFullscreen={handleFullscreen}
          onIEOpen={() => setIsIEOpen(true)}
          minesweeperMinimized={minesweeper.isMinimized}
          setMinesweeperMinimized={minesweeper.setIsMinimized}
          ieMinimized={ie.isMinimized}
          setIeMinimized={ie.setIsMinimized}
          isIEOpen={isIEOpen}
      />
    </div>
  );
};

export default App

