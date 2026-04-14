import './GameMiniModal.css'

const About = ({ onClose }: { onClose: () => void }) => {
  return (
    <div id='about' className='mini-modal'>
        <header>
            <h3>About</h3>
            <button onClick={onClose}>✕</button>
        </header>
        <div className='main-text'>
            <div className='info'>
                <p>Version 1.0</p>
                <p>Copyright Alena Pumprová 2026</p>
            </div>
            <a 
                href="https://alena-pumprova.cz/"
                target='_blank'
                rel='noopener noreferrer'
                >About me</a>
            <button type="button" onClick={onClose}>OK</button>
        </div>   
    </div>
  )
}

export default About
