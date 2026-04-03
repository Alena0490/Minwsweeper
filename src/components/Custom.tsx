import './GameMiniModal.css'

const Custom = () => {
  return (
    <div id='custom' className='mini-modal'>
       <header>
            <h3>Custom</h3>
            <button>✕</button>
        </header>
        <div className='main-text'>
            <ul>
                <li><label htmlFor="height">Height:</label> <input type="number" /></li>
                <li><label htmlFor="height">Width:</label> <input type="number" /></li>
                <li><label htmlFor="height">Mines:</label> <input type="number" /></li>
            </ul>
            
            <div className="set-buttons">
                <button type="button">Cancel</button>
                <button type="button">OK</button>
            </div>
        </div>
    </div>
  )
}

export default Custom
