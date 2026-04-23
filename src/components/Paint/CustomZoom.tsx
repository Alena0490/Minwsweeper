import { useState } from 'react';
import { useDraggableDialog } from '../../hooks/useDraggableDialog';  
import '../../components/ModalStyle.css';

interface CustomZoomProps {
  onClose: () => void;
  onConfirm: (zoom: number) => void;
  currentZoom: number;
  style?: React.CSSProperties;
}

const CustomZoom = ({ onClose, onConfirm, currentZoom, style }: CustomZoomProps) => {
  const presets = [100, 200, 400, 600, 800];
  const currentPercent = Math.round(currentZoom * 100);
  const [selected, setSelected] = useState<number | 'custom'>(
    presets.includes(currentPercent) ? currentPercent : 'custom'
  );
  const [customValue, setCustomValue] = useState(currentPercent);

  const { dialogRef, onMouseDown, draggableStyle } = useDraggableDialog();

  const handleOk = () => {
    const value = selected === 'custom' ? customValue : selected;
    onConfirm(value / 100);
    onClose();
  };

  return (
    <div 
        className="xp-dialog xp-dialog--custom-zoom" 
        style={{ ...style, ...draggableStyle }}
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={onMouseDown}
    >
      <div className="title-bar">
        <div className="title-bar-text">Custom Zoom</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
        </div>
      </div>
      <div className="custom-zoom-layout">
        <div className="custom-zoom-main">
          <div className="custom-zoom-current">
            Current zoom: &nbsp; {currentPercent}%
          </div>
          <fieldset className="custom-zoom-group">
            <legend>Zoom to</legend>
            <div className="custom-zoom-grid">
              {presets.map(p => (
                <label key={p} className="custom-zoom-option">
                  <input
                    type="radio"
                    name="zoom"
                    checked={selected === p}
                    onChange={() => setSelected(p)}
                  />
                  {p}%
                </label>
              ))}
              <label className="custom-zoom-option">
                <input
                  type="radio"
                  name="zoom"
                  checked={selected === 'custom'}
                  onChange={() => setSelected('custom')}
                />
                <input
                  className="custom-zoom-input"
                  type="number"
                  value={customValue}
                  min={1}
                  max={800}
                  onChange={e => { setSelected('custom'); setCustomValue(Number(e.target.value)); }}
                />
                %
              </label>
            </div>
          </fieldset>
        </div>
        <div className="custom-zoom-actions">
            <button 
                id="xp-default-btn"
                type="button" 
                onClick={handleOk} 
                autoFocus
            >
                OK
            </button>
            <button 
                type="button" 
                onClick={onClose}
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default CustomZoom;