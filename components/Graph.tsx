
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { create, all } from 'mathjs';
import { AlertTriangle } from 'lucide-react';

const math = create(all);

interface DataPoint {
  x: number;
  y: number | null;
}

const Graph: React.FC = () => {
    // FIX: Use string state for inputs to allow for better control over user input (e.g., typing '-')
    const [expression, setExpression] = useState('x^2');
    const [xMin, setXMin] = useState('-10');
    const [xMax, setXMax] = useState('10');
    const [error, setError] = useState<string | null>(null);

    // FIX: Memoize parsed numbers for efficiency
    const parsedDomain = useMemo(() => {
        return {
            min: parseFloat(xMin),
            max: parseFloat(xMax),
        };
    }, [xMin, xMax]);

    const data = useMemo<DataPoint[]>(() => {
        setError(null);
        if (!expression.trim()) {
            return [];
        }

        const { min: xMinNum, max: xMaxNum } = parsedDomain;

        if (isNaN(xMinNum) || isNaN(xMaxNum)) {
            return []; // Silently return empty data if inputs are not valid numbers (e.g., during typing)
        }

        // FIX: Add validation to prevent infinite loops (xMin === xMax) and handle invalid ranges.
        if (xMinNum >= xMaxNum) {
            setError("X Max must be greater than X Min.");
            return [];
        }

        try {
            const node = math.parse(expression);
            const code = node.compile();
            const points: DataPoint[] = [];
            const step = (xMaxNum - xMinNum) / 200; // 201 points

            for (let x = xMinNum; x <= xMaxNum; x += step) {
                try {
                    const y = code.evaluate({ x: x });
                    if (typeof y === 'number' && isFinite(y)) {
                        points.push({ x: parseFloat(x.toPrecision(4)), y });
                    } else {
                         points.push({ x: parseFloat(x.toPrecision(4)), y: null });
                    }
                } catch (e) {
                    // This can happen for things like sqrt(-1), log(0), etc.
                    // We'll just skip the point.
                    points.push({ x: parseFloat(x.toPrecision(4)), y: null });
                }
            }
            return points;
        } catch (e: any) {
            setError(e.message || 'Invalid function. Use "x" as the variable.');
            return [];
        }
    }, [expression, parsedDomain]);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">Graphing Calculator</h2>
            
            <div className="bg-brand-surface/50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="function-input" className="block text-sm font-medium text-brand-text-secondary mb-1">
                           Function y = f(x)
                        </label>
                        <input
                            id="function-input"
                            type="text"
                            value={expression}
                            onChange={e => setExpression(e.target.value)}
                            className="w-full bg-gray-900/70 border-gray-600 rounded-md p-2 font-mono focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="e.g., sin(x)"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label htmlFor="xmin-input" className="block text-sm font-medium text-brand-text-secondary mb-1">X Min</label>
                             <input
                                id="xmin-input"
                                type="text"
                                value={xMin}
                                onChange={e => setXMin(e.target.value)}
                                className="w-full bg-gray-900/70 border-gray-600 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="xmax-input" className="block text-sm font-medium text-brand-text-secondary mb-1">X Max</label>
                             <input
                                id="xmax-input"
                                type="text"
                                value={xMax}
                                onChange={e => setXMax(e.target.value)}
                                className="w-full bg-gray-900/70 border-gray-600 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-400 p-3 bg-red-900/50 rounded-md mb-4">
                        <AlertTriangle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="h-96 w-full mt-4">
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis 
                                dataKey="x" 
                                type="number" 
                                domain={[parsedDomain.min, parsedDomain.max]} 
                                allowDataOverflow={true}
                                stroke="#A0AEC0"
                            />
                            <YAxis allowDataOverflow={true} stroke="#A0AEC0" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(26, 32, 44, 0.8)',
                                    borderColor: '#4A5568'
                                }}
                                labelStyle={{ color: '#E2E8F0' }}
                                itemStyle={{ color: '#63B3ED' }}
                            />
                            <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                            <Line
                                type="monotone"
                                dataKey="y"
                                stroke="#63B3ED"
                                strokeWidth={2}
                                dot={false}
                                connectNulls={false}
                                name={`y = ${expression}`}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Graph;
