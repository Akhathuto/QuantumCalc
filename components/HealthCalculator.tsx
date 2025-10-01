import React, { useState, useMemo } from 'react';

type HealthCalcType = 'bmi' | 'bmr' | 'calorie';
type UnitSystem = 'metric' | 'imperial';

// Reusable UI Components specific to Health Calculator
const SubNavButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md font-semibold transition-colors ${isActive ? 'bg-brand-primary text-white' : 'bg-brand-surface hover:bg-brand-border'}`}
    >
        {label}
    </button>
);

const UnitToggleButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
     <button
        onClick={onClick}
        className={`px-3 py-1 text-sm rounded-full ${isActive ? 'bg-brand-accent text-white' : 'bg-brand-surface'}`}
    >
        {label}
    </button>
);

// Individual Calculator Implementations
const BMICalculator: React.FC<{ unitSystem: UnitSystem }> = ({ unitSystem }) => {
    const [weight, setWeight] = useState(unitSystem === 'metric' ? '70' : '155');
    const [heightCm, setHeightCm] = useState('175');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('9');

    const result = useMemo(() => {
        let weightKg = parseFloat(weight);
        let heightM: number;

        if (unitSystem === 'imperial') {
            const hFt = parseFloat(heightFt);
            const hIn = parseFloat(heightIn);
            if (isNaN(hFt) || isNaN(hIn)) return null;
            weightKg *= 0.453592; // lbs to kg
            heightM = (hFt * 12 + hIn) * 0.0254; // ft+in to m
        } else {
             const hCm = parseFloat(heightCm);
             if (isNaN(hCm)) return null;
             heightM = hCm / 100;
        }

        if (isNaN(weightKg) || isNaN(heightM) || heightM <= 0 || weightKg <= 0) return null;
        
        const bmi = weightKg / (heightM * heightM);

        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obesity';

        return { bmi: bmi.toFixed(1), category };
    }, [unitSystem, weight, heightCm, heightFt, heightIn]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                {unitSystem === 'metric' ? (
                     <div>
                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                        <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Height (ft)</label>
                            <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">(in)</label>
                            <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
            {result && (
                <div className="mt-6 text-center bg-brand-bg p-4 rounded-lg">
                    <p className="text-brand-text-secondary">Your BMI is</p>
                    <p className="text-4xl font-bold text-brand-accent my-2">{result.bmi}</p>
                    <p className="font-semibold">{result.category}</p>
                </div>
            )}
        </div>
    );
};

const BMRCalculator: React.FC<{ unitSystem: UnitSystem, onBmrResult: (bmr: number) => void }> = ({ unitSystem, onBmrResult }) => {
    const [age, setAge] = useState('30');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [weight, setWeight] = useState(unitSystem === 'metric' ? '70' : '155');
    const [heightCm, setHeightCm] = useState('175');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('9');

    const result = useMemo(() => {
        let weightKg = parseFloat(weight);
        let hCm = parseFloat(heightCm);
        const ageNum = parseInt(age);
        if (isNaN(ageNum)) return null;

        if (unitSystem === 'imperial') {
            const hFt = parseFloat(heightFt);
            const hIn = parseFloat(heightIn);
            if (isNaN(hFt) || isNaN(hIn)) return null;
            weightKg *= 0.453592; // lbs to kg
            hCm = (hFt * 12 + hIn) * 2.54; // ft+in to cm
        }
        
        if (isNaN(weightKg) || isNaN(hCm) || weightKg <= 0 || hCm <= 0 || ageNum <= 0) return null;

        // Mifflin-St Jeor Equation
        let bmr: number;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * hCm - 5 * ageNum + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * hCm - 5 * ageNum - 161;
        }
        onBmrResult(bmr);
        return { bmr: Math.round(bmr) };

    }, [unitSystem, age, gender, weight, heightCm, heightFt, heightIn, onBmrResult]);

    return (
         <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value as any)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                {unitSystem === 'metric' ? (
                     <div>
                        <label className="block text-sm font-medium mb-1">Height (cm)</label>
                        <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Height (ft)</label>
                            <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">(in)</label>
                            <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
             {result && (
                <div className="mt-6 text-center bg-brand-bg p-4 rounded-lg">
                    <p className="text-brand-text-secondary">Your Basal Metabolic Rate is</p>
                    <p className="text-4xl font-bold text-brand-accent my-2">{result.bmr.toLocaleString()}</p>
                    <p>calories per day</p>
                </div>
            )}
        </div>
    );
};

const activityLevels = [
    { label: "Sedentary (little or no exercise)", value: 1.2 },
    { label: "Lightly active (light exercise/sports 1-3 days/week)", value: 1.375 },
    { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: 1.55 },
    { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
    { label: "Extra active (very hard exercise/physical job)", value: 1.9 },
];

const CalorieCalculator: React.FC<{ bmr: number | null }> = ({ bmr }) => {
    const [activity, setActivity] = useState(activityLevels[1].value);

    const result = useMemo(() => {
        if (!bmr) return null;
        const maintenance = Math.round(bmr * activity);
        return {
            maintenance,
            mildLoss: maintenance - 250,
            loss: maintenance - 500,
            mildGain: maintenance + 250,
            gain: maintenance + 500,
        }
    }, [bmr, activity]);

    if (!bmr) {
        return <div className="text-center text-brand-text-secondary p-8">Calculate your BMR first to see daily calorie needs.</div>
    }

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Activity Level</label>
            <select value={activity} onChange={e => setActivity(parseFloat(e.target.value))} className="mb-6">
                {activityLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
            </select>
            {result && (
                <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-brand-bg rounded-md">
                        <span className="font-semibold">Maintenance</span>
                        <span className="font-bold text-brand-accent">{result.maintenance.toLocaleString()} calories/day</span>
                    </div>
                     <div className="flex justify-between p-3 bg-brand-bg rounded-md">
                        <span className="font-semibold">Mild Weight Loss (0.25 kg/week)</span>
                        <span className="font-bold text-brand-accent">{result.mildLoss.toLocaleString()} calories/day</span>
                    </div>
                     <div className="flex justify-between p-3 bg-brand-bg rounded-md">
                        <span className="font-semibold">Weight Loss (0.5 kg/week)</span>
                        <span className="font-bold text-brand-accent">{result.loss.toLocaleString()} calories/day</span>
                    </div>
                     <div className="flex justify-between p-3 bg-brand-bg rounded-md">
                        <span className="font-semibold">Mild Weight Gain (0.25 kg/week)</span>
                        <span className="font-bold text-brand-accent">{result.mildGain.toLocaleString()} calories/day</span>
                    </div>
                     <div className="flex justify-between p-3 bg-brand-bg rounded-md">
                        <span className="font-semibold">Weight Gain (0.5 kg/week)</span>
                        <span className="font-bold text-brand-accent">{result.gain.toLocaleString()} calories/day</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const HealthCalculator: React.FC = () => {
    const [activeCalc, setActiveCalc] = useState<HealthCalcType>('bmi');
    const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
    const [bmrResult, setBmrResult] = useState<number | null>(null);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">Health & Fitness Calculators</h2>
            
            <div className="flex justify-center gap-2 mb-6">
                <SubNavButton label="BMI" isActive={activeCalc === 'bmi'} onClick={() => setActiveCalc('bmi')} />
                <SubNavButton label="BMR" isActive={activeCalc === 'bmr'} onClick={() => setActiveCalc('bmr')} />
                <SubNavButton label="Daily Calories" isActive={activeCalc === 'calorie'} onClick={() => setActiveCalc('calorie')} />
            </div>

            <div className="bg-brand-surface/50 p-6 rounded-lg">
                <div className="flex justify-end mb-4">
                    <div className="flex items-center gap-2 p-1 bg-brand-bg rounded-full">
                       <UnitToggleButton label="Metric" isActive={unitSystem === 'metric'} onClick={() => setUnitSystem('metric')} />
                       <UnitToggleButton label="Imperial" isActive={unitSystem === 'imperial'} onClick={() => setUnitSystem('imperial')} />
                    </div>
                </div>

                {activeCalc === 'bmi' && <BMICalculator unitSystem={unitSystem} />}
                {activeCalc === 'bmr' && <BMRCalculator unitSystem={unitSystem} onBmrResult={setBmrResult} />}
                {activeCalc === 'calorie' && <CalorieCalculator bmr={bmrResult} />}
            </div>
        </div>
    );
};

export default HealthCalculator;
