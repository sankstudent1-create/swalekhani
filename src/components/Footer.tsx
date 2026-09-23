"use client";
import Link from 'next/link';
import { Layers } from 'lucide-react';
export default function Footer() {

  return (
    <footer className="relative z-10 border-t border-white/[0.05] bg-white/[0.01] backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Layers className="text-white/30 w-5 h-5" />
          <span className="text-sm font-medium text-white/50">Swalekhani Official</span>
        </div>
        <div className="flex space-x-4 text-sm font-light text-white/30">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="text-sm font-light text-white/30">
          &copy;&nbsp;{new Date().getFullYear()}&nbsp;SW Info Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
