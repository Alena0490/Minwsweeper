import './GameMiniModal.css'

const BestTimes = () => {
  return (
    <div id='times' className='mini-modal'>
        <header>
            <h3>Fastest</h3>
            <button className='red'>✕</button>
        </header>
        <div className='main-text'>
            <p>Fastest Mine Sweepers</p>
            <ul className='times'>
                <li>Easy: <span>999.999</span></li>
                <li>Intermediate: <span>999.999</span></li>
                <li>Expert: <span>999.999</span></li>
            </ul>
            
            <div className="set-buttons">
                <button type="button"><span className='underlie'>R</span>eset</button>
                <button type="button">OK</button>
            </div>
        </div>
    </div>
  )
}

export default BestTimes
