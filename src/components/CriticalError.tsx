import useDraggable from '../hooks/useDraggable'
import CriticalErrorIcon from '../img/Critical.webp'
import WarningIcon from '../img/Important.webp'
// import InfoIcon from '../img/Information.webp'
import './CriticalError.css'
import '../App.css'

interface ErrorButton {
    label: string
    isDefault?: boolean
    onClick?: () => void
}

interface ErrorConfig {
    titleBar: string
    message: string[]
    icon: string
    buttons: ErrorButton[]
}

export type ErrorType =
    | 'appNotFound'
    | 'accessDenied'
    | 'hardDriveFailure'
    | 'renameExtension'
    // další přidávej sem

const errorConfig: Record<ErrorType, ErrorConfig> = {
    appNotFound: {
        titleBar: 'C:\\WINDOWS\\system32\\msimn.exe',
        message: [
            'C:\\WINDOWS\\system32\\msimn.exe',
            'Application not found',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },
    accessDenied: {
        titleBar: 'Local Disk (C:)',
        message: [
            'C:\\Restricted is not accessible.',
            'Access is denied.',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },
    hardDriveFailure: {
        titleBar: 'Hard Drive Failure',
        message: [
            'The system has detected a problem with one or more installed IDE / SATA hard disks.',
            'It is recommended that you restart the system.',
        ],
        icon: CriticalErrorIcon,
        buttons: [{ label: 'OK', isDefault: true }],
    },
    renameExtension: {
        titleBar: 'Rename',
        message: [
            'If you change a file name extension, the file may become unusable.',
            'Are you sure you want to change it?',
        ],
        icon: WarningIcon,
        buttons: [{ label: 'Yes', isDefault: true }, { label: 'No' }],
    },
}

interface ErrorProps {
    type: ErrorType
    onClose: () => void
}

const CriticalError = ({ type, onClose }: ErrorProps) => {
    const { titleBar, message, icon, buttons } = errorConfig[type]

    const { position, handleMouseDown } = useDraggable(
        Math.round(window.innerWidth / 2 - 190),
        Math.round(window.innerHeight / 2 - 100)
    )

    return (
        <div
            className="app-window error-window"
            style={{ left: position.x, top: position.y }}
        >
            <div className="title-bar" onMouseDown={handleMouseDown}>
                <span className="title-bar-text">
                    <img className="error-title-icon" src={icon} alt="" />
                    {titleBar}
                </span>
                <div className="title-bar-buttons">
                    <button
                        className="btn-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="error-body">
                <img className="error-body-icon" src={icon} alt="" />
                <div className="error-text">
                    {message.map((line, i) => (
                        <span key={i} className="error-message">{line}</span>
                    ))}
                </div>
            </div>

            <div className="error-footer">
                {buttons.map((btn) => (
                    <button
                        key={btn.label}
                        id={btn.isDefault ? 'xp-default-btn' : undefined}
                        className="error-dialog-btn"
                        onClick={btn.onClick ?? onClose}
                        type="button"
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CriticalError