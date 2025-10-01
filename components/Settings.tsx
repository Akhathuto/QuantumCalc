
import React, { useState, useEffect } from 'react';
import { KeyRound, Save, Trash2, CheckCircle, Moon, Sun } from 'lucide-react';

const Settings: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [isKeySet, setIsKeySet] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Effect for API Key
    useEffect(() => {
        try {
            const storedKey = localStorage.getItem('geminiApiKey');
            if (storedKey) {
                setApiKey(storedKey);
                setIsKeySet(true);
            }
        } catch (error) {
            console.error("Failed to read API key from localStorage:", error);
        }
    }, []);

    // Effect for Theme
    useEffect(() => {
        const root = window.document.documentElement;
        setIsDarkMode(!root.classList.contains('light'));
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleSave = () => {
        try {
            if (apiKey.trim()) {
                localStorage.setItem('geminiApiKey', apiKey.trim());
                setIsKeySet(true);
                showToast('API Key saved successfully!');
            } else {
                handleClear();
            }
        } catch (error) {
            console.error("Failed to save API key to localStorage:", error);
            showToast('Error: Could not save API key.');
        }
    };

    const handleClear = () => {
        try {
            localStorage.removeItem('geminiApiKey');
            setApiKey('');
            setIsKeySet(false);
            showToast('API Key cleared.');
        } catch (error) {
            console.error("Failed to remove API key from localStorage:", error);
            showToast('Error: Could not clear API key.');
        }
    };

    const handleThemeToggle = () => {
        const root = window.document.documentElement;
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        if (newIsDarkMode) {
            root.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">Settings</h2>
            <div className="bg-brand-surface/50 p-6 rounded-lg max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
                    <KeyRound /> Google Gemini API Key
                </h3>
                <p className="text-brand-text-secondary mb-4 text-sm">
                    To use AI-powered features like the Formula Explorer and Currency Analysis, you need a Google Gemini API key. You can get a free key from{' '}
                    <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        Google AI Studio
                    </a>.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <div className="relative flex-grow w-full">
                         <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key here"
                            className="w-full bg-brand-bg border border-brand-border rounded-md p-3 pr-10 font-mono focus:ring-brand-primary focus:border-brand-primary"
                         />
                         {isKeySet && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />}
                    </div>
                   
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-500 text-white rounded-md font-semibold transition-colors">
                            <Save size={18} /> Save
                        </button>
                        <button onClick={handleClear} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-md font-semibold transition-colors">
                            <Trash2 size={18} /> Clear
                        </button>
                    </div>
                </div>

                 <p className="text-xs text-brand-text-secondary mt-3">
                    Your API key is stored locally in your browser and is never sent to our servers.
                </p>
            </div>
            
            <div className="bg-brand-surface/50 p-6 rounded-lg max-w-2xl mx-auto mt-8">
                <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
                    <Sun /> Appearance
                </h3>
                 <div className="flex justify-between items-center">
                    <p className="text-brand-text-secondary text-sm">
                        Manually switch between light and dark themes. This will override your system setting.
                    </p>
                    <button
                        onClick={handleThemeToggle}
                        className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary ${
                            isDarkMode ? 'bg-brand-primary' : 'bg-gray-400'
                        }`}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                        <span className="sr-only">Theme toggle</span>
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                                isDarkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                        <Sun className={`absolute left-1.5 h-4 w-4 text-yellow-300 transition-opacity ${isDarkMode ? 'opacity-0' : 'opacity-100'}`} />
                        <Moon className={`absolute right-1.5 h-4 w-4 text-white transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                </div>
            </div>

            {toastMessage && <div className="fixed bottom-6 right-6 bg-brand-accent text-white px-5 py-3 rounded-lg shadow-2xl z-50 animate-fade-in-down">{toastMessage}</div>}
        </div>
    );
};

export default Settings;
