import Game from "./components/Game"
import Footer from "./components/Footer"

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
      <Game />
      <Footer 
        handleFullscreen ={handleFullscreen } 
      />
    </div>
  );
};

export default App

