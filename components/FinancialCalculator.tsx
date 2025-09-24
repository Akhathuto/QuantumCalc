import React, { useState, useMemo, useCallback } from 'react';
import Button from './common/Button';

type FinancialTab = 'loan' | 'savings';

const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound Sterling' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'INR', name: 'Indian Rupee' },
];

const FinancialCalculator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinancialTab>('loan');
    const [currency, setCurrency] = useState<string>('USD');
    
    // Loan State
    const [loanAmount, setLoanAmount] = useState('250000');
    const [interestRate, setInterestRate] = useState('5.5');
    const [loanTerm, setLoanTerm] = useState('30');

    // Savings State
    const [initialPrincipal, setInitialPrincipal] = useState('1000');
    const [monthlyContribution, setMonthlyContribution] = useState('250');
    const [savingsRate, setSavingsRate] = useState('7');
    const [yearsToGrow, setYearsToGrow] = useState('20');
    
    const formatCurrency = useCallback((value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
    }, [currency]);
    
    const currencySymbol = useMemo(() => {
        try {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' })
                .formatToParts(1).find(part => part.type === 'currency')?.value || '$';
        } catch {
            return '$'; // Fallback
        }
    }, [currency]);

    const loanCalculation = useMemo(() => {
        const principal = parseFloat(loanAmount);
        const rate = parseFloat(interestRate);
        const term = parseFloat(loanTerm);

        if (isNaN(principal) || isNaN(rate) || isNaN(term) || principal <= 0 || rate <= 0 || term <= 0) {
            return null;
        }

        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = term * 12;
        
        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) return null;
        
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;
        
        let schedule = [];
        let balance = principal;
        for (let i=1; i<=numberOfPayments; i++) {
            const interestPaid = balance * monthlyRate;
            const principalPaid = monthlyPayment - interestPaid;
            balance -= principalPaid;
            schedule.push({
                month: i,
                interest: formatCurrency(interestPaid),
                principal: formatCurrency(principalPaid),
                balance: formatCurrency(Math.abs(balance))
            });
        }

        return {
            monthlyPayment: formatCurrency(monthlyPayment),
            totalPayment: formatCurrency(totalPayment),
            totalInterest: formatCurrency(totalInterest),
            schedule
        };
    }, [loanAmount, interestRate, loanTerm, formatCurrency]);
    
    const savingsCalculation = useMemo(() => {
        const principal = parseFloat(initialPrincipal);
        const monthly = parseFloat(monthlyContribution);
        const rate = parseFloat(savingsRate);
        const years = parseFloat(yearsToGrow);
        
        if (isNaN(principal) || isNaN(monthly) || isNaN(rate) || isNaN(years) || rate < 0 || years <= 0) {
            return null;
        }
        
        const monthlyRate = rate / 100 / 12;
        const months = years * 12;

        let futureValue = principal * Math.pow(1 + monthlyRate, months);
        if (monthly > 0) {
           futureValue += monthly * ( (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate );
        }

        const totalContributions = principal + (monthly * months);
        const totalInterest = futureValue - totalContributions;

        return {
            futureValue: formatCurrency(futureValue),
            totalContributions: formatCurrency(totalContributions),
            totalInterest: formatCurrency(totalInterest)
        };

    }, [initialPrincipal, monthlyContribution, savingsRate, yearsToGrow, formatCurrency]);

    const InputField = ({ label, value, setter, type = 'number', unit }: {label:string, value:string, setter: (val: string) => void, type?:string, unit?:string}) => (
        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
            <div className="relative">
                <input type={type} value={value} onChange={e => setter(e.target.value)} className="w-full bg-gray-900/70 dark:bg-brand-bg border-brand-border rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary" />
                {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">{unit}</span>}
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-primary mb-4 sm:mb-0">Financial Calculator</h2>
                <div>
                     <label htmlFor="currency-select" className="block text-sm font-medium text-brand-text-secondary mb-1">Currency</label>
                    <select
                        id="currency-select"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="bg-brand-surface border-brand-border rounded-md p-2 w-full sm:w-auto"
                    >
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                    </select>
                </div>
            </div>
            <div className="flex border-b border-brand-border mb-6">
                <button onClick={() => setActiveTab('loan')} className={`px-4 py-2 text-lg ${activeTab === 'loan' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Loan Calculator</button>
                <button onClick={() => setActiveTab('savings')} className={`px-4 py-2 text-lg ${activeTab === 'savings' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Savings Calculator</button>
            </div>

            {activeTab === 'loan' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-brand-surface/50 p-6 rounded-lg space-y-4">
                        <InputField label="Loan Amount" value={loanAmount} setter={setLoanAmount} unit={currencySymbol} />
                        <InputField label="Annual Interest Rate" value={interestRate} setter={setInterestRate} unit="%" />
                        <InputField label="Loan Term" value={loanTerm} setter={setLoanTerm} unit="years" />
                    </div>
                    <div className="md:col-span-2 bg-brand-surface/50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4 text-brand-accent">Loan Summary</h3>
                        {loanCalculation ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-900/70 dark:bg-brand-bg p-4 rounded-lg"><div className="text-sm text-brand-text-secondary">Monthly Payment</div><div className="text-2xl font-bold">{loanCalculation.monthlyPayment}</div></div>
                                    <div className="bg-gray-900/70 dark:bg-brand-bg p-4 rounded-lg"><div className="text-sm text-brand-text-secondary">Total Paid</div><div className="text-2xl font-bold">{loanCalculation.totalPayment}</div></div>
                                    <div className="bg-gray-900/70 dark:bg-brand-bg p-4 rounded-lg"><div className="text-sm text-brand-text-secondary">Total Interest</div><div className="text-2xl font-bold text-brand-secondary">{loanCalculation.totalInterest}</div></div>
                                </div>
                                <h4 className="text-lg font-bold mb-2">Amortization Schedule</h4>
                                <div className="max-h-80 overflow-y-auto border border-brand-border rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-900/70 dark:bg-brand-bg sticky top-0"><tr><th className="p-2">Month</th><th className="p-2">Principal</th><th className="p-2">Interest</th><th className="p-2">Balance</th></tr></thead>
                                        <tbody>{loanCalculation.schedule.map(row => (<tr key={row.month} className="border-b border-brand-border last:border-b-0">
                                            <td className="p-2">{row.month}</td><td className="p-2">{row.principal}</td><td className="p-2 text-brand-secondary">{row.interest}</td><td className="p-2">{row.balance}</td></tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : <p className="text-brand-text-secondary">Please enter valid loan details.</p>}
                    </div>
                </div>
            )}
            
            {activeTab === 'savings' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-1 bg-brand-surface/50 p-6 rounded-lg space-y-4">
                        <InputField label="Initial Principal" value={initialPrincipal} setter={setInitialPrincipal} unit={currencySymbol} />
                        <InputField label="Monthly Contribution" value={monthlyContribution} setter={setMonthlyContribution} unit={currencySymbol} />
                        <InputField label="Annual Interest Rate" value={savingsRate} setter={setSavingsRate} unit="%" />
                        <InputField label="Years to Grow" value={yearsToGrow} setter={setYearsToGrow} unit="years" />
                    </div>
                     <div className="md:col-span-2 bg-brand-surface/50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4 text-brand-accent">Investment Projection</h3>
                        {savingsCalculation ? (
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-900/70 dark:bg-brand-bg p-4 rounded-lg"><div className="text-sm text-brand-text-secondary">Future Value</div><div className="text-3xl font-bold">{savingsCalculation.futureValue}</div></div>
                                <div className="bg-gray-900/70 dark:bg-brand-bg p-4 rounded-lg"><div className="text-sm text-brand-text-secondary">Total Contributions</div><div className="text-2xl font-bold">{savingsCalculation.totalContributions}</div></div>
                                <div className="bg-gray-900/70 dark:bg-brand-bg p-4 rounded-lg"><div className="text-sm text-brand-text-secondary">Total Interest Earned</div><div className="text-2xl font-bold text-brand-accent">{savingsCalculation.totalInterest}</div></div>
                            </div>
                        ) : <p className="text-brand-text-secondary">Please enter valid savings details.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialCalculator;