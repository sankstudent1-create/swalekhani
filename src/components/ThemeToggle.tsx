'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'swalekhani-theme';

export function getInitialTheme(): 'light' | 'dark' {
 if (typeof window === 'undefined') return 'light';
 const stored = window.localStorage.getItem(STORAGE_KEY);
 if (stored === 'light' || stored === 'dark') return stored;
 return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: 'light' | 'dark') {
 const root = document.documentElement;
 root.classList.toggle('dark', theme === 'dark');
 root.style.colorScheme = theme;
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
 const [theme, setTheme] = useState<'light' | 'dark'>('light');
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 const t = getInitialTheme();
 setTheme(t);
 applyTheme(t);
 setMounted(true);
 }, []);

 const toggle = () => {
 const next = theme === 'dark' ? 'light' : 'dark';
 setTheme(next);
 window.localStorage.setItem(STORAGE_KEY, next);
 applyTheme(next);
 };

 return (
 <button
 type="button"
 onClick={toggle}
 aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
 title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
 className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all ${className}`}
 >
 {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
 </button>
 );
}
