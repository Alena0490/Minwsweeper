import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';  
import '../../components/ModalStyle.css';

interface FlipRotateProps {
  onClose: () => void;
  onConfirm: (action: 'flipH' | 'flipV' | 'rotate', angle?: number) => void;
  style?: React.CSSProperties;
}

const FlipRotate = ({ onClose, onConfirm, style }: FlipRotateProps) => {
  const [mode, setMode] = useState<'flipH' | 'flipV' | 'rotate'>('flipH');
  const [angle, setAngle] = useState<90 | 180 | 270 | 'custom'>(90);
  const [customAngle, setCustomAngle] = useState(0);

  const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

  const handleOk = () => {
    if (mode === 'rotate') {
      onConfirm('rotate', angle === 'custom' ? customAngle : angle);
    } else {
      onConfirm(mode);
    }
    onClose();
  };

  const rotateDisabled = mode !== 'rotate';

  return (
    <div 
      className="xp-dialog xp-dialog--flip-rotate" 
      style={{ ...style, ...draggableStyle }}
      ref={dialogRef}
      tabIndex={-1}
      onMouseDown={onMouseDown}
    >
      <div className="title-bar">
        <div className="title-bar-text">Flip and Rotate</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>

      <div className="flip-rotate-layout">
        <fieldset className="flip-rotate-group">
          <legend>Flip or rotate</legend>

          <label className="flip-rotate-option">
            <input
                type="radio"
                name="mode"
                checked={mode === 'flipH'}
                onChange={() => setMode('flipH')}
                autoFocus
            />
            <span>Flip horizontal</span>
          </label>

          <label className="flip-rotate-option">
            <input
              type="radio"
              name="mode"
              checked={mode === 'flipV'}
              onChange={() => setMode('flipV')}
            />
            <span>Flip vertical</span>
          </label>

          <label className="flip-rotate-option flip-rotate-option--with-gap">
            <input
              type="radio"
              name="mode"
              checked={mode === 'rotate'}
              onChange={() => setMode('rotate')}
            />
            <span>Rotate by angle</span>
          </label>

          <div className={`flip-rotate-suboptions ${rotateDisabled ? 'is-disabled' : ''}`}>
            <label className="flip-rotate-option">
              <input
                type="radio"
                name="angle"
                checked={angle === 90}
                onChange={() => setAngle(90)}
              />
              <span>90°</span>
            </label>

            <label className="flip-rotate-option">
              <input
                type="radio"
                name="angle"
                checked={angle === 180}
                onChange={() => setAngle(180)}
              />
              <span>180°</span>
            </label>

            <label className="flip-rotate-option">
              <input
                type="radio"
                name="angle"
                checked={angle === 270}
                onChange={() => setAngle(270)}
              />
              <span>270°</span>
            </label>

            <div className="flip-rotate-custom-row">
              <input
                className="flip-rotate-input"
                type="number"
                value={customAngle}
                onChange={(e) => {
                  setAngle('custom');
                  setCustomAngle(Number(e.target.value));
                }}
              />
              <span className="flip-rotate-degrees-label">Degrees</span>
            </div>
          </div>
        </fieldset>

        <div className="flip-rotate-actions">
            <button
                id="xp-default-btn" 
                type="button" 
                className="xp-btn xp-btn--default" 
                onClick={handleOk}
            >
                OK
            </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FlipRotate;