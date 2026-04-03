import './GameMiniModal.css'

const About = () => {
  return (
    <div id='about' className='mini-modal'>
        <header>
            <h3>About</h3>
            <button>✕</button>
        </header>
        <div className='main-text'>
            <p></p>
            <p>Copyright Alena Pumprová 2026</p>
            <a 
                href="https://alena-pumprova.cz/"
                target='_blank'
                rel='noopener noreferrer'
                >About me</a>
            <button>OK</button>
        </div>   
    </div>
  )
}

export default About
