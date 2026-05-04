import TextBold from '../../img/Paint/textBold.webp';
import TextItalic from '../../img/Paint/textItalic.webp';
import TextUndeline from '../../img/Paint/textUnderline.webp';
import TextWay from '../../img/Paint/textWay.webp';
import './TextTool.css';

interface FontToolbarProps {
    fontFamily: string;
    setFontFamily: (f: string) => void;
    fontSize: number;
    setFontSize: (s: number) => void;
    bold: boolean;
    setBold: (v: boolean) => void;
    italic: boolean;
    setItalic: (v: boolean) => void;
    underline: boolean;
    setUnderline: (v: boolean) => void;
    textWay: 'vertical' | 'horizontal';
    setTextWay: (f: 'vertical' | 'horizontal') => void;
    onClose: () => void;
    placement: 'top' | 'bottom';
}

const FONTS = ['Arial', 'Times New Roman', 'Courier New', 'Comic Sans MS', 'Verdana', 'Tahoma'];

const FontToolbar = ({
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    bold,
    setBold,
    italic,
    setItalic,
    underline,
    setUnderline,
    textWay,
    setTextWay,
    onClose,
    placement,
}: FontToolbarProps) => {
    return (
        <div
            className={`font-toolbar ${placement === 'bottom' ? 'is-below' : 'is-above'}`}
            role='dialog'
            aria-modal='true'
            aria-labelledby='font-toolbar-title'
        >
            <div className='title-bar'>
                <div
                    className='title-bar-text'
                    id='font-toolbar-title'
                >
                    Fonts
                </div>
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
            <div className='font-toolbar-body'>
                <select
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value)}
                >
                    {FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
                <input
                    type='number'
                    value={fontSize}
                    onChange={e => setFontSize(Number(e.target.value))}
                />
                <div className='font-btns'>
                    <button
                        type='button'
                        className={bold ? 'active' : ''}
                        onClick={() => setBold(!bold)}
                    >
                        <img src={TextBold} alt='Bold' />
                    </button>
                    <button
                        type='button'
                        className={italic ? 'active' : ''}
                        onClick={() => setItalic(!italic)}
                    >
                        <img src={TextItalic} alt='Italic' />
                    </button>
                    <button
                        type='button'
                        className={underline ? 'active' : ''}
                        onClick={() => setUnderline(!underline)}
                    >
                        <img src={TextUndeline} alt='Underline' />
                    </button>
                    <button
                        type='button'
                        onClick={() => setTextWay(textWay === 'horizontal' ? 'vertical' : 'horizontal')}
                    >
                        <img src={TextWay} alt='Text Way' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FontToolbar;