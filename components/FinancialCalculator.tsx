import React, { useState, useMemo } from 'react';

// --- Reusable UI Components ---
const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    placeholder?: string;
    unit?: string;
    options?: { value: string | number; label: string }[];
}> = ({ label, value, onChange, type = 'number', placeholder, unit, options }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-2">
        <label htmlFor={label} className="text-brand-text-secondary whitespace-nowrap">{label}</label>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {options ? (
                <select id={label} value={value} onChange={onChange} className="w-full sm:w-48 bg-gray-900/70 border-gray-600 rounded-md p-2 text-right focus:ring-brand-primary focus:border-brand-primary">
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            ) : (
                <input
                    id={label}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full sm:w-48 bg-gray-900/70 border-gray-600 rounded-md p-2 text-right focus:ring-brand-primary focus:border-brand-primary"
                    placeholder={placeholder}
                    step="any"
                />
            )}
            {unit && <span className="text-brand-text-secondary">{unit}</span>}
        </div>
    </div>
);

const ResultDisplay: React.FC<{ label: string; value: string; large?: boolean }> = ({ label, value, large = false }) => (
    <div className={`flex justify-between py-2 ${large ? 'flex-col items-start bg-brand-bg p-3 rounded-md' : 'border-b border-gray-700'}`}>
        <span className={`font-semibold ${large ? 'text-brand-text-secondary text-sm' : 'text-brand-text-secondary'}`}>{label}:</span>
        <span className={`font-mono font-bold ${large ? 'text-3xl text-brand-accent' : 'text-xl'}`}>{value}</span>
    </div>
);

const formatCurrency = (value: number, currencyCode: string) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(value);
    } catch {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value); // Fallback to USD
    }
};

const getCurrencySymbol = (currencyCode: string) => {
    try {
        return (0).toLocaleString('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).replace(/\d/g, '').trim();
    } catch {
        return '$'; // Fallback
    }
};


// --- Individual Calculator Components ---

interface FinancialSubCalculatorProps {
    currency: string;
}

const LoanCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [amount, setAmount] = useState('200000');
    const [rate, setRate] = useState('5');
    const [term, setTerm] = useState('30');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const P = parseFloat(amount);
        const annualRate = parseFloat(rate) / 100;
        const termYears = parseFloat(term);
        if (isNaN(P) || isNaN(annualRate) || isNaN(termYears) || P <= 0 || annualRate < 0 || termYears <= 0) return null;

        const i = annualRate / 12;
        const n = termYears * 12;
        if (i === 0) { // Simple interest case if rate is 0
            const monthlyPayment = P / n;
            return { monthlyPayment, totalPayment: P, totalInterest: 0 };
        }
        const monthlyPayment = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
        const totalPayment = monthlyPayment * n;
        const totalInterest = totalPayment - P;
        return { monthlyPayment, totalPayment, totalInterest };
    }, [amount, rate, term]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Loan Amount" value={amount} onChange={(e) => setAmount(e.target.value)} unit={currencySymbol} />
                <InputField label="Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
                <InputField label="Loan Term" value={term} onChange={(e) => setTerm(e.target.value)} unit="years" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Monthly Payment" value={formatCurrency(result.monthlyPayment, currency)} large />
                        <ResultDisplay label="Total Payment" value={formatCurrency(result.totalPayment, currency)} />
                        <ResultDisplay label="Total Interest" value={formatCurrency(result.totalInterest, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid loan details.</p>}
            </div>
        </div>
    );
};
const MortgageCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [homePrice, setHomePrice] = useState('300000');
    const [downPayment, setDownPayment] = useState('60000');
    const [rate, setRate] = useState('4.5');
    const [term, setTerm] = useState('30');
    const [tax, setTax] = useState('2500');
    const [insurance, setInsurance] = useState('1000');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const P = parseFloat(homePrice) - parseFloat(downPayment);
        const annualRate = parseFloat(rate) / 100;
        const termYears = parseFloat(term);
        const annualTax = parseFloat(tax);
        const annualInsurance = parseFloat(insurance);

        if (isNaN(P) || isNaN(annualRate) || isNaN(termYears) || isNaN(annualTax) || isNaN(annualInsurance) || P <= 0) return null;

        const i = annualRate / 12;
        const n = termYears * 12;
        const principalAndInterest = i > 0 ? (P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)) : P / n;
        const monthlyTax = annualTax / 12;
        const monthlyInsurance = annualInsurance / 12;
        const monthlyPayment = principalAndInterest + monthlyTax + monthlyInsurance;
        const totalPayment = monthlyPayment * n;
        const totalInterest = (principalAndInterest * n) - P;

        return { monthlyPayment, principalAndInterest, monthlyTax, monthlyInsurance, totalPayment, totalInterest };
    }, [homePrice, downPayment, rate, term, tax, insurance]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Home Price" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} unit={currencySymbol} />
                <InputField label="Down Payment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} unit={currencySymbol} />
                <InputField label="Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
                <InputField label="Loan Term" value={term} onChange={(e) => setTerm(e.target.value)} unit="years" />
                <InputField label="Property Tax (Annual)" value={tax} onChange={(e) => setTax(e.target.value)} unit={currencySymbol} />
                <InputField label="Home Insurance (Annual)" value={insurance} onChange={(e) => setInsurance(e.target.value)} unit={currencySymbol} />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Total Monthly Payment" value={formatCurrency(result.monthlyPayment, currency)} large />
                        <ResultDisplay label="Principal & Interest" value={formatCurrency(result.principalAndInterest, currency)} />
                        <ResultDisplay label="Property Tax" value={formatCurrency(result.monthlyTax, currency)} />
                        <ResultDisplay label="Home Insurance" value={formatCurrency(result.monthlyInsurance, currency)} />
                        <ResultDisplay label="Total Interest Paid" value={formatCurrency(result.totalInterest, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid mortgage details.</p>}
            </div>
        </div>
    );
};
const AutoLoanCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [price, setPrice] = useState('25000');
    const [downPayment, setDownPayment] = useState('5000');
    const [rate, setRate] = useState('6');
    const [term, setTerm] = useState('5');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const P = parseFloat(price) - parseFloat(downPayment);
        const annualRate = parseFloat(rate) / 100;
        const termYears = parseFloat(term);
        if (isNaN(P) || isNaN(annualRate) || isNaN(termYears) || P <= 0) return null;

        const i = annualRate / 12;
        const n = termYears * 12;
        const monthlyPayment = i > 0 ? (P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)) : P / n;
        const totalPayment = monthlyPayment * n;
        const totalInterest = totalPayment - P;
        return { monthlyPayment, totalPayment, totalInterest };
    }, [price, downPayment, rate, term]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Vehicle Price" value={price} onChange={(e) => setPrice(e.target.value)} unit={currencySymbol} />
                <InputField label="Down Payment" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} unit={currencySymbol} />
                <InputField label="Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
                <InputField label="Loan Term" value={term} onChange={(e) => setTerm(e.target.value)} unit="years" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Monthly Payment" value={formatCurrency(result.monthlyPayment, currency)} large />
                        <ResultDisplay label="Total Payment" value={formatCurrency(result.totalPayment, currency)} />
                        <ResultDisplay label="Total Interest" value={formatCurrency(result.totalInterest, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid loan details.</p>}
            </div>
        </div>
    );
};
const RetirementCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [currentAge, setCurrentAge] = useState('30');
    const [retireAge, setRetireAge] = useState('65');
    const [currentSavings, setCurrentSavings] = useState('50000');
    const [monthlyContribution, setMonthlyContribution] = useState('500');
    const [rate, setRate] = useState('7');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const age = parseInt(currentAge);
        const retire = parseInt(retireAge);
        const P = parseFloat(currentSavings);
        const PMT = parseFloat(monthlyContribution);
        const r = parseFloat(rate) / 100;
        if (isNaN(age) || isNaN(retire) || isNaN(P) || isNaN(PMT) || isNaN(r) || retire <= age) return null;

        const t = retire - age;
        const n = 12;
        const i = r / n;
        const futureValuePrincipal = P * Math.pow(1 + i, t * n);
        const futureValueAnnuity = i > 0 ? (PMT * ((Math.pow(1 + i, t * n) - 1) / i)) : PMT * t * n;
        const total = futureValuePrincipal + futureValueAnnuity;
        const totalContributions = P + (PMT * t * n);
        const totalInterest = total - totalContributions;

        return { total, totalContributions, totalInterest };
    }, [currentAge, retireAge, currentSavings, monthlyContribution, rate]);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Current Age" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} unit="years" />
                <InputField label="Retirement Age" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} unit="years" />
                <InputField label="Current Savings" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} unit={currencySymbol} />
                <InputField label="Monthly Contribution" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} unit={currencySymbol} />
                <InputField label="Estimated Annual Return" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Retirement Savings" value={formatCurrency(result.total, currency)} large />
                        <ResultDisplay label="Total Contributions" value={formatCurrency(result.totalContributions, currency)} />
                        <ResultDisplay label="Total Interest Earned" value={formatCurrency(result.totalInterest, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
const CompoundInterestCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [principal, setPrincipal] = useState('10000');
    const [monthlyContribution, setMonthlyContribution] = useState('500');
    const [rate, setRate] = useState('6');
    const [years, setYears] = useState('10');
    const [compounding, setCompounding] = useState('12');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const P = parseFloat(principal);
        const PMT = parseFloat(monthlyContribution);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(years);
        const n = parseInt(compounding);
        if (isNaN(P) || isNaN(PMT) || isNaN(r) || isNaN(t) || isNaN(n)) return null;
        
        const i = r / n;
        const nt = n * t;
        // The annuity formula for monthly contributions needs to be adjusted for compounding frequency
        // This is a complex formula, for simplicity we assume monthly contribution compounds at the same frequency
        const futureValuePrincipal = P * Math.pow(1 + i, nt);
        const futureValueAnnuity = i > 0 ? (PMT * 12 / n * ((Math.pow(1 + i, nt) - 1) / i)) : (PMT * 12 * t);
        
        const total = futureValuePrincipal + futureValueAnnuity;
        const totalContributions = P + (PMT * 12 * t);
        const totalInterest = total - totalContributions;
        return { total, totalContributions, totalInterest };
    }, [principal, monthlyContribution, rate, years, compounding]);

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Initial Principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} unit={currencySymbol} />
                <InputField label="Monthly Contribution" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} unit={currencySymbol} />
                <InputField label="Annual Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
                <InputField label="Time Period" value={years} onChange={(e) => setYears(e.target.value)} unit="years" />
                <InputField label="Compounding Frequency" value={compounding} onChange={(e) => setCompounding(e.target.value)} options={[
                    {value: 1, label: 'Annually'}, {value: 2, label: 'Semi-Annually'}, {value: 4, label: 'Quarterly'}, {value: 12, label: 'Monthly'}
                ]} />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Future Value" value={formatCurrency(result.total, currency)} large />
                        <ResultDisplay label="Total Contributions" value={formatCurrency(result.totalContributions, currency)} />
                        <ResultDisplay label="Total Interest Earned" value={formatCurrency(result.totalInterest, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
const SalaryCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [gross, setGross] = useState('60000');
    const [payFreq, setPayFreq] = useState('12'); // Monthly
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const grossAnnual = parseFloat(gross);
        const periods = parseInt(payFreq);
        if (isNaN(grossAnnual) || isNaN(periods)) return null;

        // Simplified progressive tax brackets for demonstration (e.g., US Federal 2023 Single)
        const brackets = [
            { rate: 0.10, threshold: 11000 },
            { rate: 0.12, threshold: 44725 },
            { rate: 0.22, threshold: 95375 },
            { rate: 0.24, threshold: 182100 },
        ];
        
        let tax = 0;
        let remainingIncome = grossAnnual;
        let lastThreshold = 0;

        for (const bracket of brackets) {
            if (remainingIncome > 0) {
                const taxableInBracket = Math.min(remainingIncome, bracket.threshold - lastThreshold);
                tax += taxableInBracket * bracket.rate;
                remainingIncome -= taxableInBracket;
                lastThreshold = bracket.threshold;
                 if (remainingIncome <= 0) break;
            }
        }
        if (remainingIncome > 0) tax += remainingIncome * 0.32; // Catch-all for higher brackets
        
        const netAnnual = grossAnnual - tax;
        const grossPerPeriod = grossAnnual / periods;
        const taxPerPeriod = tax / periods;
        const netPerPeriod = netAnnual / periods;
        
        return { grossPerPeriod, taxPerPeriod, netPerPeriod, netAnnual };
    }, [gross, payFreq]);

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Gross Annual Salary" value={gross} onChange={(e) => setGross(e.target.value)} unit={currencySymbol} />
                <InputField label="Pay Frequency" value={payFreq} onChange={(e) => setPayFreq(e.target.value)} options={[
                    {value: 12, label: 'Monthly'}, {value: 24, label: 'Semi-Monthly'}, {value: 26, label: 'Bi-Weekly'}, {value: 52, label: 'Weekly'}
                ]} />
                 <p className="text-xs text-brand-text-secondary italic pt-4">Note: Tax is a simplified progressive estimate for demonstration purposes.</p>
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Net Pay (per period)" value={formatCurrency(result.netPerPeriod, currency)} large />
                        <ResultDisplay label="Gross Pay (per period)" value={formatCurrency(result.grossPerPeriod, currency)} />
                        <ResultDisplay label="Taxes (per period)" value={formatCurrency(result.taxPerPeriod, currency)} />
                        <ResultDisplay label="Net Annual Income" value={formatCurrency(result.netAnnual, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
const InterestCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [principal, setPrincipal] = useState('1000');
    const [rate, setRate] = useState('5');
    const [term, setTerm] = useState('3');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(term);
        if (isNaN(P) || isNaN(r) || isNaN(t)) return null;
        
        const interest = P * r * t;
        const total = P + interest;
        return { interest, total };
    }, [principal, rate, term]);

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Principal Amount" value={principal} onChange={(e) => setPrincipal(e.target.value)} unit={currencySymbol} />
                <InputField label="Annual Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
                <InputField label="Time Period" value={term} onChange={(e) => setTerm(e.target.value)} unit="years" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Total Simple Interest" value={formatCurrency(result.interest, currency)} large />
                        <ResultDisplay label="Total Amount" value={formatCurrency(result.total, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
const SalesTaxCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [price, setPrice] = useState('100');
    const [tax, setTax] = useState('8.25');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const P = parseFloat(price);
        const r = parseFloat(tax) / 100;
        if (isNaN(P) || isNaN(r)) return null;
        
        const taxAmount = P * r;
        const total = P + taxAmount;
        return { taxAmount, total };
    }, [price, tax]);

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Pre-Tax Price" value={price} onChange={(e) => setPrice(e.target.value)} unit={currencySymbol} />
                <InputField label="Sales Tax Rate" value={tax} onChange={(e) => setTax(e.target.value)} unit="%" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label="Total Price" value={formatCurrency(result.total, currency)} large />
                        <ResultDisplay label="Sales Tax Amount" value={formatCurrency(result.taxAmount, currency)} />
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
const InflationCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [amount, setAmount] = useState('1000');
    const [startYear, setStartYear] = useState('2010');
    const [endYear, setEndYear] = useState(new Date().getFullYear().toString());
    const [rate, setRate] = useState('2.5');
    const currencySymbol = getCurrencySymbol(currency);

    const result = useMemo(() => {
        const A = parseFloat(amount);
        const sYear = parseInt(startYear);
        const eYear = parseInt(endYear);
        const r = parseFloat(rate) / 100;
        if (isNaN(A) || isNaN(sYear) || isNaN(eYear) || isNaN(r) || eYear <= sYear) return null;
        
        const years = eYear - sYear;
        const futureValue = A * Math.pow(1 + r, years);
        return { futureValue };
    }, [amount, startYear, endYear, rate]);

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Initial Amount" value={amount} onChange={(e) => setAmount(e.target.value)} unit={currencySymbol} />
                <InputField label="Start Year" value={startYear} onChange={(e) => setStartYear(e.target.value)} />
                <InputField label="End Year" value={endYear} onChange={(e) => setEndYear(e.target.value)} />
                <InputField label="Average Annual Inflation" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-4">
                {result ? (
                    <>
                        <ResultDisplay label={`Value in ${endYear}`} value={formatCurrency(result.futureValue, currency)} large />
                        <p className="text-sm text-brand-text-secondary">{formatCurrency(parseFloat(amount), currency)} in {startYear} has the same buying power as {formatCurrency(result.futureValue, currency)} in {endYear}.</p>
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
const AmortizationCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [amount, setAmount] = useState('200000');
    const [rate, setRate] = useState('5');
    const [term, setTerm] = useState('5'); // Shorter term for better schedule view
    const currencySymbol = getCurrencySymbol(currency);

    const schedule = useMemo(() => {
        const P = parseFloat(amount);
        const annualRate = parseFloat(rate) / 100;
        const termYears = parseFloat(term);
        if (isNaN(P) || isNaN(annualRate) || isNaN(termYears) || P <= 0) return null;

        const i = annualRate / 12;
        const n = termYears * 12;
        const monthlyPayment = i > 0 ? P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : P / n;
        
        let balance = P;
        const scheduleData = [];
        for (let j = 1; j <= n; j++) {
            const interestPaid = balance * i;
            const principalPaid = monthlyPayment - interestPaid;
            balance -= principalPaid;
            scheduleData.push({ month: j, interest: interestPaid, principal: principalPaid, balance: balance > 0 ? balance : 0 });
        }
        return { monthlyPayment, scheduleData };
    }, [amount, rate, term]);

    return (
        <div>
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2 mb-6">
                 <InputField label="Loan Amount" value={amount} onChange={(e) => setAmount(e.target.value)} unit={currencySymbol} />
                <InputField label="Interest Rate" value={rate} onChange={(e) => setRate(e.target.value)} unit="%" />
                <InputField label="Loan Term" value={term} onChange={(e) => setTerm(e.target.value)} unit="years" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                {schedule ? (
                    <>
                        <ResultDisplay label="Monthly Payment" value={formatCurrency(schedule.monthlyPayment, currency)} large />
                        <div className="mt-4 max-h-96 overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-brand-bg">
                                    <tr>
                                        <th className="p-2">Month</th>
                                        <th className="p-2 text-right">Principal</th>
                                        <th className="p-2 text-right">Interest</th>
                                        <th className="p-2 text-right">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.scheduleData.map(row => (
                                        <tr key={row.month} className="border-t border-gray-700">
                                            <td className="p-2">{row.month}</td>
                                            <td className="p-2 text-right font-mono">{formatCurrency(row.principal, currency)}</td>
                                            <td className="p-2 text-right font-mono">{formatCurrency(row.interest, currency)}</td>
                                            <td className="p-2 text-right font-mono">{formatCurrency(row.balance, currency)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : <p className="text-brand-text-secondary">Enter valid details to generate schedule.</p>}
            </div>
        </div>
    );
};
const InterestRateCalculator: React.FC<FinancialSubCalculatorProps> = ({ currency }) => {
    const [amount, setAmount] = useState('10000');
    const [payment, setPayment] = useState('200');
    const [term, setTerm] = useState('5');
    const currencySymbol = getCurrencySymbol(currency);
    
    const result = useMemo(() => {
        const P = parseFloat(amount);
        const PMT = parseFloat(payment);
        const termYears = parseFloat(term);
        if (isNaN(P) || isNaN(PMT) || isNaN(termYears) || P <= 0 || PMT <= 0 || termYears <= 0) return null;

        const n = termYears * 12;
        if (PMT * n < P) return { rate: "Invalid (Payment is too low)" };
        
        // Iterative approach to find rate (Bisection method)
        let low = 0;
        let high = 1;
        let mid = 0;
        for (let i = 0; i < 100; i++) {
            mid = (low + high) / 2;
            const calculatedPayment = P * (mid * Math.pow(1 + mid, n)) / (Math.pow(1 + mid, n) - 1);
            if (calculatedPayment > PMT) {
                high = mid;
            } else {
                low = mid;
            }
        }
        const annualRate = mid * 12 * 100;
        return { rate: `${annualRate.toFixed(4)}%` };
    }, [amount, payment, term]);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-brand-surface/50 p-6 rounded-lg space-y-2">
                <InputField label="Loan Amount" value={amount} onChange={(e) => setAmount(e.target.value)} unit={currencySymbol} />
                <InputField label="Monthly Payment" value={payment} onChange={(e) => setPayment(e.target.value)} unit={currencySymbol} />
                <InputField label="Loan Term" value={term} onChange={(e) => setTerm(e.target.value)} unit="years" />
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                {result ? (
                    <ResultDisplay label="Estimated Annual Rate (APR)" value={result.rate} large />
                ) : <p className="text-brand-text-secondary">Enter valid details.</p>}
            </div>
        </div>
    );
};
// Generic placeholder for calculators that are effectively covered by others
const GenericInfo: React.FC<{name: string, info: string}> = ({name, info}) => <div className="bg-brand-surface/50 p-6 rounded-lg"><h3 className="text-xl font-bold">{name}</h3><p className="text-brand-text-secondary mt-2">{info}</p></div>;


// --- Main FinancialCalculator Component ---
const FinancialCalculator: React.FC = () => {
    const calculators = [
        { id: 'mortgage', name: 'Mortgage Calculator', component: MortgageCalculator },
        { id: 'loan', name: 'Loan Calculator', component: LoanCalculator },
        { id: 'autoLoan', name: 'Auto Loan Calculator', component: AutoLoanCalculator },
        { id: 'compoundInterest', name: 'Compound Interest', component: CompoundInterestCalculator },
        { id: 'investment', name: 'Investment Calculator', component: CompoundInterestCalculator },
        { id: 'retirement', name: 'Retirement Calculator', component: RetirementCalculator },
        { id: 'amortization', name: 'Amortization Calculator', component: AmortizationCalculator },
        { id: 'salary', name: 'Salary Calculator', component: SalaryCalculator },
        { id: 'incomeTax', name: 'Income Tax Calculator', component: () => <GenericInfo name="Income Tax" info="Use the Salary Calculator for a simplified income tax estimation."/> },
        { id: 'interest', name: 'Interest Calculator', component: InterestCalculator },
        { id: 'interestRate', name: 'Interest Rate Calculator', component: InterestRateCalculator },
        { id: 'payment', name: 'Payment Calculator', component: () => <GenericInfo name="Payment Calculator" info="Use the Loan, Mortgage, or Auto Loan calculators to find the monthly payment."/> },
        { id: 'salesTax', name: 'Sales Tax Calculator', component: SalesTaxCalculator },
        { id: 'inflation', name: 'Inflation Calculator', component: InflationCalculator },
        { id: 'finance', name: 'Finance Calculator', component: () => <GenericInfo name="Finance Calculator" info="Use one of the more specific calculators like Loan, Investment, or Retirement for your needs."/> },
    ];

    const [activeCalcId, setActiveCalcId] = useState(calculators[0].id);
    const [currency, setCurrency] = useState('USD');

    const currencies = [
        { code: 'USD', name: 'United States Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'GBP', name: 'British Pound Sterling' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'ZAR', name: 'South African Rand' },
    ];

    const ActiveCalculator = useMemo(() => {
      const calculator = calculators.find(c => c.id === activeCalcId);
      if (!calculator) return null;
      // Some components don't need currency, check if the props are expected
      if (['incomeTax', 'payment', 'finance'].includes(calculator.id)) {
          const Component = calculator.component as React.ComponentType;
          return () => <Component />;
      }
      
      const Component = calculator.component as React.ComponentType<FinancialSubCalculatorProps>;
      return () => <Component currency={currency} />;
    }, [activeCalcId, currency]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-brand-primary">Financial Calculators</h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                     <select 
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="bg-brand-surface border-gray-600 rounded-md p-2 text-base focus:ring-brand-primary focus:border-brand-primary"
                        aria-label="Select Currency"
                    >
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                    </select>
                    <select 
                        value={activeCalcId} 
                        onChange={e => setActiveCalcId(e.target.value)}
                        className="bg-brand-surface border-gray-600 rounded-md p-2 text-base focus:ring-brand-primary focus:border-brand-primary flex-grow"
                         aria-label="Select Calculator"
                    >
                        {calculators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="mt-6">
                {ActiveCalculator && <ActiveCalculator />}
            </div>
        </div>
    );
};

export default FinancialCalculator;