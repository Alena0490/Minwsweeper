import { useState } from 'react';
import SkewX from '../../img/Paint/skew-x.png';
import SkewY from '../../img/Paint/skew-y.png';
import StretchX from '../../img/Paint/stretch-x.png';
import StretchY from '../../img/Paint/stretch-y.png';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';  
import '../../components/ModalStyle.css';

interface StretchSkewProps {
  onClose: () => void;
  onConfirm: (stretchH: number, stretchV: number, skewH: number, skewV: number) => void;
  style?: React.CSSProperties;
}

const StretchSkew = ({ onClose, onConfirm, style }: StretchSkewProps) => {
  const [stretchH, setStretchH] = useState(100);
  const [stretchV, setStretchV] = useState(100);
  const [skewH, setSkewH] = useState(0);
  const [skewV, setSkewV] = useState(0);

  const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

  const handleOk = () => {
    onConfirm(stretchH, stretchV, skewH, skewV);
    onClose();
  };

  return (
    <div 
        className="xp-dialog xp-dialog--stretch-skew" 
        style={{ ...style, ...draggableStyle }} 
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={onMouseDown}
    >
        <div className="title-bar">
            <div className="title-bar-text">Stretch and Skew</div>
            <div className="title-bar-buttons">
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
                ×
            </button>
            </div>
        </div>

        <div className="stretch-skew-layout">
            <div className="stretch-skew-groups">
            <fieldset className="stretch-skew-group">
                <legend>Stretch</legend>

                <div className="stretch-skew-row">
                    <img src={StretchX} alt="" aria-hidden="true" className="stretch-skew-icon" />
                    <label htmlFor="stretch-horizontal" className="stretch-skew-label">
                        Horizontal:
                    </label>
                    <input
                        id="stretch-horizontal"
                        className="stretch-skew-input"
                        type="number"
                        value={stretchH}
                        min={1}
                        onChange={(e) => setStretchH(Number(e.target.value))}
                        autoFocus
                    />
                    <span className="stretch-skew-unit">%</span>
                </div>

                <div className="stretch-skew-row">
                    <img src={StretchY} alt="" aria-hidden="true" className="stretch-skew-icon" />
                    <label htmlFor="stretch-vertical" className="stretch-skew-label">
                        Vertical:
                    </label>
                    <input
                        id="stretch-vertical"
                        className="stretch-skew-input"
                        type="number"
                        value={stretchV}
                        min={1}
                        onChange={(e) => setStretchV(Number(e.target.value))}
                    />
                    <span className="stretch-skew-unit">%</span>
                </div>
            </fieldset>

            <fieldset className="stretch-skew-group">
                <legend>Skew</legend>

                <div className="stretch-skew-row">
                    <img src={SkewX} alt="" aria-hidden="true" className="stretch-skew-icon" />
                    <label htmlFor="skew-horizontal" className="stretch-skew-label">
                        Horizontal:
                    </label>
                    <input
                        id="skew-horizontal"
                        className="stretch-skew-input"
                        type="number"
                        value={skewH}
                        onChange={(e) => setSkewH(Number(e.target.value))}
                    />
                    <span className="stretch-skew-unit">Degrees</span>
                </div>

                <div className="stretch-skew-row">
                    <img src={SkewY} alt="" aria-hidden="true" className="stretch-skew-icon" />
                    <label htmlFor="skew-vertical" className="stretch-skew-label">
                        Vertical:
                    </label>
                    <input
                        id="skew-vertical"
                        className="stretch-skew-input"
                        type="number"
                        value={skewV}
                        onChange={(e) => setSkewV(Number(e.target.value))}
                    />
                    <span className="stretch-skew-unit">Degrees</span>
                </div>
            </fieldset>
        </div>

        <div className="stretch-skew-actions">
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

export default StretchSkew;