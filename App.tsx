import React, { useState, useEffect } from 'react';
import { AppTab, HistoryEntry } from './types';
import Calculator from './components/Calculator';
import Graph from './components/Graph';
import Matrix from './components/Matrix';
import Statistics from './components/Statistics';
import EquationSolver from './components/EquationSolver';
import { UnitConverter } from './components/UnitConverter';
import PercentageCalculator from './components/PercentageCalculator';
import BaseConverter from './components/BaseConverter';
import FinancialCalculator from './components/FinancialCalculator';
import DateCalculator from './components/DateCalculator';
import History from './components/History';
import About from './components/About';
import Header from './components/common/Header';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Calculator);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [expressionToLoad, setExpressionToLoad] = useState<HistoryEntry | null>(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');


    // Load history from localStorage on initial render
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('calculatorHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history to localStorage", error);
        }
    }, [history]);
    
    // Theme toggle effect
    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const addToHistory = (entry: HistoryEntry) => {
        setHistory(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 entries
    };
    
    const clearHistory = () => {
        setHistory([]);
    };
    
    const loadFromHistory = (entry: HistoryEntry) => {
        setExpressionToLoad(entry);
        setActiveTab(AppTab.Calculator);
    };
    
    const onExpressionLoaded = () => {
        setExpressionToLoad(null);
    };

    const renderActiveComponent = () => {
        switch (activeTab) {
            case AppTab.Calculator:
                return <Calculator addToHistory={addToHistory} expressionToLoad={expressionToLoad} onExpressionLoaded={onExpressionLoaded} />;
            case AppTab.Graph:
                return <Graph />;
            case AppTab.Matrix:
                return <Matrix />;
            case AppTab.Statistics:
                return <Statistics />;
            case AppTab.EquationSolver:
                return <EquationSolver />;
            case AppTab.UnitConverter:
                return <UnitConverter />;
            case AppTab.PercentageCalculator:
                return <PercentageCalculator />;
            case AppTab.BaseConverter:
                return <BaseConverter />;
            case AppTab.Financial:
                return <FinancialCalculator />;
            case AppTab.Date:
                return <DateCalculator />;
            case AppTab.History:
                return <History history={history} loadFromHistory={loadFromHistory} clearHistory={clearHistory} />;
            case AppTab.About:
                return <About />;
            default:
                return <Calculator addToHistory={addToHistory} expressionToLoad={expressionToLoad} onExpressionLoaded={onExpressionLoaded} />;
        }
    };
    
    return (
        <div className="bg-brand-bg text-brand-text min-h-screen font-sans flex flex-col">
            <Header 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              theme={theme} 
              toggleTheme={toggleTheme}
            />
            <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow">
                {renderActiveComponent()}
            </main>
            <footer className="text-center py-4 text-xs text-brand-text-secondary border-t border-brand-border mt-8">
                <p>QuantumCalc - Powered by Gemini. &copy; {new Date().getFullYear()} EDGTEC</p>
            </footer>
        </div>
    );
};

export default App;
