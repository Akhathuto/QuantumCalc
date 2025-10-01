
import React from 'react';
import { HistoryEntry } from '../types';
import { Star } from 'lucide-react';

interface HistoryProps {
  history: HistoryEntry[];
  loadFromHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  toggleFavorite: (timestamp: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, loadFromHistory, clearHistory, toggleFavorite }) => {
  
  const sortedHistory = [...history].sort((a, b) => {
    // Pinned items first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    // Then sort by date
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleFavoriteClick = (e: React.MouseEvent, timestamp: string) => {
    e.stopPropagation(); // Prevent loading the history item when clicking the star
    toggleFavorite(timestamp);
  };
  
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
          {sortedHistory.map((item, index) => (
            <div
              key={index}
              className={`bg-brand-surface/50 p-4 rounded-lg cursor-pointer hover:bg-brand-surface transition-colors relative ${item.isFavorite ? 'border-l-4 border-yellow-500' : ''}`}
              onClick={() => loadFromHistory(item)}
            >
              <button
                onClick={(e) => handleFavoriteClick(e, item.timestamp)}
                className="absolute top-3 right-3 p-1 text-brand-text-secondary hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full"
                aria-label={item.isFavorite ? "Unfavorite this calculation" : "Favorite this calculation"}
                title={item.isFavorite ? "Unfavorite" : "Favorite"}
              >
                <Star size={18} fill={item.isFavorite ? 'currentColor' : 'none'} className={item.isFavorite ? 'text-yellow-400' : ''} />
              </button>
              <p className="text-sm text-brand-text-secondary pr-8">
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