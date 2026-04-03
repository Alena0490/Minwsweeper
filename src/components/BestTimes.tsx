import './GameMenu.css'

const BestTimes = () => {
  return (
    <div id='times'>
        <header>
            <h3>Fastest</h3>
            <button className='red'>✕</button>
        </header>
        <div className='main-text'>
            <p>Fastes Mine Sweepes</p>
            <ul>
                <li>Easy: <span>999.999</span></li>
                <li>Intermediate: <span>999.999</span></li>
                <li>Expert: <span>999.999</span></li>
            </ul>
            
            <div className="set-buttons">
                <button><span className='underlie'>R</span>eset</button>
                <button>OK</button>
            </div>
        </div>
    </div>
  )
}

export default BestTimes
