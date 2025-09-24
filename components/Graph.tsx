import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, ScatterChart, Scatter, BarChart, Bar
} from 'recharts';
import { create, all } from 'mathjs';
import { AlertTriangle } from 'lucide-react';

const math = create(all);

// --- Reusable UI ---
const SubNavButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm sm:text-base ${isActive ? 'bg-brand-primary text-white' : 'bg-brand-surface hover:bg-brand-border'}`}
    >
        {label}
    </button>
);

const Input = ({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, id: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
        <input id={id} {...props} className="w-full bg-gray-900/70 border-gray-600 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary" />
    </div>
);

const TextArea = ({ label, id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, id: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
        <textarea id={id} {...props} rows={5} className="w-full bg-gray-900/70 border-gray-600 rounded-md p-2 font-mono focus:ring-brand-primary focus:border-brand-primary" />
    </div>
);

const ErrorDisplay: React.FC<{ error: string | null }> = ({ error }) => {
    if (!error) return null;
    return (
        <div className="flex items-center gap-2 text-red-400 p-3 bg-red-900/50 rounded-md mb-4">
            <AlertTriangle size={20} />
            <span>{error}</span>
        </div>
    );
};


// --- Chart Components ---

const FunctionPlotter: React.FC = () => {
    const [expression, setExpression] = useState('x^2');
    const [xMin, setXMin] = useState('-10');
    const [xMax, setXMax] = useState('10');

    const { data, error } = useMemo(() => {
        const min = parseFloat(xMin);
        const max = parseFloat(xMax);

        if (isNaN(min) || isNaN(max)) return { data: [], error: "X Min and X Max must be valid numbers."};
        if (min >= max) return { data: [], error: "X Max must be greater than X Min." };
        if (!expression.trim()) return { data: [], error: "Please enter a function." };

        try {
            const node = math.parse(expression);
            const code = node.compile();
            const points = [];
            const step = (max - min) / 200;

            for (let x = min; x <= max; x += step) {
                try {
                    const y = code.evaluate({ x });
                    if (typeof y === 'number' && isFinite(y)) {
                        points.push({ x: parseFloat(x.toPrecision(4)), y });
                    }
                } catch (e) { /* Skip points where function is undefined */ }
            }
            return { data: points, error: null };
        } catch (e: any) {
             return { data: [], error: e.message || 'Invalid function. Use "x" as the variable.' };
        }
    }, [xMin, xMax, expression]);

    return (
        <div className="bg-brand-surface/50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                <div className="md:col-span-2">
                    <Input id="function_expr" label="Function y = f(x)" type="text" value={expression} onChange={e => setExpression(e.target.value)} placeholder="e.g., sin(x)" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Input id="function_xmin" label="X Min" type="text" value={xMin} onChange={e => setXMin(e.target.value)} />
                    <Input id="function_xmax" label="X Max" type="text" value={xMax} onChange={e => setXMax(e.target.value)} />
                </div>
            </div>
            <ErrorDisplay error={error} />
            <div className="h-96 w-full mt-4">
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis type="number" dataKey="x" domain={['dataMin', 'dataMax']} stroke="var(--color-text-secondary)" />
                        <YAxis stroke="var(--color-text-secondary)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="y" stroke="var(--color-primary)" strokeWidth={2} dot={false} name={`y = ${expression}`} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const ScatterPlotter: React.FC = () => {
    const [dataStr, setDataStr] = useState('1, 5\n2, 8\n3, 6\n4, 9\n5, 7');
    const [title, setTitle] = useState('Sample Scatter Plot');
    const [xLabel, setXLabel] = useState('X-Axis');
    const [yLabel, setYLabel] = useState('Y-Axis');
    
    const { data, error } = useMemo(() => {
        if (!dataStr.trim()) return { data: [], error: "Please enter data." };
        const points = [];
        const lines = dataStr.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split(/[,;\s]+/).filter(Boolean);
            if (parts.length !== 2) return { data: [], error: `Invalid format on line ${i + 1}. Use 'X, Y'.` };
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            if (isNaN(x) || isNaN(y)) return { data: [], error: `Invalid number on line ${i + 1}.` };
            points.push({ x, y });
        }
        return { data: points, error: null };
    }, [dataStr]);

    return (
        <div className="bg-brand-surface/50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input id="scatter_title" label="Chart Title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <TextArea id="scatter_data" label="Data (X,Y per line)" value={dataStr} onChange={e => setDataStr(e.target.value)} />
                <Input id="scatter_xlabel" label="X-Axis Label" type="text" value={xLabel} onChange={e => setXLabel(e.target.value)} />
                <Input id="scatter_ylabel" label="Y-Axis Label" type="text" value={yLabel} onChange={e => setYLabel(e.target.value)} />
            </div>
            <ErrorDisplay error={error} />
            <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
            <div className="h-96 w-full mt-4">
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="var(--color-border)" />
                        <XAxis type="number" dataKey="x" name={xLabel} label={{ value: xLabel, position: 'insideBottom', offset: -15 }} stroke="var(--color-text-secondary)" />
                        <YAxis type="number" dataKey="y" name={yLabel} label={{ value: yLabel, angle: -90, position: 'insideLeft' }} stroke="var(--color-text-secondary)" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} />
                        <Scatter name="Data Points" data={data} fill="var(--color-primary)" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const BarChartCreator: React.FC = () => {
    const [dataStr, setDataStr] = useState('Mice, 25\nZebra, 42\nLion, 12\nElephant, 8');
    const [title, setTitle] = useState('Animal Population');
    const [xLabel, setXLabel] = useState('Animal');
    const [yLabel, setYLabel] = useState('Population');
    
    const { data, error } = useMemo(() => {
        if (!dataStr.trim()) return { data: [], error: "Please enter data." };
        const points = [];
        const lines = dataStr.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length !== 2) return { data: [], error: `Invalid format on line ${i + 1}. Use 'Label,Value'.` };
            const name = parts[0].trim();
            const value = parseFloat(parts[1]);
            if (!name) return { data: [], error: `Missing label on line ${i+1}.` };
            if (isNaN(value)) return { data: [], error: `Invalid number on line ${i + 1}.` };
            points.push({ name, value });
        }
        return { data: points, error: null };
    }, [dataStr]);

    return (
        <div className="bg-brand-surface/50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input id="bar_title" label="Chart Title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <TextArea id="bar_data" label="Data (Label,Value per line)" value={dataStr} onChange={e => setDataStr(e.target.value)} />
                <Input id="bar_xlabel" label="X-Axis Label" type="text" value={xLabel} onChange={e => setXLabel(e.target.value)} />
                <Input id="bar_ylabel" label="Y-Axis Label" type="text" value={yLabel} onChange={e => setYLabel(e.target.value)} />
            </div>
            <ErrorDisplay error={error} />
            <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
            <div className="h-96 w-full mt-4">
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid stroke="var(--color-border)" />
                        <XAxis dataKey="name" name={xLabel} label={{ value: xLabel, position: 'insideBottom', offset: -15 }} stroke="var(--color-text-secondary)" />
                        <YAxis name={yLabel} label={{ value: yLabel, angle: -90, position: 'insideLeft' }} stroke="var(--color-text-secondary)" />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} />
                        <Legend />
                        <Bar dataKey="value" fill="var(--color-accent)" name={yLabel} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const PieChartCreator: React.FC = () => {
    const [dataStr, setDataStr] = useState('Marketing, 50\nSales, 120\nDevelopment, 90\nSupport, 75');
    const [title, setTitle] = useState('Department Budget Allocation');
    
    const { data, error } = useMemo(() => {
        if (!dataStr.trim()) return { data: [], error: "Please enter data." };
        const parsedData = dataStr.split('\n').map((line, index) => {
            const parts = line.split(',');
            if (parts.length !== 2) return { error: `Invalid format on line ${index + 1}. Use 'Label,Value'.` };
            const name = parts[0].trim();
            const value = parseFloat(parts[1].trim());
            if (!name) return { error: `Missing label on line ${index + 1}.` };
            if (isNaN(value)) return { error: `Invalid number value for '${name}' on line ${index + 1}.` };
            return { name, value };
        });

        const firstError = parsedData.find(d => 'error' in d);
        if (firstError && 'error' in firstError) return { data: [], error: firstError.error };

        return { data: parsedData as {name: string, value: number}[], error: null };
    }, [dataStr]);
    
    const COLORS = ['#4299e1', '#ed8936', '#48bb78', '#9f7aea', '#f56565', '#4fd1c5'];

    return (
        <div className="bg-brand-surface/50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input id="pie_title" label="Chart Title" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <TextArea id="pie_data" label="Data (Label,Value per line)" value={dataStr} onChange={e => setDataStr(e.target.value)} />
            </div>
            <ErrorDisplay error={error} />
            <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
            <div className="h-96 w-full">
                 <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} />
                        <Legend />
                    </PieChart>
                 </ResponsiveContainer>
             </div>
        </div>
    );
};

// --- Main Graphing Component ---
const Graph: React.FC = () => {
    type ChartType = 'function' | 'scatter' | 'bar' | 'pie';
    const [chartType, setChartType] = useState<ChartType>('function');
    
    const renderChart = () => {
        switch(chartType) {
            case 'function': return <FunctionPlotter />;
            case 'scatter': return <ScatterPlotter />;
            case 'bar': return <BarChartCreator />;
            case 'pie': return <PieChartCreator />;
            default: return null;
        }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">Graphing & Charting Suite</h2>
             <div className="flex justify-center flex-wrap gap-2 mb-6">
                <SubNavButton label="Function Plot" isActive={chartType === 'function'} onClick={() => setChartType('function')} />
                <SubNavButton label="Scatter Plot" isActive={chartType === 'scatter'} onClick={() => setChartType('scatter')} />
                <SubNavButton label="Bar Chart" isActive={chartType === 'bar'} onClick={() => setChartType('bar')} />
                <SubNavButton label="Pie Chart" isActive={chartType === 'pie'} onClick={() => setChartType('pie')} />
            </div>
            {renderChart()}
        </div>
    );
};

export default Graph;