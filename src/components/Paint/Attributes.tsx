import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';  
import '../../components/ModalStyle.css';

interface AttributesProps {
  onClose: () => void;
  onConfirm: (width: number, height: number) => void;
  currentWidth: number;
  currentHeight: number;
  style?: React.CSSProperties;
}

const Attributes = ({ onClose, onConfirm, currentWidth, currentHeight, style }: AttributesProps) => {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

  const handleOk = () => {
    onConfirm(width, height);
    onClose();
  };

  return (
    <div 
      className="xp-dialog xp-dialog--attributes" 
      style={{ ...style, ...draggableStyle }}
      ref={dialogRef}
      tabIndex={-1}
      onMouseDown={onMouseDown}
    >
      <div className="title-bar">
        <div className="title-bar-text">Attributes</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>
      <div className="attributes-layout">
        <div className="attributes-groups">
          <fieldset className="attributes-group">
            <legend>Size</legend>
            <label className="attributes-row">
              <span>Width:</span>
              <input
                className="attributes-input"
                type="number"
                value={width}
                min={1}
                onChange={e => setWidth(Number(e.target.value))}
                autoFocus
              />
              <span>pixels</span>
            </label>
            <label className="attributes-row">
              <span>Height:</span>
              <input
                className="attributes-input"
                type="number"
                value={height}
                min={1}
                onChange={e => setHeight(Number(e.target.value))}
              />
              <span>pixels</span>
            </label>
          </fieldset>
        </div>
        <div className="attributes-actions">
          <button 
            type="button" 
            id="xp-default-btn"
            onClick={handleOk}
          >OK</button>
          <button 
            type="button" 
            onClick={onClose}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Attributes;