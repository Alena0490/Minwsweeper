import { useState } from 'react';
import useDraggable from '../../hooks/useDraggable';
import './FindReplaceModal.css';
import '../../App.css';

interface DraggableDialogProps {
    onClose: () => void;
    style?: React.CSSProperties;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    mode: 'find' | 'replace';
}

const FindReplaceModal = ({ style, onClose, textareaRef, mode }: DraggableDialogProps) => {
    const initialX = typeof style?.left === 'number'
        ? style.left
        : Math.round(window.innerWidth / 2 - 140);

    const initialY = typeof style?.top === 'number'
        ? style.top
        : Math.round(window.innerHeight / 2 - 70);

    const { position, handleMouseDown } = useDraggable(initialX, initialY);

    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [matchCase, setMatchCase] = useState(false);
    const [wrapAround, setWrapAround] = useState(true);
    const [direction, setDirection] = useState<'up' | 'down'>('down');

    // Find next occurrence of search text
    const handleFindNext = () => {
        const el = textareaRef.current;
        if (!el || !findText) return;
        const content = matchCase ? el.value : el.value.toLowerCase();
        const search = matchCase ? findText : findText.toLowerCase();
        const start = el.selectionEnd ?? 0;
        let index = content.indexOf(search, start);
        if (index === -1 && wrapAround) index = content.indexOf(search, 0);
        if (index === -1) {
            alert(`Cannot find "${findText}"`);
            return;
        }
        el.setSelectionRange(index, index + search.length);
        el.focus();
    };

    // Replace current selection if it matches, then find next
    const handleReplace = () => {
        const el = textareaRef.current;
        if (!el || !findText) return;
        const selected = el.value.slice(el.selectionStart, el.selectionEnd);
        const matches = matchCase ? selected === findText : selected.toLowerCase() === findText.toLowerCase();
        if (matches) {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const newValue = el.value.slice(0, start) + replaceText + el.value.slice(end);
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
            nativeInputValueSetter?.call(el, newValue);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        handleFindNext();
    };

    // Replace all occurrences
    const handleReplaceAll = () => {
        const el = textareaRef.current;
        if (!el || !findText) return;
        const flags = matchCase ? 'g' : 'gi';
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const newValue = el.value.replace(new RegExp(escaped, flags), replaceText);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        nativeInputValueSetter?.call(el, newValue);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.focus();
    };

    return (
        <div
            className='app-window find-replace-dialog'
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
        >
            <div className='title-bar' onMouseDown={handleMouseDown}>
                <span className='title-bar-text'>{mode === 'find' ? 'Find' : 'Replace'}</span>
                <div className='title-bar-buttons xp-title-controls'>
                    <button
                        type='button'
                        className='xp-title-control btn-close'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className='find-replace-body'>
                <div className='find-replace-fields'>
                    <div className='find-replace-row'>
                        <label htmlFor='find-input'>Find what:</label>
                        <input
                            id='find-input'
                            type='text'
                            value={findText}
                            onChange={e => setFindText(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {mode === 'replace' && (
                        <div className='find-replace-row'>
                            <label htmlFor='replace-input'>Replace with:</label>
                            <input
                                id='replace-input'
                                type='text'
                                value={replaceText}
                                onChange={e => setReplaceText(e.target.value)}
                            />
                        </div>
                    )}

                    <div className='find-replace-lower'>
                        <div className='find-replace-checks'>
                            <label className='find-replace-checkbox' htmlFor='match-case'>
                                <input
                                    id='match-case'
                                    type='checkbox'
                                    checked={matchCase}
                                    onChange={e => setMatchCase(e.target.checked)}
                                />
                                <span>Match case</span>
                            </label>

                            {mode === 'find' && (
                                <label className='find-replace-checkbox' htmlFor='wrap-around'>
                                    <input
                                        id='wrap-around'
                                        type='checkbox'
                                        checked={wrapAround}
                                        onChange={e => setWrapAround(e.target.checked)}
                                    />
                                    <span>Wrap around</span>
                                </label>
                            )}
                        </div>

                        {mode === 'find' && (
                            <div className='find-replace-direction'>
                                <span>Direction</span>
                                <div className='direction-labels'>
                                    <label>
                                        <input
                                            type='radio'
                                            name='direction'
                                            value='up'
                                            checked={direction === 'up'}
                                            onChange={() => setDirection('up')}
                                        />
                                        Up
                                    </label>
                                    <label>
                                        <input
                                            type='radio'
                                            name='direction'
                                            value='down'
                                            checked={direction === 'down'}
                                            onChange={() => setDirection('down')}
                                        />
                                        Down
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='find-replace-actions'>
                    <button
                        type='button'
                        className='find-replace-btn'
                        onClick={handleFindNext}
                        disabled={!findText}
                    >
                        Find Next
                    </button>
                    {mode === 'replace' && (
                        <button
                            type='button'
                            className='find-replace-btn'
                            onClick={handleReplace}
                            disabled={!findText}
                        >
                            Replace
                        </button>
                    )}
                    {mode === 'replace' && (
                        <button
                            type='button'
                            className='find-replace-btn'
                            onClick={handleReplaceAll}
                            disabled={!findText}
                        >
                            Replace All
                        </button>
                    )}
                    <button
                        type='button'
                        className='find-replace-btn'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindReplaceModal;