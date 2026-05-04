import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import '../ModalStyle.css';

interface AboutProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const AboutCalculator = ({ onClose, style }: AboutProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

    return (
        <div
            id='about'
            className='xp-dialog'
            style={{ ...style, ...draggableStyle }}
            ref={dialogRef}
            tabIndex={-1}
            onMouseDown={onMouseDown}
        >
            <div className='title-bar'>
                <div className='title-bar-text'>About Calculator</div>
                <div className='title-bar-buttons'>
                    <button
                        type='button'
                        className='btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        &#215;
                    </button>
                </div>
            </div>
            <div className='xp-dialog-body'>
                <div className='info'>
                    <p>Version 1.0</p>
                    <p>Copyright Alena Pumprová 2026</p>
                </div>
                  <a
                    href='https://alena-pumprova.cz/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    About me
                </a>
                <button
                    type='button'
                    onClick={onClose}
                    autoFocus
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default AboutCalculator;