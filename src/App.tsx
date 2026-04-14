import { useState } from "react"
import Game from "./components/minesweeper/Game"
import IEWindow from "./components/IEWindow"
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
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
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
        {isIEOpen && <IEWindow onClose={() => setIsIEOpen(false)} />}
        <a href="#" className="desktop-item">
          <img className="app-icon bin" src={Bin} alt="Recycle Bin" />
          <span className="desktop-item-label">Recycle Bin</span>
        </a>
      </div>
      <Game
        isMinimized={isMinimized} 
        setIsMinimized={setIsMinimized}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />
      <Footer 
        handleFullscreen ={handleFullscreen }
        isMinimized={isMinimized} 
        setIsMinimized={setIsMinimized}
        onIEOpen={() => setIsIEOpen(true)}
      />
    </div>
  );
};

export default App

