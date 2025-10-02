
import React, { useState, useEffect } from 'react';
import { Save, Moon, Sun, KeyRound } from 'lucide-react';

const Settings: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Effect for API Key
    useEffect(() => {
        try {
            const savedKey = localStorage.getItem('geminiApiKey');
            if (savedKey) {
                setApiKey(savedKey);
            }
        } catch (error) {
            console.error("Could not read API key from localStorage", error);
        }
    }, []);

    // Effect for Theme
    useEffect(() => {
        // Check for saved theme in localStorage, fallback to system preference
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setIsDarkMode(savedTheme === 'dark');
            } else {
                setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        } catch (error) {
            console.error("Could not access theme from localStorage", error);
            setIsDarkMode(true); // Default to dark mode
        }
    }, []);
    
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleSaveSettings = () => {
        try {
            if (apiKey) {
                localStorage.setItem('geminiApiKey', apiKey);
            } else {
                localStorage.removeItem('geminiApiKey');
            }
            showToast("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings to localStorage:", error);
            showToast("Error: Could not save settings.");
        }
    };

    const handleThemeToggle = () => {
        const root = window.document.documentElement;
        const newIsDarkMode = !isDarkMode;
        setIsDarkMode(newIsDarkMode);
        try {
            if (newIsDarkMode) {
                root.classList.remove('light');
                localStorage.setItem('theme', 'dark');
            } else {
                root.classList.add('light');
                localStorage.setItem('theme', 'light');
            }
        } catch (error) {
            console.error("Failed to save theme to localStorage:", error);
            showToast("Could not save theme preference.");
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">Settings</h2>
            
             <div className="bg-brand-surface/50 p-6 rounded-lg max-w-2xl mx-auto space-y-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
                        <KeyRound /> Gemini API Key
                    </h3>
                    <p className="text-brand-text-secondary text-sm mb-3">
                        To use AI features like the Formula Explorer, enter your Google Gemini API key. Your key is stored only in your browser.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API Key"
                            className="flex-grow w-full bg-brand-bg border border-brand-border rounded-md p-2 font-mono"
                        />
                        <button
                            onClick={handleSaveSettings}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-500 text-white rounded-md font-semibold transition-colors"
                        >
                            <Save size={18} /> Save Key
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
                        <Sun /> Appearance
                    </h3>
                     <div className="flex justify-between items-center">
                        <p className="text-brand-text-secondary text-sm max-w-md">
                            Manually switch between light and dark themes. This will override your system setting.
                        </p>
                        <button
                            onClick={handleThemeToggle}
                            role="switch"
                            aria-checked={isDarkMode}
                            aria-label="Theme toggle"
                            className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary ${
                                isDarkMode ? 'bg-brand-primary' : 'bg-gray-400'
                            }`}
                        >
                            <span className="sr-only">Switch to {isDarkMode ? 'light' : 'dark'} mode</span>
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                            <Sun className={`absolute left-1.5 h-4 w-4 text-yellow-300 transition-opacity ${!isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                            <Moon className={`absolute right-1.5 h-4 w-4 text-white transition-opacity ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {toastMessage && <div className="fixed bottom-6 right-6 bg-brand-accent text-white px-5 py-3 rounded-lg shadow-2xl z-50 animate-fade-in-down">{toastMessage}</div>}
        </div>
    );
};

export default Settings;