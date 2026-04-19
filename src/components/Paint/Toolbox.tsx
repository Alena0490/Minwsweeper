import './Toolbox.css'
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

interface ToolboxProps {
  // lineColor: string;
  setLineColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  lineOpacity: number;
  setLineOpacity: (opacity: number) => void;
  tool: string;
  setTool: (tool: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  zoom: number;
}

const Toolbox = ({ tool, setTool, lineWidth, setLineWidth }: ToolboxProps) => {
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
          onClick={() => {}} 
          className="xp-tool-btn xp-tool-btn--disabled"
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

      <div className="xp-tool-preview">
        {(tool === 'brush' || tool === 'spray' || tool === 'line') && (
          <div className="xp-context-panel">
            {[2, 5, 8, 14].map(size => (
              <button
                key={size}
                title='Select brush size'
                type="button"
                className={`xp-size-btn${lineWidth === size ? ' active' : ''}`}
                onClick={() => setLineWidth(size)}
              >
                <div 
                className='xp-dot'
                style={{
                  width: size,
                  height: size,
                }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Toolbox;