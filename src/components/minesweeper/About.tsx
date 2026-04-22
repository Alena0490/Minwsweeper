import './GameMiniModal.css'
import '../ModalStyle.css'

interface AboutProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const About = ({ onClose, style }: AboutProps) => {
  return (
    <div id="about" className="xp-dialog" style={style}>
      <div className="title-bar">
        <div className="title-bar-text">About Minesweeper</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>
      <div className="xp-dialog-body">
        <div className="info">
          <p>Version 1.0</p>
          <p>Copyright Alena Pumprová 2026</p>
        </div>
        <a href="https://alena-pumprova.cz/" target="_blank" rel="noopener noreferrer">About me</a>
        <button 
            type="button" 
            onClick={onClose}
            autoFocus
        >OK</button>
      </div>
    </div>
  )
}

export default About