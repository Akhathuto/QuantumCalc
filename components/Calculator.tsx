
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HistoryEntry, Explanation } from '../types';
import { getFormulaExplanation } from '../services/geminiService';
import Button from './common/Button';
import { create, all } from 'mathjs';
import { Loader, Brain, XCircle, FlaskConical } from 'lucide-react';

const math = create(all);

interface CalculatorProps {
  addToHistory: (entry: HistoryEntry) => void;
  expressionToLoad: HistoryEntry | null;
  onExpressionLoaded: () => void;
}

type AngleMode = 'deg' | 'rad' | 'grad';

const SCIENTIFIC_CONSTANTS = [
    { name: 'Speed of Light (c)', value: '299792458', symbol: 'c', unit: 'm/s' },
    { name: 'Planck Constant (h)', value: '6.62607015e-34', symbol: 'h', unit: 'J·s' },
    { name: 'Gravitational Constant (G)', value: '6.67430e-11', symbol: 'G', unit: 'N·m²/kg²' },
    { name: 'Elementary Charge (e)', value: '1.602176634e-19', symbol: 'e', unit: 'C' },
    { name: 'Electron Mass (mₑ)', value: '9.1093837015e-31', symbol: 'mₑ', unit: 'kg' },
    { name: 'Proton Mass (mₚ)', value: '1.67262192369e-27', symbol: 'mₚ', unit: 'kg' },
    { name: 'Avogadro Constant (Nₐ)', value: '6.02214076e23', symbol: 'Nₐ', unit: 'mol⁻¹' },
    { name: 'Boltzmann Constant (k)', value: '1.380649e-23', symbol: 'k', unit: 'J/K' },
    { name: 'Golden Ratio (φ)', value: '1.61803398875', symbol: 'φ', unit: '' },
];

const Calculator: React.FC<CalculatorProps> = ({ addToHistory, expressionToLoad, onExpressionLoaded }) => {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const parser = useMemo(() => {
    const p = math.parser();
    
    const degToRad = (angle: number) => angle * Math.PI / 180;
    const gradToRad = (angle: number) => angle * Math.PI / 200;
    const radToDeg = (angle: number) => angle * 180 / Math.PI;
    const radToGrad = (angle: number) => angle * 200 / Math.PI;

    if (angleMode === 'deg') {
        p.set('sin', (x: number) => math.sin(degToRad(x)));
        p.set('cos', (x: number) => math.cos(degToRad(x)));
        p.set('tan', (x: number) => math.tan(degToRad(x)));
        p.set('asin', (x: number) => radToDeg(math.asin(x)));
        p.set('acos', (x: number) => radToDeg(math.acos(x)));
        p.set('atan', (x: number) => radToDeg(math.atan(x)));
    } else if (angleMode === 'grad') {
        p.set('sin', (x: number) => math.sin(gradToRad(x)));
        p.set('cos', (x: number) => math.cos(gradToRad(x)));
        p.set('tan', (x: number) => math.tan(gradToRad(x)));
        p.set('asin', (x: number) => radToGrad(math.asin(x)));
        p.set('acos', (x: number) => radToGrad(math.acos(x)));
        p.set('atan', (x: number) => radToGrad(math.atan(x)));
    } else { // rad
        p.set('sin', math.sin);
        p.set('cos', math.cos);
        p.set('tan', math.tan);
        p.set('asin', math.asin);
        p.set('acos', math.acos);
        p.set('atan', math.atan);
    }
    p.set('log', (x:number) => math.log(x, 10));
    p.set('ln', math.log);

    return p;
  }, [angleMode]);

  useEffect(() => {
    if (expressionToLoad) {
      setExpression(expressionToLoad.expression);
      setResult('');
      onExpressionLoaded();
    }
  }, [expressionToLoad, onExpressionLoaded]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 2000);
  };

  const handleInput = useCallback((value: string) => {
    setError(null);
    setResult('');
    setExpression(prev => {
      if (prev === '0' || prev === 'Error') {
        return value;
      }
      return prev + value;
    });
  }, []);

  const clear = useCallback(() => {
    setExpression('0');
    setResult('');
    setError(null);
    setExplanation(null);
  }, []);
  
  const backspace = useCallback(() => {
    setExpression(prev => {
      if (prev.length > 1 && prev !== 'Error') {
        return prev.slice(0, -1);
      }
      return '0';
    });
  }, []);

  const calculate = useCallback(async () => {
    if (expression === 'Error' || isLoading) return;
    try {
      const sanitizedExpression = expression
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      const evalResult = parser.evaluate(sanitizedExpression);
      const resultStr = String(parseFloat(evalResult.toFixed(10)));
      
      addToHistory({
        expression: expression,
        result: resultStr,
        timestamp: new Date().toISOString(),
      });
      
      setResult(resultStr);
      
      setIsLoading(true);
      setError(null);
      setExplanation(null);
      const expl = await getFormulaExplanation(sanitizedExpression);
      setExplanation(expl);

    } catch (e) {
      setError('Invalid Expression');
      setExpression('Error');
    } finally {
        setIsLoading(false);
    }
  }, [expression, isLoading, addToHistory, parser]);

    const memoryClear = () => setMemory(0);
    const memoryRecall = () => handleInput(String(memory));
    const memoryStore = () => {
        try {
            const currentVal = parser.evaluate(expression);
            setMemory(currentVal);
            showToast("Value stored in memory");
        } catch {
            setError("Cannot store invalid expression");
            setExpression("Error");
        }
    };
    const memoryAdd = () => {
        try {
            const currentVal = parser.evaluate(expression);
            setMemory(prev => prev + currentVal);
            showToast("Value added to memory");
        } catch {
            setError("Cannot add invalid expression");
            setExpression("Error");
        }
    };
    const memorySubtract = () => {
        try {
            const currentVal = parser.evaluate(expression);
            setMemory(prev => prev - currentVal);
            showToast("Value subtracted from memory");
        } catch {
            setError("Cannot subtract invalid expression");
            setExpression("Error");
        }
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.target instanceof HTMLInputElement || 
            event.target instanceof HTMLTextAreaElement ||
            event.target instanceof HTMLSelectElement) {
            return;
        }
    
        if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
            event.preventDefault();
            const textToCopy = result || (expression !== '0' && expression !== 'Error' ? expression : '');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy);
                showToast('Copied to clipboard!');
            }
            return;
        }
        
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }
    
        let keyHandled = true;
    
        if (/[0-9]/.test(event.key)) {
            handleInput(event.key);
        } else if (['+', '-', '*', '/', '.', '(', ')', '^', '%', '!'].includes(event.key)) {
            let value = event.key;
            if (event.key === '*') value = '×';
            if (event.key === '/') value = '÷';
            if (event.key === '-') value = '−';
            handleInput(value);
        } else {
            switch (event.key) {
                case 'Enter': case '=': calculate(); break;
                case 'Escape': clear(); break;
                case 'Backspace': backspace(); break;
                case 'p': handleInput('π'); break;
                case 'e': handleInput('e'); break;
                default: keyHandled = false;
            }
        }
        
        if (keyHandled) event.preventDefault();
      }, [calculate, clear, backspace, handleInput, expression, result]);
    
      useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }, [handleKeyDown]);


  const buttons = [
    { label: 'sin', action: () => handleInput('sin('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'cos', action: () => handleInput('cos('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'tan', action: () => handleInput('tan('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'log', action: () => handleInput('log('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'ln', action: () => handleInput('ln('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: '(', action: () => handleInput('('), style: 'bg-gray-600 hover:bg-gray-500' },
    { label: ')', action: () => handleInput(')'), style: 'bg-gray-600 hover:bg-gray-500' },
    { label: 'asin', action: () => handleInput('asin('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'acos', action: () => handleInput('acos('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'atan', action: () => handleInput('atan('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: '√', action: () => handleInput('sqrt('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'x²', action: () => handleInput('^2'), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'xʸ', action: () => handleInput('^'), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'AC', action: clear, style: 'bg-red-500/80 hover:bg-red-500' },
    { label: 'sinh', action: () => handleInput('sinh('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'cosh', action: () => handleInput('cosh('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'tanh', action: () => handleInput('tanh('), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: '7', action: () => handleInput('7'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '8', action: () => handleInput('8'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '9', action: () => handleInput('9'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '÷', action: () => handleInput('÷'), style: 'bg-brand-secondary hover:bg-orange-500' },
    { label: 'e', action: () => handleInput('e'), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: 'π', action: () => handleInput('π'), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: '!', action: () => handleInput('!'), style: 'bg-brand-primary/80 hover:bg-brand-primary' },
    { label: '4', action: () => handleInput('4'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '5', action: () => handleInput('5'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '6', action: () => handleInput('6'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '×', action: () => handleInput('×'), style: 'bg-brand-secondary hover:bg-orange-500' },
    { label: 'MC', action: memoryClear, style: 'bg-teal-600 hover:bg-teal-500' },
    { label: 'MR', action: memoryRecall, style: 'bg-teal-600 hover:bg-teal-500' },
    { label: 'MS', action: memoryStore, style: 'bg-teal-600 hover:bg-teal-500' },
    { label: '1', action: () => handleInput('1'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '2', action: () => handleInput('2'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '3', action: () => handleInput('3'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '−', action: () => handleInput('−'), style: 'bg-brand-secondary hover:bg-orange-500' },
    { label: 'M+', action: memoryAdd, style: 'bg-teal-600 hover:bg-teal-500' },
    { label: 'M-', action: memorySubtract, style: 'bg-teal-600 hover:bg-teal-500' },
    { label: 'del', action: backspace, style: 'bg-gray-600 hover:bg-gray-500' },
    { label: '0', action: () => handleInput('0'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '.', action: () => handleInput('.'), style: 'bg-brand-surface hover:bg-gray-600' },
    { label: '=', action: calculate, style: 'bg-brand-accent hover:bg-green-500' },
    { label: '+', action: () => handleInput('+'), style: 'bg-brand-secondary hover:bg-orange-500' },
  ];
  
  const angleModes: { id: AngleMode, label: string }[] = [{ id: 'deg', label: 'DEG' }, { id: 'rad', label: 'RAD' }, { id: 'grad', label: 'GRAD' }];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-gray-900/50 dark:bg-brand-bg rounded-lg p-4 mb-4 text-right min-h-[110px] flex flex-col justify-between relative border border-brand-border">
              <div className="absolute top-2 left-3 text-brand-primary font-bold text-xs">{angleMode.toUpperCase()}</div>
              {memory !== 0 && <div className="absolute top-2 left-14 text-teal-400 font-bold text-xs">M</div>}
              <div className="text-brand-text-secondary text-2xl break-words h-8 overflow-x-auto text-right">{expression}</div>
              <div className="text-4xl font-bold text-brand-text break-words h-12 overflow-x-auto text-right">{result}</div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
              {angleModes.map(mode => (
                  <button key={mode.id} onClick={() => setAngleMode(mode.id)} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${angleMode === mode.id ? 'bg-brand-primary text-white' : 'bg-brand-surface hover:bg-gray-600 dark:hover:bg-brand-border'}`}>
                      {mode.label}
                  </button>
              ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {buttons.map(b => (
              <Button key={b.label} onClick={b.action} className={`${b.style} h-14 text-xl`} ariaLabel={b.label}>{b.label}</Button>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-primary"><Brain /> Formula Explorer</h3>
                <div className="min-h-[200px] relative">
                    {isLoading && <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-surface/50 rounded-lg"><Loader className="animate-spin text-brand-primary" size={48} /><p className="mt-4 text-brand-text-secondary">Gemini is thinking...</p></div>}
                    {!isLoading && error && <div className="text-center p-4"><XCircle className="mx-auto text-red-500" size={48} /><p className="mt-4 font-semibold text-red-400">Calculation Error</p><p className="text-brand-text-secondary">{error}</p></div>}
                    {!isLoading && !error && explanation && <div className="space-y-4"><h4 className="text-xl font-semibold text-brand-accent">{explanation.functionName}</h4><div><p className="font-mono bg-gray-900/70 dark:bg-brand-bg p-3 rounded-md text-brand-secondary break-words">{explanation.formula}</p></div><p className="text-brand-text-secondary">{explanation.description}</p><div><p className="font-semibold">Example:</p><p className="text-brand-text-secondary italic">{explanation.example}</p></div></div>}
                    {!isLoading && !error && !explanation && <div className="text-center text-brand-text-secondary pt-16"><p>Perform a calculation to see a formula explanation here.</p></div>}
                </div>
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-primary"><FlaskConical /> Scientific Constants</h3>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {SCIENTIFIC_CONSTANTS.map(c => (
                        <div key={c.symbol} onClick={() => handleInput(c.value)} title={`Value: ${c.value} ${c.unit}`} className="flex justify-between items-center p-2 rounded-md hover:bg-brand-surface cursor-pointer">
                            <div>
                                <span className="font-semibold">{c.name}</span>
                                <span className="text-sm text-brand-text-secondary ml-2">{`(${c.symbol})`}</span>
                            </div>
                            <span className="font-mono text-brand-accent">{c.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      {toastMessage && <div className="fixed bottom-6 right-6 bg-brand-accent text-white px-5 py-3 rounded-lg shadow-2xl z-50">{toastMessage}</div>}
    </>
  );
};

export default Calculator;
