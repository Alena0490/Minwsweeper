import './Calculator.css'

import { useState } from "react";
import Button from "./Button";

const CalculatorApp = () => {
    const [display, setDisplay] = useState("0");
    const [stored, setStored] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

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
        case '+': case '-': case '*': case '/': {
            setStored(parseFloat(display));
            setOperator(value);
            setWaitingForOperand(true);
            break;
        }
        case '=': {
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
                <input readOnly value={display} />
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
                    <Button label="MC" handleClick={handleClick} className="op is-disabled" />
                    <Button label="7" handleClick={handleClick} />
                    <Button label="8" handleClick={handleClick} />
                    <Button label="9" handleClick={handleClick} />
                    <Button label="/" handleClick={handleClick} className="op" />
                    <Button label="sqrt" handleClick={handleClick} className="op is-disabled" />
                </div>
                <div className="button-row">
                    <Button label="MR" handleClick={handleClick} className="op is-disabled" />
                    <Button label="4" handleClick={handleClick} />
                    <Button label="5" handleClick={handleClick} />
                    <Button label="6" handleClick={handleClick} />
                    <Button label="*" handleClick={handleClick} className="op" />
                    <Button label="%" handleClick={handleClick} className="op" />
                </div>
                <div className="button-row">
                    <Button label="MS" handleClick={handleClick} className="op is-disabled" />
                    <Button label="1" handleClick={handleClick} />
                    <Button label="2" handleClick={handleClick} />
                    <Button label="3" handleClick={handleClick} />
                    <Button label="-" handleClick={handleClick} className="op" />
                    <Button label="1/x" handleClick={handleClick} className="op is-disabled" />
                </div>
                <div className="button-row">
                    <Button label="M+" handleClick={handleClick} className="op is-disabled" />
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