
import React from 'react';
import { HistoryEntry } from '../types';

interface HistoryProps {
  history: HistoryEntry[];
  loadFromHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ history, loadFromHistory, clearHistory }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-brand-primary">Calculation History</h2>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-md text-sm font-semibold transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-center text-brand-text-secondary py-16">No calculations yet. Go make some history!</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-brand-surface/50 p-4 rounded-lg cursor-pointer hover:bg-brand-surface transition-colors"
              onClick={() => loadFromHistory(item)}
            >
              <p className="text-sm text-brand-text-secondary">
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <p className="font-mono text-lg text-brand-text break-all">{item.expression}</p>
              <p className="font-mono text-xl font-bold text-brand-accent break-all">= {item.result}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
