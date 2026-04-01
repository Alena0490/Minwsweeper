import Game from "./components/Game"
import Footer from "./components/Footer"
import MyComputer from './img/My Computer.png'
import IntertExplorer from './img/Internet Explorer 6.png'
import Bin from './img/Recycle Bin (empty).png'

interface FullscreenHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const App = () => {
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
        <a href="https://alena-pumprova.cz/" className="desktop-item" target="_blank" rel="noopener noreferrer">
          <img className="app-icon ie" src={IntertExplorer} alt="Internet Explorer" />
          <span className="desktop-item-label">Internet Explorer</span>
        </a>
        <a href="#" className="desktop-item">
          <img className="app-icon bin" src={Bin} alt="Recycle Bin" />
          <span className="desktop-item-label">Recycle Bin</span>
        </a>
      </div>
      <Game />
      <Footer 
        handleFullscreen ={handleFullscreen } 
      />
    </div>
  );
};

export default App

