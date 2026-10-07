"use client";
import Link from 'next/link';
import { Layers } from 'lucide-react';
export default function Footer() {

 return (
 <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white/[0.01] dark:bg-[#0f131d]/[0.01] backdrop-blur-lg">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
 <div className="flex items-center gap-2">
 <Layers className="text-slate-400 dark:text-white/40 w-5 h-5" />
 <span className="text-sm font-medium text-slate-500 dark:text-white/60">Swalekhani Official</span>
 </div>
 <div className="flex space-x-4 text-sm font-light text-slate-400 dark:text-white/40">
 <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
 <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
 <Link href="/disclaimer" className="hover:text-slate-900 dark:hover:text-white transition-colors">Disclaimer</Link>
 <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
 </div>
 <div className="text-sm font-light text-slate-400 dark:text-white/40">
 {'© '}{new Date().getFullYear()}{' Swalekhani by SW InfoSystems. All rights reserved.'}
 </div>
 </div>
 </footer>
 );
}
