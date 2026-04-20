import {
  LINE_PRESETS,
  BRUSH_PRESETS,
  SPRAY_PRESETS,
  ZOOM_PRESETS,
  ERASER_PRESETS,
  RECT_PRESETS
} from "../../data/paintToolPresets"
// Images
import FreeSelect from '../../img/star.webp'
import RectSelect from '../../img/freeSelect.webp'
import Pen from '../../img/pen.webp'
import Eraser from '../../img/earaser.webp'
import Eyedrop from '../../img/eyedrop.webp'
import Bucket from '../../img/bucket.webp'
import Brush from '../../img/brush.webp'
import Spray from '../../img/spray.webp'
import Zoom from '../../img/zoom.webp'
import Text from '../../img/text.webp'
import Line from '../../img/line.webp'
import Curve from '../../img/curve.webp'
import Rectangle from '../../img/rectangle.webp'
import Polygon from '../../img/polygon.webp'
import Elipse from '../../img/elipse.webp'
import RoundedRectangle from '../../img/roundedRect.webp'
// Styles
import './Toolbox.css'


interface ToolboxProps {
  tool: string;
  setTool: (tool: string) => void;
  zoom: number; 
  setZoomLevel: (value: number) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  selectedLinePreset: number;
  setSelectedLinePreset: (i: number) => void;
  selectedBrushPreset: number;
  setSelectedBrushPreset: (i: number) => void;
  selectedSprayPreset: number;
  setSelectedSprayPreset: (i: number) => void;
  selectedEraserPreset: number;
  setSelectedEraserPreset: (i: number) => void;
  selectedShapePreset: number;
  setSelectedShapePreset: (i: number) => void;
}

const Toolbox = ({
  tool,
  setTool,
  zoom,
  setLineWidth,
  setZoomLevel,

  selectedLinePreset,
  setSelectedLinePreset,

  selectedBrushPreset,
  setSelectedBrushPreset,

  selectedSprayPreset,
  setSelectedSprayPreset,

  selectedEraserPreset,
  setSelectedEraserPreset,

  selectedShapePreset,
  setSelectedShapePreset,
}: ToolboxProps) => {
  // const DISABLED_TOOLS = ['freeselect', 'rectselect', 'text', 'curve', 'polygon', 'roundedrect'];

  return (
    <aside className="xp-toolbox">
      <div className="xp-tool-grid">
        <button 
            type="button" 
            title="Free Select"     
            onClick={() => {}} 
            className="xp-tool-btn xp-tool-btn--disabled"
          >
          <img 
            src={FreeSelect} 
            alt="Free Select" 
          />
        </button>

        <button 
          type="button" 
          title="Rect Select"     
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
        >
          <img 
            src={RectSelect} 
            alt="Rect Select" 
          />
        </button>

        <button 
          type="button" 
          title="Eraser"          
          className={`xp-tool-btn${tool==='eraser'     ?' active':''}`} 
          onClick={()=>setTool('eraser')}
        >
          <img 
            src={Eraser} 
            alt="Eraser" 
          />
        </button>

        <button 
          type="button" 
          title="Fill"            
          className={`xp-tool-btn${tool==='bucket'     ?' active':''}`} 
          onClick={()=>setTool('bucket')}
        >
          <img 
            src={Bucket} 
            alt="Fill" 
          />
        </button>

        <button 
          type="button" 
          title="Pick Color"      
          className={`xp-tool-btn${tool==='eyedropper' ?' active':''}`} 
          onClick={()=>setTool('eyedropper')}
        >
          <img 
            src={Eyedrop} 
            alt="Eyedropper" 
          />
        </button>

        <button 
          type="button" 
          title="Zoom"            
          className={`xp-tool-btn${tool === 'zoom' ? ' active' : ''}`}
          onClick={() => setTool('zoom')}
        >
          <img 
            src={Zoom} 
            alt="Zoom" 
          />
        </button>

        <button 
          type="button" 
          title="Pencil"          
          className={`xp-tool-btn${tool==='pencil' ?' active':''}`} 
          onClick={()=>setTool('pencil')}
        >
          <img 
            src={Pen} 
            alt="Pencil" 
          />
        </button>

        <button 
          type="button" 
          title="Brush"           
          className={`xp-tool-btn${tool === 'brush' ? ' active' : ''}`}
          onClick={() => setTool('brush')}
        >
          <img 
            src={Brush} 
            alt="Brush" 
          />
        </button>

        <button 
          type="button" 
          title="Airbrush"        
          className={`xp-tool-btn${tool === 'spray' ? ' active' : ''}`}
          onClick={() => setTool('spray')}
        >
          <img 
            src={Spray} 
            alt="Airbrush" 
          />
        </button>

        <button 
          type="button" 
          title="Text"            
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
        >
          <img 
            src={Text} 
            alt="Text" 
          />
        </button>
        
        <button 
          type="button" 
          title="Line"            
          className={`xp-tool-btn${tool==='line' ?' active':''}`}
          onClick={() => setTool('line')}
        >
          <img 
            src={Line} 
            alt="Line" 
          />
        </button>

        <button 
          type="button" 
          title="Curve"           
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
        >
          <img 
            src={Curve} 
            alt="Curve" 
          />
        </button>

        <button
          type="button"
          title="Rectangle"
          className={`xp-tool-btn${tool === 'rectangle' ? ' active' : ''}`}
          onClick={() => setTool('rectangle')}
        >
          <img 
            src={Rectangle} 
            alt="Rectangle" 
          />
        </button>

        <button 
          type="button" 
          title="Polygon"         
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
        >
          <img 
            src={Polygon} 
            alt="Polygon" 
          />
        </button>

        <button 
          type="button" 
          title="Ellipse"         
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
        >
          <img 
            src={Elipse} 
            alt="Ellipse" 
          />
        </button>

        <button 
          type="button" 
          title="Rounded Rect"    
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
        >
          <img 
            src={RoundedRectangle} 
            alt="Rounded Rect" 
          />
        </button>
      </div>

      {/* TOOL OPTIONS */}
      <div className="xp-tool-preview">
        <div className="xp-context-panel">

          {tool === 'zoom' && ZOOM_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={p.label}
              className={`zoom xp-size-btn${zoom === p.value ? ' active' : ''}`}
              onClick={() => setZoomLevel(p.value)}
            >
              <img src={p.icon} alt={p.label} />
            </button>
          ))}

          {/* LINE */}
          {tool === 'line' && LINE_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={p.label}
              className={`line xp-size-btn${selectedLinePreset === i ? ' active' : ''}`}
              onClick={() => {
                setSelectedLinePreset(i);
                setLineWidth(p.width);
              }}
            >
              <img src={p.icon} alt="" />
            </button>
          ))}

          {tool === 'rectangle' && RECT_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={p.label}
              className={`xp-size-btn${selectedShapePreset === i ? ' active' : ''}`}
              onClick={() => setSelectedShapePreset(i)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: p.svg }}
              />
            </button>
          ))}

          {/* SPRAY */}
          {tool === 'spray' && SPRAY_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={p.label}
              className={`xp-size-btn${selectedSprayPreset === i ? ' active' : ''}`}
              onClick={() => {
                setSelectedSprayPreset(i);
                setLineWidth(p.radius); // ✔ TADY JE FIX
              }}
            >
              <img src={p.icon} alt="" />
            </button>
          ))}

          {/* RECTANGLE */}
          {tool === 'brush' && BRUSH_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              title={`${p.shape} ${p.size}px`}
              aria-label={`${p.shape} ${p.size}px`}
              className={`xp-size-btn${selectedBrushPreset === i ? ' active' : ''}`}
              onClick={() => {
                setSelectedBrushPreset(i);
                setLineWidth(p.size);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: p.svg }}
              />
            </button>
          ))}

          {tool === 'eraser' && ERASER_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              aria-label={p.label}
              className={`eraser xp-size-btn${selectedEraserPreset === i ? ' active' : ''}`}
              onClick={() => {
                setSelectedEraserPreset(i);
                setLineWidth(p.size);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24"
                dangerouslySetInnerHTML={{ __html: p.svg }}
              />
            </button>
          ))}

        </div>
      </div>
    </aside>
  );
};

export default Toolbox;