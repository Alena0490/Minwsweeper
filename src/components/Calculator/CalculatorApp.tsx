import './Calculator.css'
import Button from "./Button";
import { useCalculatorLogic } from '../../hooks/useCalculatorLogic';

interface CalculatorAppProps {
    display: string;
    setDisplay: React.Dispatch<React.SetStateAction<string>>;
    digitGrouping: boolean;
}

const CalculatorApp = ({ display, setDisplay, digitGrouping }: CalculatorAppProps) => {
    const { handleClick } = useCalculatorLogic({ display, setDisplay });

    const formattedDisplay = digitGrouping
        ? parseFloat(display).toLocaleString('cs-CZ')
        : display;

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
    );
};

export default CalculatorApp;