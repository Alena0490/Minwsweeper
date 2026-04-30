import { useDraggableDialog } from '../../hooks/useDraggableDialog';
import './FindReplaceModal.css'
import '../ModalStyle.css'

interface DraggableDialogProps {
    onClose: () => void;
    style?: React.CSSProperties;
}

const ReplaceModal = ({style, onClose}: DraggableDialogProps) => {
    const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

  return (
    <div
        id="replace" 
        className="xp-dialog" 
        style={{ ...style, ...draggableStyle }}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={onMouseDown}
    >
        <div className="title-bar">
            <div className="title-bar-text">Replace</div>
            <div className="title-bar-buttons">
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
            </div>
        </div>
        <div className="xp-dialog-body">
            <div className="find-replace-row">
                <label htmlFor="find-input">Find what:</label>
                <input id="find-input" type="text" />
            </div>
            <div className="find-replace-row">
                <label htmlFor="replace-input">Replace with:</label>
                <input id="replace-input" type="text" />
            </div>
            <div className="find-replace-checkbox">
                <input id="match-case" type="checkbox" />
                <label htmlFor="match-case">Match case</label>
            </div>
        </div>
        <div className="xp-dialog-actions find-replace-actions">
            <button type="button">Find Next</button>
            <button type="button">Replace</button>
            <button type="button">Replace All</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </div>
    </div>
  )
}

export default ReplaceModal