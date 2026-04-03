import './GameMiniModal.css'

const Custom = () => {
  return (
    <div id='custom'>
       <header>
            <h3>Custom</h3>
            <button>✕</button>
        </header>
        <div className='main-text'>
            <p>Fastes Mine Sweepes</p>
            <ul>
                <li>Height: <input type="number" /></li>
                <li>Width: <input type="number" /></li>
                <li>Mines: <input type="number" /></li>
            </ul>
            
            <div className="set-buttons">
                <button>Cancel</button>
                <button>OK</button>
            </div>
        </div>
    </div>
  )
}

export default Custom
