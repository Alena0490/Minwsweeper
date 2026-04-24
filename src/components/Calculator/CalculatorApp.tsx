import './Calculator.css'
import { useState, useEffect, useCallback } from "react";
import Button from "./Button";

interface CalculatorAppProps {
    display: string;
    setDisplay: React.Dispatch<React.SetStateAction<string>>;
    digitGrouping: boolean;
}

const CalculatorApp = ({display, setDisplay, digitGrouping}:CalculatorAppProps) => {
    const [stored, setStored] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [memory, setMemory] = useState(0);

    const formattedDisplay = digitGrouping 
        ? parseFloat(display).toLocaleString('cs-CZ')
        : display;

    const performCalculation = useCallback(() => {
        if (stored !== null && operator) {
            const current = parseFloat(display);
            let result = stored;
            if (operator === '+') result = stored + current;
            if (operator === '-') result = stored - current;
            if (operator === '*') result = stored * current;
            if (operator === '/') result = current === 0 ? NaN : stored / current;
            setDisplay(isNaN(result) ? 'Cannot divide by zero' : String(result));
            setStored(null);
            setOperator(null);
            setWaitingForOperand(true);
        }
    }, [display, operator, stored, setDisplay]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                if (waitingForOperand) { 
                    setDisplay(e.key); 
                    setWaitingForOperand(false); 
                }
                else setDisplay(prev => prev === '0' ? e.key : prev + e.key);
            }
            else if (e.key === '+') { 
                setStored(parseFloat(display)); 
                setOperator('+'); 
                setWaitingForOperand(true); 
            }
            else if (e.key === '-') { 
                setStored(parseFloat(display)); 
                setOperator('-'); 
                setWaitingForOperand(true); 
            }
            else if (e.key === '*') { 
                setStored(parseFloat(display)); 
                setOperator('*'); 
                setWaitingForOperand(true); 
            }
            else if (e.key === '/') { 
                e.preventDefault(); 
                setStored(parseFloat(display)); 
                setOperator('/'); 
                setWaitingForOperand(true); 
            }
            else if (e.key === 'Enter' || e.key === '=') { performCalculation() }
            else if (e.key === 'Backspace') setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
            else if (e.key === 'Escape') { 
                setDisplay('0'); 
                setStored(null); 
                setOperator(null); 
                setWaitingForOperand(false); 
            }
            else if (e.key === '.') setDisplay(prev => prev.includes('.') ? prev : prev + '.');
            else if (e.key === '%') { 
                setDisplay(prev => String(parseFloat(prev) / 100)); 
                setWaitingForOperand(true); 
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [display, operator, stored, waitingForOperand,setDisplay, performCalculation]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const value = event.currentTarget.value;

        if (!isNaN(Number(value)) || value === '.') {
            if (waitingForOperand) {
                setDisplay(value);
                setWaitingForOperand(false);
            } else {
                setDisplay(prev => prev === '0' ? value : prev + value);
            }
            return;
        }

        switch (value) {
            case 'MC': {
                setMemory(0);
                break;
            }

            case 'MR': {
                setDisplay(String(memory));
                setWaitingForOperand(true);
                break;
            }

            case 'MS': {
                setMemory(parseFloat(display));
                setWaitingForOperand(true);
                break;
            }

            case 'M+': {
                setMemory(prev => prev + parseFloat(display));
                setWaitingForOperand(true);
                break;
            }

            case '+': case '-': case '*': case '/': {
                setStored(parseFloat(display));
                setOperator(value);
                setWaitingForOperand(true);
                break;
            }

            case 'sqrt': {
                const num = parseFloat(display);
                if (num < 0) {
                    setDisplay('Invalid input');
                } else {
                    setDisplay(String(Math.sqrt(num)));
                }
                setWaitingForOperand(true);
                break;
            }

            case '1/x': {
                const num = parseFloat(display);
                if (num === 0) {
                    setDisplay('Cannot divide by zero');
                } else {
                    setDisplay(String(1 / num));
                }
                setWaitingForOperand(true);
                break;
            }

            case '=': {
                performCalculation()
                break;
            }

            case 'C': { setDisplay('0'); setStored(null); setOperator(null); setWaitingForOperand(false); break; }
            case 'CE': { setDisplay('0'); break; }
            case 'Backspace': { setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0'); break; }
            case '+/-': { setDisplay(prev => String(parseFloat(prev) * -1)); break; }
            case '%': { setDisplay(prev => String(parseFloat(prev) / 100)); break; }
        }
    };

  return (
    <article className="calculator-frame">
        <div className="mainCalc">
            <div className="screen">
            <div className="output-screen-row">
                <input readOnly value={formattedDisplay} />
            </div>
        </div>

        <div className="button-grid">
                <div className="button-row button-row--top">
                    <button className="calc-placeholder" disabled aria-hidden="true" tabIndex={-1} />
                    <Button label="Backspace" handleClick={handleClick} className="delete" />
                    <Button label="CE" handleClick={handleClick} className="delete" />
                    <Button label="C" handleClick={handleClick} className="clear" />
                </div>
                <div className="button-row">
                    <Button label="MC" handleClick={handleClick} className="op" />
                    <Button label="7" handleClick={handleClick} />
                    <Button label="8" handleClick={handleClick} />
                    <Button label="9" handleClick={handleClick} />
                    <Button label="/" handleClick={handleClick} className="op" />
                    <Button label="sqrt" handleClick={handleClick} className="op" />
                </div>
                <div className="button-row">
                    <Button label="MR" handleClick={handleClick} className="op" />
                    <Button label="4" handleClick={handleClick} />
                    <Button label="5" handleClick={handleClick} />
                    <Button label="6" handleClick={handleClick} />
                    <Button label="*" handleClick={handleClick} className="op" />
                    <Button label="%" handleClick={handleClick} className="op" />
                </div>
                <div className="button-row">
                    <Button label="MS" handleClick={handleClick} className="op" />
                    <Button label="1" handleClick={handleClick} />
                    <Button label="2" handleClick={handleClick} />
                    <Button label="3" handleClick={handleClick} />
                    <Button label="-" handleClick={handleClick} className="op" />
                    <Button label="1/x" handleClick={handleClick} className="op" />
                </div>
                <div className="button-row">
                    <Button label="M+" handleClick={handleClick} className="op" />
                    <Button label="0" handleClick={handleClick} />
                    <Button label="+/-" handleClick={handleClick} className="op" />
                    <Button label="." handleClick={handleClick} />
                    <Button label="+" handleClick={handleClick} className="op" />
                    <Button label="=" handleClick={handleClick} className="equals" />
                </div>
                </div>
        </div>
    </article>
  )
};

export default CalculatorApp;