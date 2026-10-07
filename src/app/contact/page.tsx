import React from 'react';
import type { Metadata } from 'next';
import { Mail, MessageSquare, Globe } from 'lucide-react';

export const metadata: Metadata = {
 title: 'Contact Us',
 description: 'Get in touch with the Swalekhani team for support, feature requests, and enterprise inquiries.',
 alternates: {
 canonical: '/contact',
 },
};

export default function ContactPage() {
 return (
 <div className="min-h-screen bg-[#faf8f3] dark:bg-[#0a0d13] text-slate-900 dark:text-white font-sans py-20 px-6">
 <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10">
 <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400 text-center">
 Contact Us
 </h1>
 <p className="text-center text-slate-600 dark:text-white/60 mb-12 text-lg">
 Have questions or suggestions? We'd love to hear from you.
 </p>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
 <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
 <Mail className="text-indigo-400 w-6 h-6" />
 </div>
 <h3 className="font-semibold mb-2">Email</h3>
 <p className="text-sm text-slate-600 dark:text-white/60">support@swinfosystems.com</p>
 </div>
 
 <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
 <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
 <MessageSquare className="text-fuchsia-400 w-6 h-6" />
 </div>
 <h3 className="font-semibold mb-2">Support</h3>
 <p className="text-sm text-slate-600 dark:text-white/60">Available 24/7</p>
 </div>
 
 <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-center hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
 <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
 <Globe className="text-cyan-400 w-6 h-6" />
 </div>
 <h3 className="font-semibold mb-2">Website</h3>
 <p className="text-sm text-slate-600 dark:text-white/60">www.swinfosystems.com</p>
 </div>
 </div>
 
 {/* Support details — what we help with */}
 <div className="mt-12 p-8 bg-white/[0.03] dark:bg-[#0f131d]/[0.03] rounded-2xl border border-white/[0.07] text-left">
 <h2 className="text-2xl font-semibold mb-6 text-center">How we can help</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
 <div>
 <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Template requests</h3>
 <p className="text-slate-600 dark:text-white/60">
 Need a letterpad format for a profession, department, or use-case we don&apos;t cover yet?
 Write to <a href="mailto:support@swinfosystems.com" className="text-slate-700 dark:text-white/80 underline decoration-slate-300 dark:decoration-white/25 underline-offset-2 hover:text-slate-900 dark:hover:text-white ">support@swinfosystems.com</a> with
 the exact header details and we&apos;ll prioritise it in our template roadmap.
 </p>
 </div>
 <div>
 <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Bug reports &amp; printing issues</h3>
 <p className="text-slate-600 dark:text-white/60">
 If a PDF export misaligns, a font doesn&apos;t render, or the studio misbehaves on your device,
 include your browser, device, and a screenshot. Most rendering issues are fixed within a week.
 </p>
 </div>
 <div>
 <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Response time</h3>
 <p className="text-slate-600 dark:text-white/60">
 We reply to every genuine support email within <strong className="text-slate-600 dark:text-white/70">2 business days</strong>.
 For quick questions, the FAQ sections on our template pages usually have the answer already.
 </p>
 </div>
 <div>
 <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Who we are</h3>
 <p className="text-slate-600 dark:text-white/60">
 Swalekhani is built and maintained by <strong className="text-slate-600 dark:text-white/70">SW InfoSystems (Sanket Wanve Technologies)</strong>,
 an independent Indian software studio crafting practical tools for education, operations, and publishing workflows.
 </p>
 </div>
 </div>
 </div>

 <div className="mt-16 p-8 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
 <h2 className="text-2xl font-semibold mb-4">Connect with us</h2>
 <p className="text-slate-600 dark:text-white/60 mb-6">For business inquiries and collaboration, reach out via our official channels.</p>
 <a 
 href="mailto:support@swinfosystems.com" 
 className="inline-flex items-center px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
 >
 Send an Email
 </a>
 </div>
 </div>
 </div>
 );
}
