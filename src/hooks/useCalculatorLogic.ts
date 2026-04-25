import { useState, useEffect, useCallback,useRef } from "react";

interface UseCalculatorLogicProps {
  display: string;
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  onExtraClick?: (value: string) => boolean;
}

export const useCalculatorLogic = ({ display, setDisplay, onExtraClick }: UseCalculatorLogicProps) => {
    const [expression, setExpression] = useState('');
    const [memory, setMemory] = useState(0);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [openParens, setOpenParens] = useState(0);

    const calculateRef = useRef<(expr: string) => number>((expr) => {
        throw new Error('Not initialized: ' + expr);
    });

    useEffect(() => {
        calculateRef.current = (expr: string): number => {
            while (expr.includes('(')) {
                expr = expr.replace(/\(([^()]*)\)/g, (_, inner) => String(calculateRef.current!(inner)));
            }
            expr = expr.replace(/(\d)-/g, '$1+-');
            const tokens = expr.match(/(-?\d+\.?\d*(?:e[+-]?\d+)?|\*\*|<<|[+*/%&|^])/g);
            if (!tokens) throw new Error('Invalid');
            const nums: number[] = [];
            const ops: string[] = [];
            for (const token of tokens) {
                if (['+', '-', '*', '/', '%', '**', '&', '|', '^', '<<'].includes(token)) {
                    ops.push(token);
                } else {
                    nums.push(parseFloat(token));
                }
            }
            for (let i = 0; i < ops.length; i++) {
                if (['**', '*', '/', '%', '&', '|', '^', '<<'].includes(ops[i])) {
                    let result;
                    if (ops[i] === '**') result = Math.pow(nums[i], nums[i+1]);
                    else if (ops[i] === '*') result = nums[i] * nums[i+1];
                    else if (ops[i] === '/') result = nums[i+1] === 0 ? NaN : nums[i] / nums[i+1];
                    else if (ops[i] === '%') result = nums[i] % nums[i+1];
                    else if (ops[i] === '&') result = Math.trunc(nums[i]) & Math.trunc(nums[i+1]);
                    else if (ops[i] === '|') result = Math.trunc(nums[i]) | Math.trunc(nums[i+1]);
                    else if (ops[i] === '^') result = Math.trunc(nums[i]) ^ Math.trunc(nums[i+1]);
                    else result = Math.trunc(nums[i]) << Math.trunc(nums[i+1]);
                    nums.splice(i, 2, result!);
                    ops.splice(i, 1);
                    i--;
                }
            }
            let result = nums[0];
            for (let i = 0; i < ops.length; i++) {
                if (ops[i] === '+') result += nums[i+1];
                if (ops[i] === '-') result -= nums[i+1];
            }
            return result;
        };
    }, []);

    const calculate = (expr: string) => calculateRef.current!(expr);

    const performCalculation = useCallback(() => {
        let fullExpr = expression === '' ? display : expression.endsWith(')') ? expression : expression + display;
            if (fullExpr.match(/^[+\-*/%&|^]/)) fullExpr = '0' + fullExpr;
        try {
        const result = calculate(fullExpr);
        setDisplay(isNaN(result) ? 'Cannot divide by zero' : String(result));
        setExpression('');
        setWaitingForOperand(true);
        setOpenParens(0);
        } catch {
        setDisplay('Math Error');
        setExpression('');
        setWaitingForOperand(true);
        setOpenParens(0);
        }
    }, [display, expression, setDisplay]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.key >= '0' && e.key <= '9') {
            if (waitingForOperand) { setDisplay(e.key); setWaitingForOperand(false); }
            else setDisplay(prev => prev === '0' ? e.key : prev + e.key);
        }
        else if (e.key === '+') { setExpression(prev => waitingForOperand ? prev + '+' : prev + display + '+'); setWaitingForOperand(true); }
        else if (e.key === '-') { 
            setExpression(prev => waitingForOperand ? prev + '-' : prev + display + '-'); 
            setWaitingForOperand(true); 
        }
        else if (e.key === '*') { setExpression(prev => waitingForOperand ? prev + '*' : prev + display + '*'); setWaitingForOperand(true); }
        else if (e.key === '/') { e.preventDefault(); setExpression(prev => waitingForOperand ? prev + '/' : prev + display + '/'); setWaitingForOperand(true); }
        else if (e.key === 'Enter' || e.key === '=') { performCalculation(); }
        else if (e.key === 'Backspace') setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        else if (e.key === 'Escape') { setDisplay('0'); setExpression(''); setWaitingForOperand(false); setOpenParens(0); }
        else if (e.key === '.') setDisplay(prev => prev.includes('.') ? prev : prev + '.');
        else if (e.key === '%') { setExpression(prev => waitingForOperand ? prev + '%' : prev + display + '%'); setWaitingForOperand(true); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [display, waitingForOperand, setDisplay, performCalculation]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    if (onExtraClick && onExtraClick(value)) return;

    if (!isNaN(Number(value)) || value === '.') {
      if (waitingForOperand) { setDisplay(value); setWaitingForOperand(false); }
      else setDisplay(prev => prev === '0' ? value : prev + value);
      return;
    }

    switch (value) {
        case '(': { setExpression(prev => prev + (waitingForOperand ? '' : display) + '('); setDisplay('0'); setWaitingForOperand(true); setOpenParens(prev => prev + 1); break; }
        case ')': { if (openParens > 0) { setExpression(prev => prev + display + ')'); setWaitingForOperand(true); setOpenParens(prev => prev - 1); } break; }
        case '+': case '-': case '*': case '/': { 
            setExpression(prev => {
                if (prev === '' && waitingForOperand) return display + value;
                return waitingForOperand ? prev + value : prev + display + value;
            }); 
            setWaitingForOperand(true); 
            break; 
        }
        case 'x^y': { setExpression(prev => waitingForOperand ? prev + '**' : prev + display + '**'); setWaitingForOperand(true); break; }
        case 'Mod': { setExpression(prev => waitingForOperand ? prev + '%' : prev + display + '%'); setWaitingForOperand(true); break; }
        case 'And': { setExpression(prev => waitingForOperand ? prev + '&' : prev + display + '&'); setWaitingForOperand(true); break; }
        case 'Or': { setExpression(prev => waitingForOperand ? prev + '|' : prev + display + '|'); setWaitingForOperand(true); break; }
        case 'Xor': { setExpression(prev => waitingForOperand ? prev + '^' : prev + display + '^'); setWaitingForOperand(true); break; }
        case 'Lsh': { setExpression(prev => waitingForOperand ? prev + '<<' : prev + display + '<<'); setWaitingForOperand(true); break; }
        case 'Not': { setDisplay(String(~Math.trunc(parseFloat(display)))); setWaitingForOperand(true); break; }
        case 'sqrt': { const num = parseFloat(display); setDisplay(num < 0 ? 'Invalid input' : String(Math.sqrt(num))); setWaitingForOperand(true); break; }
        case '1/x': { const num = parseFloat(display); setDisplay(num === 0 ? 'Cannot divide by zero' : String(1 / num)); setWaitingForOperand(true); break; }
        case 'Int': { setDisplay(String(Math.trunc(parseFloat(display)))); setWaitingForOperand(true); break; }
        case 'F-E': { const n = parseFloat(display); setDisplay(display.includes('e') ? String(n) : n.toExponential()); break; }
        case 'Exp': { setDisplay(prev => prev.includes('e') ? prev : prev + 'e+'); break; }
        case 'dms': { const deg = Math.floor(parseFloat(display)); const minFull = (parseFloat(display) - deg) * 60; const min = Math.floor(minFull); const sec = Math.round((minFull - min) * 60); setDisplay(`${deg}°${min}'${sec}"`); break; }
        case 'MC': { setMemory(0); break; }
        case 'MR': { setDisplay(String(memory)); setWaitingForOperand(true); break; }
        case 'MS': { setMemory(parseFloat(display)); setWaitingForOperand(true); break; }
        case 'M+': { setMemory(prev => prev + parseFloat(display)); setWaitingForOperand(true); break; }
        case '=': { performCalculation(); break; }
        case 'C': { setDisplay('0'); setExpression(''); setWaitingForOperand(false); setOpenParens(0); break; }
        case 'CE': { setDisplay('0'); break; }
        case 'Backspace': { setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0'); break; }
        case '+/-': { setDisplay(prev => String(parseFloat(prev) * -1)); break; }
        case '%': { setExpression(prev => prev + display + '%'); setWaitingForOperand(true); break; }
    }
  };

  return { handleClick, memory };
};

export default useCalculatorLogic;