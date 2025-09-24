
import React, { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const CURRENCY_RATES: Record<string, number> = {
  USD: 1, // Base
  EUR: 0.92,
  JPY: 157.24,
  GBP: 0.78,
  AUD: 1.50,
  CAD: 1.37,
  CHF: 0.90,
  CNY: 7.25,
  INR: 83.54,
  ZAR: 18.85,
};

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const convertedAmount = useMemo(() => {
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount)) return '';

    const rateFrom = CURRENCY_RATES[fromCurrency];
    const rateTo = CURRENCY_RATES[toCurrency];

    if (!rateFrom || !rateTo) return '';

    const amountInUSD = inputAmount / rateFrom;
    const result = amountInUSD * rateTo;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: toCurrency,
      maximumFractionDigits: 2,
    }).format(result);
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencyOptions = Object.keys(CURRENCY_RATES);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-brand-primary">Currency Converter</h2>
      <div className="bg-brand-surface/50 p-6 rounded-lg">
        <p className="text-sm text-brand-text-secondary mb-4">
          Exchange rates are for demonstration purposes and may not be up-to-date.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-brand-text-secondary mb-1">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Converted Amount</label>
            <div className="w-full bg-gray-900/50 border-gray-700 rounded-md p-3 font-mono text-lg min-h-[50px] flex items-center">
              {convertedAmount}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full mt-2 bg-gray-900/70 border-gray-600 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
