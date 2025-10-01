import React, { useState, useEffect } from 'react';
import { KeyRound, Sun, Moon } from 'lucide-react';

const Settings: React.FC = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'light') return 'light';
            if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        }
        return 'dark';
    });
    
    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">Settings</h2>
            <div className="bg-brand-surface/50 p-6 rounded-lg max-w-2xl mx-auto space-y-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-brand-text-secondary">Toggle between light and dark mode.</p>
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-brand-bg hover:bg-brand-border transition-colors">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </div>

                <div className="border-t border-brand-border pt-8">
                    <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
                        <KeyRound /> Google Gemini API Key
                    </h3>
                    <p className="text-brand-text-secondary text-sm">
                        The Gemini API key for AI-powered features like the Formula Explorer is configured by the application administrator.
                    </p>
                    <p className="text-xs text-brand-text-secondary mt-3">
                        This is managed via an environment variable to ensure security and proper functionality.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
