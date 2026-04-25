import './Calculator.css'
import { useState } from "react";
import Button from "./Button";
import useCalculatorLogic from '../../hooks/useCalculatorLogic';

interface CalculatorScientificProps {
    display: string;
    setDisplay: React.Dispatch<React.SetStateAction<string>>;
    digitGrouping: boolean;
}

const CalculatorScientific = ({ display, setDisplay, digitGrouping }: CalculatorScientificProps) => {
    const [inv, setInv] = useState(false);
    const [hyp, setHyp] = useState(false);
    const [angleMode, setAngleMode] = useState<'deg' | 'rad' | 'grad'>('deg');

    const formattedDisplay = digitGrouping
        ? parseFloat(display).toLocaleString('cs-CZ')
        : display;

    const handleScientific = (value: string): boolean => {
        const num = parseFloat(display);
        const toAngle = (n: number) =>
            angleMode === 'deg' ? n * Math.PI / 180
            : angleMode === 'grad' ? n * Math.PI / 200
            : n;

        switch (value) {
            case 'sin': setDisplay(String(inv ? Math.asin(num) : hyp ? Math.sinh(toAngle(num)) : Math.sin(toAngle(num)))); return true;
            case 'cos': setDisplay(String(inv ? Math.acos(num) : hyp ? Math.cosh(toAngle(num)) : Math.cos(toAngle(num)))); return true;
            case 'tan': setDisplay(String(inv ? Math.atan(num) : hyp ? Math.tanh(toAngle(num)) : Math.tan(toAngle(num)))); return true;
            case 'log': setDisplay(String(inv ? Math.pow(10, num) : Math.log10(num))); return true;
            case 'ln': setDisplay(String(inv ? Math.exp(num) : Math.log(num))); return true;
            case 'x^2': setDisplay(String(Math.pow(num, 2))); return true;
            case 'x^3': setDisplay(String(Math.pow(num, 3))); return true;
            case 'n!': {
                const n = parseInt(display);
                let result = 1;
                for (let i = 2; i <= n; i++) result *= i;
                setDisplay(String(result));
                return true;
            }
            case 'pi': setDisplay(String(Math.PI)); return true;
            default: return false;
        }
    };

    const { handleClick } = useCalculatorLogic({
        display,
        setDisplay,
        onExtraClick: handleScientific
    });

    return (
        <article className="calculator-frame calculator-frame--scientific">
            <div className="mainCalc">
                <div className="screen">
                    <div className="output-screen-row">
                        <input readOnly value={formattedDisplay} />
                    </div>
                </div>

                <div className="calc-scientific-options">
                    <div className="calc-radios calc-radios--base">
                        {(['hex', 'dec', 'oct', 'bin'] as const).map(mode => (
                            <label key={mode}>
                                <input
                                    type="radio"
                                    name="base"
                                    defaultChecked={mode === 'dec'}
                                />
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </label>
                        ))}
                    </div>

                    <div className="calc-radios calc-radios--angle">
                        {(['deg', 'rad', 'grad'] as const).map(mode => (
                            <label key={mode}>
                                <input
                                    type="radio"
                                    name="angle"
                                    checked={angleMode === mode}
                                    onChange={() => setAngleMode(mode)}
                                />
                                {mode === 'deg' ? 'Degrees' : mode === 'rad' ? 'Radians' : 'Grads'}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="calc-scientific-top">
                    <div className="calc-top-inv-hyp">
                        <label>
                            <input type="checkbox" checked={inv} onChange={() => setInv(prev => !prev)} />
                            Inv
                        </label>
                        <label>
                            <input type="checkbox" checked={hyp} onChange={() => setHyp(prev => !prev)} />
                            Hyp
                        </label>
                    </div>

                    <button className="calc-placeholder calc-placeholder--one" disabled aria-hidden="true" tabIndex={-1} />
                    <button className="calc-placeholder calc-placeholder--two" disabled aria-hidden="true" tabIndex={-1} />

                    <Button label="Backspace" handleClick={handleClick} className="delete calc-top-backspace" />
                    <Button label="CE" handleClick={handleClick} className="delete calc-top-ce" />
                    <Button label="C" handleClick={handleClick} className="clear calc-top-c" />
                </div>

                <div className="calc-scientific-layout">
                    <div className="calc-stat-grid">
                        <Button label="Sta" handleClick={handleClick} className="op is-disabled" />
                        <Button label="Ave" handleClick={handleClick} className="op is-disabled" />
                        <Button label="Sum" handleClick={handleClick} className="op is-disabled" />
                        <Button label="s" handleClick={handleClick} className="op is-disabled" />
                        <Button label="Dat" handleClick={handleClick} className="op is-disabled" />
                    </div>

                    <div className="calc-function-grid">
                        <Button label="F-E" handleClick={handleClick} className="op" />
                        <Button label="(" handleClick={handleClick} className="op is-disabled" />
                        <Button label=")" handleClick={handleClick} className="op is-disabled" />

                        <Button label="dms" handleClick={handleClick} className="op" />
                        <Button label="Exp" handleClick={handleClick} className="op" />
                        <Button label="ln" handleClick={handleClick} className="op" />

                        <Button label="sin" handleClick={handleClick} className="op" />
                        <Button label="x^y" handleClick={handleClick} className="op" />
                        <Button label="log" handleClick={handleClick} className="op" />

                        <Button label="cos" handleClick={handleClick} className="op" />
                        <Button label="x^3" handleClick={handleClick} className="op" />
                        <Button label="n!" handleClick={handleClick} className="op" />

                        <Button label="tan" handleClick={handleClick} className="op" />
                        <Button label="x^2" handleClick={handleClick} className="op" />
                        <Button label="1/x" handleClick={handleClick} className="op" />
                    </div>

                    <div className="calc-main-grid">
                        <div className="calc-memory-grid">
                            <Button label="MC" handleClick={handleClick} className="op" />
                            <Button label="MR" handleClick={handleClick} className="op" />
                            <Button label="MS" handleClick={handleClick} className="op" />
                            <Button label="M+" handleClick={handleClick} className="op" />
                            <Button label="pi" handleClick={handleClick} className="op" />
                        </div>

                        <div className="calc-number-grid">
                            <Button label="7" handleClick={handleClick} />
                            <Button label="8" handleClick={handleClick} />
                            <Button label="9" handleClick={handleClick} />
                            <Button label="/" handleClick={handleClick} className="op" />

                            <Button label="4" handleClick={handleClick} />
                            <Button label="5" handleClick={handleClick} />
                            <Button label="6" handleClick={handleClick} />
                            <Button label="*" handleClick={handleClick} className="op" />

                            <Button label="1" handleClick={handleClick} />
                            <Button label="2" handleClick={handleClick} />
                            <Button label="3" handleClick={handleClick} />
                            <Button label="-" handleClick={handleClick} className="op" />

                            <Button label="0" handleClick={handleClick} />
                            <Button label="+/-" handleClick={handleClick} className="op" />
                            <Button label="." handleClick={handleClick} />
                            <Button label="+" handleClick={handleClick} className="op" />

                            <Button label="A" handleClick={handleClick} className="is-disabled" />
                            <Button label="B" handleClick={handleClick} className="is-disabled" />
                            <Button label="C" handleClick={handleClick} className="is-disabled" />
                            <Button label="D" handleClick={handleClick} className="is-disabled" />
                        </div>

                        <div className="calc-side-grid">
                            <Button label="Mod" handleClick={handleClick} className="op" />
                            <Button label="And" handleClick={handleClick} className="op" />

                            <Button label="Or" handleClick={handleClick} className="op" />
                            <Button label="Xor" handleClick={handleClick} className="op" />

                            <Button label="Lsh" handleClick={handleClick} className="op" />
                            <Button label="Not" handleClick={handleClick} className="op" />

                            <Button label="=" handleClick={handleClick} className="equals" />
                            <Button label="Int" handleClick={handleClick} className="op" />

                            <Button label="E" handleClick={handleClick} className="is-disabled" />
                            <Button label="F" handleClick={handleClick} className="is-disabled" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default CalculatorScientific;