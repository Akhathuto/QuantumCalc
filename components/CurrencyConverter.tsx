import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowRightLeft, Loader, AlertTriangle, TrendingUp } from 'lucide-react';

const API_URL = 'https://open.exchangerate-api.com/v6/latest';

interface RatesData {
  rates: Record<string, number>;
  time_last_update_utc: string;
}

const CurrencyConverter: React.FC = () => {
  const [amountFrom, setAmountFrom] = useState('100');
  const [amountTo, setAmountTo] = useState('');
  
  // Initialize from localStorage or default
  const [fromCurrency, setFromCurrency] = useState(() => localStorage.getItem('fromCurrency') || 'USD');
  const [toCurrency, setToCurrency] = useState(() => localStorage.getItem('toCurrency') || 'EUR');
  
  const [ratesData, setRatesData] = useState<RatesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: RatesData = await response.json();
        setRatesData(data);
      } catch (e: any) {
        setError('Failed to fetch latest exchange rates. Please try again later.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []);

  // Save currency choices to localStorage
  useEffect(() => {
    localStorage.setItem('fromCurrency', fromCurrency);
    localStorage.setItem('toCurrency', toCurrency);
  }, [fromCurrency, toCurrency]);

  const currencyOptions = useMemo(() => {
    if (!ratesData) return [];
    return Object.keys(ratesData.rates);
  }, [ratesData]);

  const calculateConversion = useCallback((amount: string, from: string, to: string, direction: 'from' | 'to') => {
      if (!ratesData || !amount) {
          return '';
      }
      
      const inputAmount = parseFloat(amount);
      if (isNaN(inputAmount)) return '';

      const rateFrom = ratesData.rates[from];
      const rateTo = ratesData.rates[to];

      if (!rateFrom || !rateTo) return '';

      let result: number;
      if (direction === 'from') {
          // Base is USD in the free API, so convert From -> USD -> To
          const amountInUSD = inputAmount / rateFrom;
          result = amountInUSD * rateTo;
      } else { // 'to'
          // Convert To -> USD -> From
          const amountInUSD = inputAmount / rateTo;
          result = amountInUSD * rateFrom;
      }

      return result.toFixed(2);

  }, [ratesData]);

  useEffect(() => {
      // Recalculate 'to' amount whenever 'from' amount or currencies change
      const result = calculateConversion(amountFrom, fromCurrency, toCurrency, 'from');
      setAmountTo(result);
  }, [amountFrom, fromCurrency, toCurrency, calculateConversion]);


  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmountFrom(value);
      const result = calculateConversion(value, fromCurrency, toCurrency, 'from');
      setAmountTo(result);
  };

  const handleAmountToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmountTo(value);
      const result = calculateConversion(value, fromCurrency, toCurrency, 'to');
      setAmountFrom(result);
  };
  
  const swapCurrencies = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };
  
  const exchangeRateText = useMemo(() => {
    if (!ratesData) return '...';
    const rateFrom = ratesData.rates[fromCurrency];
    const rateTo = ratesData.rates[toCurrency];
    if (!rateFrom || !rateTo) return 'N/A';
    const rate = rateTo / rateFrom;
    return `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  }, [fromCurrency, toCurrency, ratesData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="animate-spin text-brand-primary" size={48} />
        <p className="mt-4 text-brand-text-secondary">Fetching latest exchange rates...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center h-64 bg-red-900/50 p-6 rounded-lg">
        <AlertTriangle className="text-red-400" size={48} />
        <p className="mt-4 font-semibold text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-brand-primary">Currency Converter</h2>
      <div className="bg-brand-surface/50 p-6 rounded-lg">
        <div className="text-center text-sm text-brand-text-secondary mb-4">
          Last updated: {ratesData ? new Date(ratesData.time_last_update_utc).toLocaleString() : 'N/A'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="amount-from" className="block text-sm font-medium text-brand-text-secondary mb-1">From</label>
            <input
              id="amount-from"
              type="number"
              value={amountFrom}
              onChange={handleAmountFromChange}
              className="w-full bg-gray-900/70 border-gray-600 rounded-md p-3 font-mono text-lg focus:ring-brand-primary focus:border-brand-primary"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full mt-2 bg-gray-900/70 border-gray-600 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex justify-center">
            <button onClick={swapCurrencies} className="p-3 bg-brand-primary/80 hover:bg-brand-primary rounded-full transition-transform transform hover:rotate-180">
              <ArrowRightLeft size={20} />
            </button>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="amount-to" className="block text-sm font-medium text-brand-text-secondary mb-1">To</label>
            <input
                id="amount-to"
                type="number"
                value={amountTo}
                onChange={handleAmountToChange}
                className="w-full bg-gray-900/70 border-gray-600 rounded-md p-3 font-mono text-lg focus:ring-brand-primary focus:border-brand-primary"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full mt-2 bg-gray-900/70 border-gray-600 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="text-center font-mono text-brand-accent mt-6">
          {exchangeRateText}
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-brand-text-secondary opacity-60">
            <TrendingUp size={16} />
            <span>Short-term forecast feature coming soon.</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;