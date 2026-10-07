"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
 const [isOpen, setIsOpen] = useState(false);
 const pathname = usePathname();

 // Hide site nav on full-screen tool pages that have their own appbar
 const FULLSCREEN_TOOLS = ['/tools/letterpad-generator'];
 const isFullscreen = FULLSCREEN_TOOLS.some(p => pathname === p || pathname.startsWith(p + '/'));
 if (isFullscreen) return null;

 return (
 <>
 <header className="fixed top-0 inset-x-0 z-50 bg-[#faf8f3]/80 dark:bg-[#0a0d13]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center h-20">
 {/* Logo */}
 <Link href="/" className="flex-shrink-0 flex items-center gap-3.5 cursor-pointer group">
 <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-slate-50 dark:group-hover:bg-white/[0.06] shadow-sm">
 {/* Glow effect matching brand colors */}
 <div className="absolute inset-0 bg-gradient-to-br from-brand-sky/20 to-brand-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
 <img 
 src="/icon-192.png" 
 alt="Swalekhani Logo" 
 className="w-6 h-6 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
 />
 </div>
 <span className="font-heading font-semibold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center">
 Swa<span className="text-slate-500 dark:text-white/70 font-light ml-0.5">lekhani</span>
 </span>
 </Link>

 {/* Desktop Nav */}
 <nav className="hidden md:flex items-center space-x-1.5 p-1.5 rounded-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
 <Link href="/tools/letterpad-generator" className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === "/tools/letterpad-generator" || pathname === "/" ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}>
 Studio
 </Link>
 <Link href="/templates" className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname.startsWith("/templates") ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}>
 Templates
 </Link>
 <Link href="/formats" className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname.startsWith("/formats") ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}>
 Formats
 </Link>
 <Link href="/about" className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === "/about" ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}>
 About
 </Link>
 </nav>

 <div className="flex items-center gap-2.5">
 <ThemeToggle />
 {/* Mobile Menu Toggle */}
 <div className="md:hidden">
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all backdrop-blur-md"
 >
 {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
 </button>
 </div>
 </div>
 </div>
 </div>
 </header>

 {/* Mobile Menu Overlay */}
 {isOpen && (
 <div className="fixed inset-0 z-40 bg-[#faf8f3]/98 dark:bg-[#0a0d13]/98 backdrop-blur-3xl pt-24 pb-6 px-6 md:hidden overflow-y-auto border-t border-slate-200 dark:border-white/10">
 <nav className="flex flex-col space-y-2 mt-4">
 <Link 
 href="/tools/letterpad-generator" 
 onClick={() => setIsOpen(false)} 
 className={`p-4 rounded-2xl text-xl font-medium transition-colors ${pathname === "/tools/letterpad-generator" || pathname === "/" ? "bg-slate-900/[0.04] dark:bg-white/[0.08] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5"}`}
 >
 Studio
 </Link>
 <Link 
 href="/templates" 
 onClick={() => setIsOpen(false)} 
 className={`p-4 rounded-2xl text-xl font-medium transition-colors ${pathname.startsWith("/templates") ? "bg-slate-900/[0.04] dark:bg-white/[0.08] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5"}`}
 >
 Templates
 </Link>
 <Link 
 href="/formats" 
 onClick={() => setIsOpen(false)} 
 className={`p-4 rounded-2xl text-xl font-medium transition-colors ${pathname.startsWith("/formats") ? "bg-slate-900/[0.04] dark:bg-white/[0.08] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5"}`}
 >
 Formats
 </Link>
 <Link 
 href="/about" 
 onClick={() => setIsOpen(false)} 
 className={`p-4 rounded-2xl text-xl font-medium transition-colors ${pathname === "/about" ? "bg-slate-900/[0.04] dark:bg-white/[0.08] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10" : "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5"}`}
 >
 About
 </Link>
 </nav>
 </div>
 )}
 </>
 );
}
