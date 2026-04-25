import { useState, useEffect, useCallback } from "react";

interface UseCalculatorLogicProps {
  display: string;
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  onExtraClick?: (value: string) => boolean;
}

export const useCalculatorLogic = ({ display, setDisplay, onExtraClick }: UseCalculatorLogicProps) => {
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);

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

        else if (e.key === 'Enter' || e.key === '=') { 
            performCalculation(); 
        }

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
  }, [display, operator, stored, waitingForOperand, setDisplay, performCalculation]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    if (onExtraClick && onExtraClick(value)) return;

    if (!isNaN(Number(value)) || value === '.') {
        if (waitingForOperand) { 
            setDisplay(value); 
            setWaitingForOperand(false); 
        }
        else setDisplay(prev => prev === '0' ? value : prev + value);
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
            setDisplay(num < 0 ? 'Invalid input' : String(Math.sqrt(num)));
            setWaitingForOperand(true);
            break;
        }

        case '1/x': {
            const num = parseFloat(display);
            setDisplay(num === 0 ? 'Cannot divide by zero' : String(1 / num));
            setWaitingForOperand(true);
            break;
        }
        case '=': { 
            performCalculation(); 
            break; 
        }

        case 'C': { 
            setDisplay('0'); 
            setStored(null); 
            setOperator(null); 
            setWaitingForOperand(false); 
            break; 
        }

        case 'CE': { 
            setDisplay('0'); 
            break; 
        }

        case 'Backspace': { 
            setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
            break; 
        }

        case '+/-': { 
            setDisplay(prev => String(parseFloat(prev) * -1)); 
            break; 
        }

        case '%': { 
            setDisplay(prev => String(parseFloat(prev) / 100)); 
            break; 
        }
    }
  };

  return { handleClick, memory };
};

export default useCalculatorLogic;