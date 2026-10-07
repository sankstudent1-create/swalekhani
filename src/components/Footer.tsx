"use client";
import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <p className="font-heading font-bold text-[15px] text-slate-900 dark:text-white leading-tight">Swalekhani</p>
              <p className="text-[11px] text-slate-600 dark:text-white/50">AI letterpad studio</p>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm font-medium">
            {[
              { href: '/templates', label: 'Templates' },
              { href: '/formats', label: 'Formats' },
              { href: '/tools/letterpad-generator', label: 'Studio' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-6 text-[13px] font-medium">
            <Link href="/privacy" className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/disclaimer" className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 text-center">
          <p className="text-xs text-slate-600 dark:text-white/50">
            © {new Date().getFullYear()} Swalekhani by SW InfoSystems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
