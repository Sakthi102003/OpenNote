import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    className?: string;
    showText?: boolean;
}

export function ThemeToggle({ className = '', showText = false }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or existing class
    const isDark = localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    if (isDark) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = (e: React.MouseEvent) => {
     e.preventDefault(); // In case it's inside a form or link
     const newDark = !isDarkMode;
     setIsDarkMode(newDark);
     
     if (newDark) {
         document.documentElement.classList.add('dark');
         localStorage.setItem('theme', 'dark');
     } else {
         document.documentElement.classList.remove('dark');
         localStorage.setItem('theme', 'light');
     }
  };

  return (
    <button 
        type="button"
        onClick={toggleDarkMode} 
        className={`flex items-center justify-center gap-2 p-2 text-sm font-medium text-stone-600 dark:text-gray-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 rounded-md transition-colors ${className}`}
        title="Toggle theme"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      {showText && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}
