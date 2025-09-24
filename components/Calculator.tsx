
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HistoryEntry, Explanation } from '../types';
import { getFormulaExplanation } from '../services/geminiService';
import Button from './common/Button';
import { create, all } from 'mathjs';
import { Loader, Brain, FlaskConical } from 'lucide-react';

const math = create(all);
// Add nPr and nCr functions
math.import({
  nPr: (n: number, k: number) => math.permutations(n, k),
  nCr: (n: number, k: number) => math.combinations(n, k),
}, { override: true });


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
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [result, setResult] = useState<string|null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState<number | null>(null);
  const [isSecond, setIsSecond] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [tickerHistory, setTickerHistory] = useState<HistoryEntry[]>([]);

  const parser = useMemo(() => {
    const p = math.parser();
    p.set('degToRad', (angle: number) => angle * Math.PI / 180);
    p.set('gradToRad', (angle: number) => angle * Math.PI / 200);
    p.set('radToDeg', (angle: number) => angle * 180 / Math.PI);
    p.set('radToGrad', (angle: number) => angle * 200 / Math.PI);

    // Clear previous definitions
    p.evaluate('sin(x)=sin(x)');
    p.evaluate('cos(x)=cos(x)');
    p.evaluate('tan(x)=tan(x)');
    p.evaluate('asin(x)=asin(x)');
    p.evaluate('acos(x)=acos(x)');
    p.evaluate('atan(x)=atan(x)');

    if (angleMode === 'deg') {
        p.evaluate('sin(x) = sin(degToRad(x))');
        p.evaluate('cos(x) = cos(degToRad(x))');
        p.evaluate('tan(x) = tan(degToRad(x))');
        p.evaluate('asin(x) = radToDeg(asin(x))');
        p.evaluate('acos(x) = radToDeg(acos(x))');
        p.evaluate('atan(x) = radToDeg(atan(x))');
    } else if (angleMode === 'grad') {
        p.evaluate('sin(x) = sin(gradToRad(x))');
        p.evaluate('cos(x) = cos(gradToRad(x))');
        p.evaluate('tan(x) = tan(gradToRad(x))');
        p.evaluate('asin(x) = radToGrad(asin(x))');
        p.evaluate('acos(x) = radToGrad(acos(x))');
        p.evaluate('atan(x) = radToGrad(atan(x))');
    }
    return p;
  }, [angleMode]);

  useEffect(() => {
    if (expressionToLoad) {
      setExpression(expressionToLoad.expression);
      setDisplayValue(expressionToLoad.expression);
      setResult(null);
      onExpressionLoaded();
    }
  }, [expressionToLoad, onExpressionLoaded]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleInput = useCallback((value: string) => {
    setError(null);
    if (result !== null) { // Start new calculation after '='
        setExpression(value);
        setDisplayValue(value);
        setResult(null);
    } else {
        setDisplayValue(prev => {
            if (prev === '0' && value !== '.') return value;
            if (['+', '−', '×', '÷', '%'].includes(value) && ['+', '−', '×', '÷', '%'].includes(prev.slice(-1))) {
                return prev.slice(0, -1) + value;
            }
            return prev + value;
        });
    }
    if (isSecond) setIsSecond(false);
  }, [result, isSecond]);

  const handleFunction = useCallback((func: string, displayFunc?: string) => {
    setError(null);
    const display = displayFunc || func;
    if (result !== null) {
        setExpression(`${func}${result})`);
        setDisplayValue(`${display}${result})`);
        setResult(null);
    } else {
        setDisplayValue(prev => {
            if(prev === '0') return `${display}`;
            return `${prev}${display}`;
        });
    }
    if (isSecond) setIsSecond(false);
  }, [result, isSecond]);
  
  const clear = useCallback(() => {
    setExpression('');
    setDisplayValue('0');
    setResult(null);
    setError(null);
    setExplanation(null);
    setIsSecond(false);
  }, []);
  
  const backspace = useCallback(() => {
    setError(null);
    if (result !== null) {
        clear();
        return;
    }
    setDisplayValue(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  }, [result, clear]);

  const calculate = useCallback(async () => {
    if (error || isLoading) return;
    
    let exprToEvaluate = displayValue;
    if (expression && displayValue.match(/^[0-9.]+$/) && !['+', '−', '×', '÷', '%'].some(op => expression.endsWith(op))) {
        exprToEvaluate = expression + displayValue;
    } else {
        setExpression(displayValue);
    }
    
    setError(null);
    try {
      const sanitizedExpression = exprToEvaluate
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt')
        .replace(/∛/g, 'cbrt')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      const evalResult = parser.evaluate(sanitizedExpression);
      const resultStr = String(parseFloat(evalResult.toFixed(10)));
      
      const newHistoryEntry = { expression: exprToEvaluate, result: resultStr, timestamp: new Date().toISOString() };
      addToHistory(newHistoryEntry);
      setTickerHistory(prev => [newHistoryEntry, ...prev].slice(0, 5));
      setResult(resultStr);
      
      setIsLoading(true);
      setExplanation(null);
      const expl = await getFormulaExplanation(sanitizedExpression);
      setExplanation(expl);
    } catch (e) {
      setError('Invalid Expression');
      setResult(null);
    } finally {
      setIsLoading(false);
      setIsSecond(false);
    }
  }, [displayValue, expression, error, isLoading, addToHistory, parser]);

  const memoryClear = () => { setMemory(null); showToast("Memory cleared"); };
  const memoryRecall = () => { if(memory !== null) { setDisplayValue(String(memory)); setResult(null); } };
  const memoryStore = () => {
    const valToStore = result ? parseFloat(result) : parseFloat(displayValue);
    if (!isNaN(valToStore)) {
        setMemory(valToStore);
        showToast("Value stored in memory");
    }
  };
  const memoryAdd = () => {
    const currentVal = result ? parseFloat(result) : parseFloat(displayValue);
     if (!isNaN(currentVal)) {
        setMemory(prev => (prev || 0) + currentVal);
        showToast("Value added to memory");
    }
  };
  const memorySubtract = () => {
    const currentVal = result ? parseFloat(result) : parseFloat(displayValue);
    if (!isNaN(currentVal)) {
        setMemory(prev => (prev || 0) - currentVal);
        showToast("Value subtracted from memory");
    }
  };
  
  const handleOp = (op: string) => {
    setError(null);
    if (result !== null) {
      setExpression(result + op);
      setDisplayValue(result + op);
      setResult(null);
    } else {
      setExpression(displayValue + op);
      setDisplayValue(displayValue + op);
    }
  };

  const getStyle = (styleType?: string, active?: boolean) => {
    if (active) return 'bg-brand-primary text-white';
    switch (styleType) {
        case 'op': return 'bg-brand-secondary hover:bg-orange-500 text-white';
        case 'mem': return 'bg-teal-600 hover:bg-teal-500 text-white';
        case 'clear': return 'bg-red-500/80 hover:bg-red-500 text-white';
        case 'num': return 'bg-brand-surface hover:bg-gray-600 text-brand-text';
        case 'func':
        default: return 'bg-brand-primary/80 hover:bg-brand-primary text-white';
    }
  };

  const buttonGrid: { label: string, secondLabel?: string, action: any, secondAction?: any, style: string, colSpan?: number, active?: boolean }[][] = [
      [
          { label: '2nd', action: () => setIsSecond(s => !s), style: 'func', active: isSecond },
          { label: 'π', action: () => handleInput('π'), style: 'func' },
          { label: 'e', action: () => handleInput('e'), style: 'func' },
          { label: 'AC', action: clear, style: 'clear' },
          { label: 'del', action: backspace, style: 'clear' },
      ],
      [
          { label: 'x²', secondLabel: 'x³', action: () => handleInput('^2'), secondAction: () => handleInput('^3'), style: 'func' },
          { label: '1/x', secondLabel: 'rand', action: () => handleInput('^(-1)'), secondAction: () => setDisplayValue(String(Math.random())), style: 'func' },
          { label: '√', secondLabel: '∛', action: () => handleFunction('sqrt(', '√('), secondAction: () => handleFunction('cbrt(', '∛('), style: 'func' },
          { label: '(', action: () => handleInput('('), style: 'func' },
          { label: ')', action: () => handleInput(')'), style: 'func' },
      ],
      [
          { label: 'sin', secondLabel: 'asin', action: () => handleFunction('sin('), secondAction: () => handleFunction('asin('), style: 'func' },
          { label: 'cos', secondLabel: 'acos', action: () => handleFunction('cos('), secondAction: () => handleFunction('acos('), style: 'func' },
          { label: 'tan', secondLabel: 'atan', action: () => handleFunction('tan('), secondAction: () => handleFunction('atan('), style: 'func' },
          { label: 'log', secondLabel: 'log₂', action: () => handleFunction('log('), secondAction: () => handleFunction('log2('), style: 'func' },
          { label: 'ln', action: () => handleFunction('ln('), style: 'func' },
      ],
      [
          { label: 'sinh', secondLabel: 'asinh', action: () => handleFunction('sinh('), secondAction: () => handleFunction('asinh('), style: 'func' },
          { label: 'cosh', secondLabel: 'acosh', action: () => handleFunction('cosh('), secondAction: () => handleFunction('acosh('), style: 'func' },
          { label: 'tanh', secondLabel: 'atanh', action: () => handleFunction('tanh('), secondAction: () => handleFunction('atanh('), style: 'func' },
          { label: 'nCr', action: () => handleFunction('nCr('), style: 'func' },
          { label: 'nPr', action: () => handleFunction('nPr('), style: 'func' },
      ],
       [
          { label: '7', action: () => handleInput('7'), style: 'num' },
          { label: '8', action: () => handleInput('8'), style: 'num' },
          { label: '9', action: () => handleInput('9'), style: 'num' },
          { label: '÷', action: () => handleOp('÷'), style: 'op' },
          { label: 'MC', action: memoryClear, style: 'mem' },
      ],
      [
          { label: '4', action: () => handleInput('4'), style: 'num' },
          { label: '5', action: () => handleInput('5'), style: 'num' },
          { label: '6', action: () => handleInput('6'), style: 'num' },
          { label: '×', action: () => handleOp('×'), style: 'op' },
          { label: 'MR', action: memoryRecall, style: 'mem' },
      ],
      [
          { label: '1', action: () => handleInput('1'), style: 'num' },
          { label: '2', action: () => handleInput('2'), style: 'num' },
          { label: '3', action: () => handleInput('3'), style: 'num' },
          { label: '−', action: () => handleOp('−'), style: 'op' },
          { label: 'M+', action: memoryAdd, style: 'mem' },
      ],
      [
          { label: '0', action: () => handleInput('0'), style: 'num', colSpan: 2 },
          { label: '.', action: () => handleInput('.'), style: 'num' },
          { label: '+', action: () => handleOp('+'), style: 'op' },
          { label: 'M-', action: memorySubtract, style: 'mem' },
      ],
      [
          { label: '%', action: () => handleInput('%'), style: 'func' },
          { label: 'EE', action: () => handleInput('e'), style: 'func' },
          { label: '=', action: calculate, style: 'op', colSpan: 3 },
      ]
  ];

  const angleModes: { id: AngleMode, label: string }[] = [{ id: 'deg', label: 'DEG' }, { id: 'rad', label: 'RAD' }, { id: 'grad', label: 'GRAD' }];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <div className="bg-gray-900/50 rounded-lg p-4 mb-4 text-right min-h-[160px] flex flex-col justify-between relative border border-brand-border">
              {/* Ticker Tape History */}
              <div className="h-16 overflow-y-auto text-right text-sm text-brand-text-secondary pr-1">
                  {tickerHistory.map((item, index) => (
                      <div key={index} className="opacity-70">
                          <span>{item.expression} = </span>
                          <span className="font-semibold">{item.result}</span>
                      </div>
                  ))}
              </div>

              {/* Main Display */}
              <div className="border-t border-brand-border/50 pt-2">
                  <div className="absolute top-2 left-3 flex items-center gap-4 text-xs font-bold z-10">
                      {isSecond && <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded">2nd</span>}
                      <span className="text-brand-primary">{angleMode.toUpperCase()}</span>
                      {memory !== null && <span className="text-teal-400">M</span>}
                  </div>
                  <div className="text-brand-text-secondary text-xl break-words h-7 overflow-x-auto text-right font-mono">{expression}</div>
                  <div className="text-4xl font-bold text-brand-text break-words h-12 overflow-x-auto text-right font-mono">
                      {result ?? displayValue}
                  </div>
                  {error && <div className="text-red-400 text-sm font-semibold h-5 text-right">{error}</div>}
              </div>
          </div>
          
           <div className="grid grid-cols-5 gap-2">
            {buttonGrid.flat().map((b, index) => (
                <div key={index} className={b.colSpan ? `col-span-${b.colSpan}` : 'col-span-1'}>
                    <Button
                        onClick={isSecond && b.secondAction ? b.secondAction : b.action}
                        className={`${getStyle(b.style, b.active)} h-12 text-base w-full`}
                    >
                        {isSecond && b.secondLabel ? b.secondLabel : b.label}
                    </Button>
                </div>
            ))}
            </div>
            
           <div className="flex justify-center gap-2 mt-4">
              {angleModes.map(mode => (
                  <button key={mode.id} onClick={() => setAngleMode(mode.id)} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${angleMode === mode.id ? 'bg-brand-primary text-white' : 'bg-brand-surface hover:bg-gray-600'}`}>
                      {mode.label}
                  </button>
              ))}
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-primary"><Brain /> Formula Explorer</h3>
                <div className="min-h-[200px] relative">
                    {isLoading && <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-surface/50 rounded-lg"><Loader className="animate-spin text-brand-primary" size={48} /><p className="mt-4 text-brand-text-secondary">Gemini is thinking...</p></div>}
                    {!isLoading && !error && explanation && <div className="space-y-4"><h4 className="text-xl font-semibold text-brand-accent">{explanation.functionName}</h4><div><p className="font-mono bg-brand-bg p-3 rounded-md text-brand-secondary break-words">{explanation.formula}</p></div><p className="text-brand-text-secondary">{explanation.description}</p><div><p className="font-semibold">Example:</p><p className="text-brand-text-secondary italic">{explanation.example}</p></div></div>}
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
                            <span className="font-mono text-brand-accent text-sm">{c.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      {toastMessage && <div className="fixed bottom-6 right-6 bg-brand-accent text-white px-5 py-3 rounded-lg shadow-2xl z-50 animate-fade-in-down">{toastMessage}</div>}
    </>
  );
};

export default Calculator;
