import { useEffect, useRef } from 'react';
import '../../components/ModalStyle.css';

interface ThumbnailProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onClose: () => void;
}

const Thumbnail = ({ canvasRef, onClose }: ThumbnailProps) => {
  const thumbRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const update = () => {
      const src = canvasRef.current;
      const dst = thumbRef.current;
      if (!src || !dst) return;

      const ctx = dst.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, dst.width, dst.height);
      ctx.drawImage(src, 0, 0, dst.width, dst.height);
    };

    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [canvasRef]);

  return (
    <div
      ref={dialogRef}
      className="xp-dialog thumbnail-dialog"
      tabIndex={-1}
    >
      <div className="title-bar">
        <div className="title-bar-text">Thumbnail</div>
        <div className="title-bar-buttons">
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>

      <div className="thumbnail-body">
        <canvas
          ref={thumbRef}
          width={150}
          height={100}
          className="thumbnail-canvas"
        />
      </div>
    </div>
  );
};

export default Thumbnail;