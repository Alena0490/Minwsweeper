import './GameMiniModal.css'

interface CustomProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const Custom = ({ onClose, style }: CustomProps) => {
  return (
    <div id='custom' className='mini-modal' style={style}>
       <header>
            <h3>Custom</h3>
            <button onClick={onClose}>✕</button>
        </header>
        <div className='main-text'>
            <ul>
                <li><label htmlFor="height">Height:</label> <input type="number" /></li>
                <li><label htmlFor="height">Width:</label> <input type="number" /></li>
                <li><label htmlFor="height">Mines:</label> <input type="number" /></li>
            </ul>
            
            <div className="set-buttons">
                <button type="button" onClick={onClose}>Cancel</button>
                <button type="button" onClick={onClose}>OK</button>
            </div>
        </div>
    </div>
  )
}

export default Custom
