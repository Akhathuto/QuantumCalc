import React, { useState, useMemo } from 'react';
import { Landmark, PiggyBank, HandCoins, Car, Home, Percent, Calendar, University, Briefcase, TrendingUp, Receipt, FileText, Bot, Banknote } from 'lucide-react';
import CustomDropdown from './common/CustomDropdown';

// --- Reusable UI ---
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, id: string, currencySymbol?: string }> = ({ label, id, currencySymbol, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
        <div className="relative">
             {currencySymbol && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary">{currencySymbol}</span>}
            <input id={id} {...props} className={`${currencySymbol ? 'pl-7' : ''}`} />
        </div>
    </div>
);

const ResultCard: React.FC<{ title: string; value: string; description?: string }> = ({ title, value, description }) => (
    <div className="bg-brand-bg p-4 rounded-lg text-center flex-1">
        <p className="text-sm text-brand-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-brand-accent my-1 break-all">{value}</p>
        {description && <p className="text-xs text-brand-text-secondary">{description}</p>}
    </div>
);

const Placeholder: React.FC<{ description: string }> = ({ description }) => (
    <div className="flex flex-col items-center justify-center h-64 text-center text-brand-text-secondary bg-brand-bg/50 rounded-lg p-4">
        <Bot size={48} className="mb-4 text-brand-primary" />
        <h3 className="text-lg font-semibold text-brand-text">Coming Soon</h3>
        <p className="max-w-md mt-2">{description}</p>
    </div>
);

// --- Helper Functions ---
const formatCurrency = (value: number | undefined | null, currencyCode: string) => {
    if (value === undefined || value === null || isNaN(value)) return '--';
    try {
        return value.toLocaleString(undefined, { style: 'currency', currency: currencyCode, maximumFractionDigits: 2 });
    } catch (e) {
        return `$${value.toFixed(2)}`;
    }
};

interface CalculatorProps {
  currency: string;
}

// --- Individual Calculators ---

const LoanCalculator: React.FC<CalculatorProps> = ({ currency }) => {
    const [amount, setAmount] = useState('25000');
    const [rate, setRate] = useState('6.5');
    const [term, setTerm] = useState('5');

    const result = useMemo(() => {
        const P = parseFloat(amount);
        const annualRate = parseFloat(rate);
        const years = parseInt(term);

        if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate < 0 || years <= 0) return null;

        const i = annualRate / 100 / 12; // monthly interest rate
        const n = years * 12; // number of months
        
        if (i === 0) { // Simple interest-free loan
            const M = P / n;
            return { monthlyPayment: M, totalInterest: 0, totalPaid: P };
        }
        
        const M = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
        const totalPaid = M * n;
        const totalInterest = totalPaid - P;

        return { monthlyPayment: M, totalInterest, totalPaid };
    }, [amount, rate, term]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 bg-brand-bg/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Loan Details</h3>
                <InputField label="Loan Amount" id="loan-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} currencySymbol={new Intl.NumberFormat(undefined, { style: 'currency', currency }).formatToParts(1).find(p => p.type === 'currency')?.value} />
                <InputField label="Annual Interest Rate (%)" id="loan-rate" type="number" value={rate} onChange={e => setRate(e.target.value)} />
                <InputField label="Loan Term (Years)" id="loan-term" type="number" value={term} onChange={e => setTerm(e.target.value)} />
            </div>
            <div className="space-y-4">
                <ResultCard title="Monthly Payment" value={formatCurrency(result?.monthlyPayment, currency)} description="The amount you'll pay each month." />
                <ResultCard title="Total Interest Paid" value={formatCurrency(result?.totalInterest, currency)} description="The total interest paid over the life of the loan." />
                <ResultCard title="Total Amount Paid" value={formatCurrency(result?.totalPaid, currency)} description="Principal + Interest" />
            </div>
        </div>
    );
};

const CompoundInterestCalculator: React.FC<CalculatorProps> = ({ currency }) => {
    const [principal, setPrincipal] = useState('1000');
    const [contribution, setContribution] = useState('100');
    const [rate, setRate] = useState('7');
    const [term, setTerm] = useState('10');
    const [frequency, setFrequency] = useState('12'); // Monthly

    const result = useMemo(() => {
        const P = parseFloat(principal);
        const PMT = parseFloat(contribution);
        const r = parseFloat(rate) / 100;
        const t = parseInt(term);
        const n = parseInt(frequency);

        if (isNaN(P) || isNaN(PMT) || isNaN(r) || isNaN(t) || isNaN(n) || t <= 0 || n <= 0) return null;

        let futureValue;
        const totalPeriods = n * t;

        if (r === 0) {
            futureValue = P + PMT * totalPeriods;
        } else {
            const ratePerPeriod = r / n;
            const principalGrowth = P * Math.pow(1 + ratePerPeriod, totalPeriods);
            const contributionGrowth = PMT * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
            futureValue = principalGrowth + contributionGrowth;
        }
        
        const totalContributions = P + (PMT * totalPeriods);
        const totalInterest = futureValue - totalContributions;
        
        return { futureValue, totalContributions, totalInterest };

    }, [principal, contribution, rate, term, frequency]);
    
    const currencySymbol = new Intl.NumberFormat(undefined, { style: 'currency', currency }).formatToParts(1).find(p => p.type === 'currency')?.value;

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 bg-brand-bg/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Investment Details</h3>
                <InputField label="Initial Principal" id="ci-principal" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} currencySymbol={currencySymbol} />
                <InputField label="Periodic Contribution" id="ci-contribution" type="number" value={contribution} onChange={e => setContribution(e.target.value)} currencySymbol={currencySymbol} />
                <InputField label="Annual Interest Rate (%)" id="ci-rate" type="number" value={rate} onChange={e => setRate(e.target.value)} />
                <InputField label="Investment Term (Years)" id="ci-term" type="number" value={term} onChange={e => setTerm(e.target.value)} />
                <div>
                  <label htmlFor="ci-frequency" className="block text-sm font-medium text-brand-text-secondary mb-1">Compounding Frequency</label>
                  <select id="ci-frequency" value={frequency} onChange={e => setFrequency(e.target.value)}>
                    <option value="365">Daily</option>
                    <option value="12">Monthly</option>
                    <option value="4">Quarterly</option>
                    <option value="1">Annually</option>
                  </select>
                </div>
            </div>
            <div className="space-y-4">
                <ResultCard title="Future Value" value={formatCurrency(result?.futureValue, currency)} description="The total value of your investment at the end of the term." />
                <ResultCard title="Total Contributions" value={formatCurrency(result?.totalContributions, currency)} description="Principal + all periodic contributions." />
                <ResultCard title="Total Interest Earned" value={formatCurrency(result?.totalInterest, currency)} description="The profit earned from compounding." />
            </div>
        </div>
    );
};


const InterestRateCalculator: React.FC<CalculatorProps> = ({ currency }) => {
    const [loanAmount, setLoanAmount] = useState('20000');
    const [monthlyPayment, setMonthlyPayment] = useState('400');
    const [termYears, setTermYears] = useState('5');

    const result = useMemo(() => {
        const P = parseFloat(loanAmount);
        const M = parseFloat(monthlyPayment);
        const t = parseInt(termYears);

        if (isNaN(P) || isNaN(M) || isNaN(t) || P <= 0 || M <= 0 || t <= 0) {
            return { error: "Please enter valid positive numbers for all fields." };
        }
        
        const n = t * 12; // total number of payments

        if (M * n <= P) {
            return { error: "Monthly payment is too low to cover the principal. The loan will never be paid off." };
        }

        // Iterative calculation for interest rate (bisection method)
        let lowRate = 0;
        let highRate = 1; // 100% annual rate as upper bound
        let midRate = 0;
        const precision = 1e-7;
        let iterations = 0;
        const maxIterations = 100;

        while (iterations < maxIterations) {
            midRate = (lowRate + highRate) / 2;
            if (highRate - lowRate < precision) break;
            
            const calculatedPayment = P * (midRate * Math.pow(1 + midRate, n)) / (Math.pow(1 + midRate, n) - 1);

            if (calculatedPayment > M) {
                highRate = midRate;
            } else {
                lowRate = midRate;
            }
            iterations++;
        }
        
        const monthlyRate = midRate;
        if (monthlyRate === null || isNaN(monthlyRate)) {
            return { error: "Could not calculate the interest rate." };
        }
        
        const apr = monthlyRate * 12 * 100; // Annual rate in percentage
        const totalPaid = M * n;
        const totalInterest = totalPaid - P;

        return { apr, totalPaid, totalInterest, error: null };
    }, [loanAmount, monthlyPayment, termYears]);
    
    const currencySymbol = new Intl.NumberFormat(undefined, { style: 'currency', currency }).formatToParts(1).find(p => p.type === 'currency')?.value;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 bg-brand-bg/30 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Loan Details</h3>
                <InputField label="Loan Amount" id="ir-loan-amount" type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} currencySymbol={currencySymbol} />
                <InputField label="Monthly Payment" id="ir-monthly-payment" type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} currencySymbol={currencySymbol} />
                <InputField label="Loan Term (Years)" id="ir-term" type="number" value={termYears} onChange={e => setTermYears(e.target.value)} />
            </div>
            <div className="space-y-4">
                {result.error ? (
                    <div className="bg-red-900/50 text-red-300 p-4 rounded-lg text-center">{result.error}</div>
                ) : (
                    <>
                        <ResultCard title="Estimated Annual Rate (APR)" value={`${result.apr?.toFixed(3) ?? '--'}%`} description="The calculated annual interest rate." />
                        <ResultCard title="Total Paid" value={formatCurrency(result.totalPaid, currency)} description="The total amount you will pay over the loan term." />
                        <ResultCard title="Total Interest" value={formatCurrency(result.totalInterest, currency)} description="The total cost of borrowing." />
                    </>
                )}
            </div>
        </div>
    );
};


const MortgageCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will help you calculate monthly mortgage payments including principal, interest, taxes, and insurance (PITI). You'll also be able to see a full amortization schedule." />
);
const AutoLoanCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will calculate your monthly auto loan payment and the total cost of the loan, helping you budget for your new vehicle." />
);
const InterestCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="A simple tool to calculate the interest earned or paid on a principal amount over a specific period without compounding." />
);
const PaymentCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will calculate the payment amount for a loan based on the principal, interest rate, and term." />
);
const RetirementCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will help you project your retirement savings growth and determine if you're on track to meet your financial goals for retirement." />
);
const AmortizationCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will generate a detailed, payment-by-payment amortization schedule for any loan, showing the breakdown of principal and interest." />
);
const InvestmentCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="A tool to project the future value of your investments based on your initial principal, contributions, rate of return, and investment period." />
);
const InflationCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will calculate the future value of money or the buying power of a certain amount over time, based on an estimated inflation rate." />
);
const FinanceCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="A versatile tool to solve for different financial variables such as Present Value (PV), Future Value (FV), rate, or number of periods." />
);
const IncomeTaxCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will provide an estimate of your income tax liability based on your gross income, filing status, and deductions, using progressive tax brackets." />
);
const SalaryCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="This tool will help you calculate your take-home pay by subtracting estimated taxes and deductions from your gross salary." />
);
const SalesTaxCalculator: React.FC<CalculatorProps> = ({ currency }) => (
  <Placeholder description="A simple tool to calculate the sales tax and final price of a product or service based on the pre-tax price and tax rate." />
);

// --- Main Component ---
const FinancialCalculator: React.FC = () => {
    const [activeCalc, setActiveCalc] = useState('loan');
    const [currency, setCurrency] = useState('USD');

    const calculatorList = [
        { value: 'mortgage', label: 'Mortgage Calculator', Icon: Home },
        { value: 'loan', label: 'Loan Calculator', Icon: Landmark },
        { value: 'auto-loan', label: 'Auto Loan Calculator', Icon: Car },
        { value: 'interest', label: 'Interest Calculator', Icon: Percent },
        { value: 'payment', label: 'Payment Calculator', Icon: HandCoins },
        { value: 'retirement', label: 'Retirement Calculator', Icon: PiggyBank },
        { value: 'amortization', label: 'Amortization Calculator', Icon: FileText },
        { value: 'investment', label: 'Investment Calculator', Icon: TrendingUp },
        { value: 'inflation', label: 'Inflation Calculator', Icon: Bot }, // No perfect icon, using Bot
        { value: 'finance', label: 'Finance Calculator', Icon: University },
        { value: 'income-tax', label: 'Income Tax Calculator', Icon: Briefcase },
        { value: 'compound-interest', label: 'Compound Interest Calculator', Icon: Calendar },
        { value: 'salary', label: 'Salary Calculator', Icon: Banknote },
        { value: 'interest-rate', label: 'Interest Rate Calculator', Icon: Receipt },
        { value: 'sales-tax', label: 'Sales Tax Calculator', Icon: Percent },
    ];
    
    const currencyList = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'ZAR'];

    const ActiveCalculator = useMemo(() => {
        const calculators: Record<string, React.FC<CalculatorProps>> = {
            'mortgage': MortgageCalculator,
            'loan': LoanCalculator,
            'auto-loan': AutoLoanCalculator,
            'interest': InterestCalculator,
            'payment': PaymentCalculator,
            'retirement': RetirementCalculator,
            'amortization': AmortizationCalculator,
            'investment': InvestmentCalculator,
            'inflation': InflationCalculator,
            'finance': FinanceCalculator,
            'income-tax': IncomeTaxCalculator,
            'compound-interest': CompoundInterestCalculator,
            'salary': SalaryCalculator,
            'interest-rate': InterestRateCalculator,
            'sales-tax': SalesTaxCalculator,
        };
        const Component = calculators[activeCalc];
        // This wrapper is important to ensure React treats it as a distinct component type
        return () => <Component currency={currency} />;
    }, [activeCalc, currency]);


    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-brand-primary">Financial Calculators</h2>
                <div className="flex gap-4 w-full sm:w-auto">
                    <CustomDropdown
                        items={calculatorList}
                        selectedValue={activeCalc}
                        onSelect={setActiveCalc}
                    />
                    <div className="w-32">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full h-12 px-3"
                        >
                            {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                <ActiveCalculator />
            </div>
        </div>
    );
};

export default FinancialCalculator;
