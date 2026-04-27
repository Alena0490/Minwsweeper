import SecurityIcon from '../img/SecurityError.webp'
import './ErrorBubble.css'

interface ErrorBubbleProps {
    onClose: () => void
}

const ErrorBubble = ({ onClose }: ErrorBubbleProps) => {
  return (
    <div className='balloon'>
      <div className='balloon-header'>
        <img src={SecurityIcon} alt="Security" className='balloon-icon' />
        <span className='bubble-bold'>Your computer might be at risk</span>
        <button className='balloon-close' onClick={onClose}>✕</button>
      </div>
      <p>Antivirus software might not be installed</p>
      <p>Click this balloon to fix this problem.</p>
    </div>
  )
}

export default ErrorBubble