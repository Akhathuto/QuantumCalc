
import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Calculator from './components/Calculator';
import History from './components/History';
import Graph from './components/Graph';
import Matrix from './components/Matrix';
import Statistics from './components/Statistics';
import EquationSolver from './components/EquationSolver';
import { UnitConverter } from './components/UnitConverter';
import CurrencyConverter from './components/CurrencyConverter';
import PercentageCalculator from './components/PercentageCalculator';
import BaseConverter from './components/BaseConverter';
import FinancialCalculator from './components/FinancialCalculator';
import DateCalculator from './components/DateCalculator';
import HealthCalculator from './components/HealthCalculator';
import About from './components/About';
import TermsAndLicense from './components/TermsAndLicense';
import Settings from './components/Settings';
import { AppTab, HistoryEntry } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const savedHistory = localStorage.getItem('calcHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    // Fix: Added curly braces to the catch block to fix syntax error. This resolves all subsequent scope-related errors.
    } catch (error) {
      console.error("Could not parse history from localStorage", error);
      return [];
    }
  });

  const [expressionToLoad, setExpressionToLoad] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    localStorage.setItem('calcHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 entries
  };

  const clearHistory = () => {
    setHistory([]);
  };
  
  const toggleFavorite = (timestamp: string) => {
    setHistory(prev =>
      prev.map(entry =>
        entry.timestamp === timestamp
          ? { ...entry, isFavorite: !entry.isFavorite }
          : entry
      )
    );
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setExpressionToLoad(entry);
    setActiveTab('calculator');
  };

  const handleExpressionLoaded = () => {
    setExpressionToLoad(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'calculator':
        return <Calculator addToHistory={addToHistory} expressionToLoad={expressionToLoad} onExpressionLoaded={handleExpressionLoaded} />;
      case 'graphing':
        return <Graph />;
      case 'matrix':
        return <Matrix />;
      case 'statistics':
        return <Statistics />;
      case 'equations':
        return <EquationSolver />;
      case 'units':
        return <UnitConverter />;
      case 'currency':
        return <CurrencyConverter />;
      case 'percentage':
        return <PercentageCalculator />;
      case 'base':
        return <BaseConverter />;
      case 'financial':
        return <FinancialCalculator />;
      case 'date':
        return <DateCalculator />;
      case 'health':
        return <HealthCalculator />;
      case 'history':
        return <History history={history} loadFromHistory={loadFromHistory} clearHistory={clearHistory} toggleFavorite={toggleFavorite} />;
      case 'about':
        return <About />;
      case 'settings':
        return <Settings />;
      case 'terms':
        return <TermsAndLicense />;
      default:
        return <Calculator addToHistory={addToHistory} expressionToLoad={expressionToLoad} onExpressionLoaded={handleExpressionLoaded} />;
    }
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen font-sans">
      <Header activeTab={activeTab} onTabClick={setActiveTab} />
      <main className="container mx-auto px-4 pb-8">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default App;