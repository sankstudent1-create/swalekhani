import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight, CheckCircle2, UserCheck, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
 title: 'Leave Application Format | Corporate HR & Office Leave Letter Maker',
 description: 'Download and generate Leave Application Formats online. Standard formats for Casual Leave (CL), Earned Leave (EL), Medical Leave, Maternity Leave, and Sick Leave for corporate staff and professionals.',
 keywords: [
 'leave application format',
 'leave application format for office employees',
 'casual leave application format in english',
 'earned leave application format for employees',
 'medical leave application letter',
 'office leave application format'
 ],
 alternates: {
 canonical: '/formats/leave-application',
 },
 openGraph: {
 title: 'Leave Application Format | Corporate HR & Office Leave Letter Maker',
 description: 'Create standard Casual Leave, Earned Leave, and Medical Leave applications for corporate and private offices.',
 url: 'https://swalekhani.vercel.app/formats/leave-application',
 images: ['/og/leave-application.svg'],
 type: 'article',
 },
 twitter: {
 card: 'summary_large_image',
 title: 'Leave Application Format | Corporate HR & Office Leave Letter Maker',
 description: 'Leave application letter generator with charge handover and AI drafting.',
 images: ['/og/leave-application.svg'],
 },
};

const FAQ_ITEMS: FaqItem[] = [
 {
 question: "What are the essential details required in a professional leave application?",
 answer: "A professional leave application should specify the exact category of leave (Casual Leave, Earned Leave, Sick Leave), exact dates from and to, reason for leave, contact address during leave, and the name of the colleague taking charge of your duties."
 },
 {
 question: "How is Casual Leave (CL) different from Earned Leave (EL)?",
 answer: "Casual Leave (CL) is granted for unexpected personal emergencies and does not deduct from your earned leave account (it lapses at the end of the calendar year). Earned Leave (EL) is credited based on service periods (usually 30 days per year in two installments) and requires advance administrative sanction."
 },
 {
 question: "What is Station Leave Permission and when is it required?",
 answer: "Some organisations require employees to inform their manager when travelling out of station during leave. Check your company HR policy — mentioning your travel plans and a reachable contact address is good practice."
 },
 {
 question: "Can medical certificates be referenced or attached in this format?",
 answer: "Yes, Swalekhani's leave format includes dedicated Annexure & Enclosure lines to list medical certificates, fitness certificates, and leave account slips."
 },
 {
 question: "What is Prefix and Suffix of holidays in leave calculations?",
 answer: "Prefix refers to holidays/Sundays immediately preceding the commencement of leave, while Suffix refers to holidays/Sundays immediately following the end of leave. How prefix/suffix days are counted differs by company leave policy — check your HR handbook."
 },
 {
 question: "What is Commuted Leave and how does it affect Half Pay Leave (HPL)?",
 answer: "Commuted Leave is leave granted on medical certificate where twice the amount of Half Pay Leave (HPL) is debited against the employee's leave balance, allowing full salary during the medical absence."
 },
 {
 question: "Can leave be claimed as a matter of right?",
 answer: "No. Leave is generally not a matter of right — the sanctioning manager reserves the discretion to refuse or revoke leave based on business requirements and team workload."
 },
 {
 question: "What is Child Care Leave (CCL) and who is eligible?",
 answer: "Many organisations offer Child Care Leave as per company policy and applicable labour law, typically for employees caring for young children. Check your company's HR policy for eligibility and duration."
 },
 {
 question: "Can I generate leave applications in Hindi (अवकाश हेतु प्रार्थना पत्र)?",
 answer: "Yes, Swalekhani natively supports Hindi leave applications (अवकाश हेतु प्रार्थना पत्र) with proper formal formatting."
 },
 {
 question: "What is the procedure for joining duty after Medical Leave?",
 answer: "An employee returning from Medical Leave must submit a formal resumption notice along with a Medical Fitness Certificate issued by a Registered Medical Practitioner."
 },
 {
 question: "Can I export my leave application as a PDF or Print directly?",
 answer: "Yes, clicking 'Generate Leave Application' opens the Swalekhani draft studio where you can export standard A4 PDF documents or print directly on official letterheads."
 }
];

export default function LeaveApplicationPage() {
 const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

 return (
 <main className="min-h-screen bg-[#f7f5f1] dark:bg-[#07090f] text-slate-900 dark:text-white pt-24 pb-20 selection:bg-brand-pink/30">
 {/* Background Glow */}
 <div className="fixed inset-0 pointer-events-none z-0">
 <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-emerald-500/10 blur-[150px] rounded-full"></div>
 </div>

 <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Breadcrumb */}
 <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-white/60 mb-6">
 <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
 <span>/</span>
 <Link href="/tools" className="hover:text-slate-900 dark:hover:text-white transition-colors">Formats</Link>
 <span>/</span>
 <span className="text-slate-700 dark:text-white/80">Leave Application Format</span>
 </nav>

 {/* Hero Header */}
 <div className="mb-10">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
 <Calendar className="w-3.5 h-3.5" />
 <span>HR Leave Policies & Compliance</span>
 </div>

 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
 Official Leave Application Format & Letter Generator
 </h1>

 <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 leading-relaxed">
 Standard format for Casual Leave (CL), Earned Leave (EL), Medical Leave, and Special Leave. Aligned with standard corporate HR policies.
 </p>

 {/* Main Action Bar */}
 <div className="mt-8 flex flex-wrap items-center gap-4">
 <Link
 href="/tools/letterpad-generator?preset=personal&sub=Application%20for%20Sanction%20of%20Earned%20Leave%20(EL)&tpl=A"
 className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-900 dark:text-white font-semibold text-base shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all"
 >
 <Sparkles className="w-5 h-5" />
 Generate Leave Application
 <ArrowRight className="w-4 h-4" />
 </Link>

 <Link
 href="/tools"
 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#0f131d] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 text-sm font-medium transition-all"
 >
 <Layers className="w-4 h-4" />
 All Formats
 </Link>
 </div>
 </div>

 {/* In-article Ad Slot */}
 {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

 {/* Core Guide Content (300-500 words) */}
 <article className="prose prose max-w-none space-y-8 my-10 text-slate-700 dark:text-white/80 leading-relaxed">
 
 <section className="space-y-4">
 <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
 <UserCheck className="w-6 h-6 text-emerald-400" />
 Guidelines for Submitting Official Leave Applications
 </h2>
 <p>
 In corporate organizations, leave is governed by company HR policies and applicable labour law. Leave generally cannot be claimed as a matter of absolute right; formal advance sanction is the standard practice for planned absences.
 </p>
 <p>
 A formal leave application must provide full clarity on the <strong>nature of leave requested, exact calendar dates, prefix and suffix holidays, station leave permission</strong> (if traveling out of headquarters), and charge handover arrangements to ensure uninterrupted administrative workflow.
 </p>
 </section>

 {/* Key Checklist */}
 <section className="space-y-4">
 <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">
 Essential Fields for Official Leave Letters
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
 {[
 { title: "Competent Sanctioning Authority", desc: "Designation of the Head of Office, Sub-Divisional Officer, or Manager." },
 { title: "Nature & Duration of Leave", desc: "Explicitly specify Casual Leave (CL), Earned Leave (EL), or Medical." },
 { title: "Prefix & Suffix Holidays", desc: "State weekend or gazetted holidays adjoining the leave period." },
 { title: "Station Leave Permission", desc: "Formal request to leave station with out-of-town address." },
 { title: "Handover & Relieving Charge", desc: "Name and designation of the colleague holding dual charge." },
 { title: "Medical Certificate Enclosure", desc: "Reference doctor's recommendation in case of illness." },
 ].map((item, idx) => (
 <div key={idx} className="p-4 rounded-xl bg-white dark:bg-[#0f131d] border border-slate-200 dark:border-white/10 flex items-start gap-3">
 <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
 <div>
 <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
 <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Formatted Sample */}
 <section className="space-y-4">
 <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white flex items-center gap-2">
 <FileText className="w-5 h-5 text-emerald-400" />
 Official Earned Leave Application Sample
 </h3>
 <div className="p-6 rounded-2xl bg-white dark:bg-[#0f131d] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 text-sm leading-relaxed shadow-inner font-serif">
 <div className="flex justify-between text-xs text-slate-500 dark:text-white/60 mb-4 font-mono">
 <span>Station: Nagpur</span>
 <span>Date: 23rd September, 2026</span>
 </div>

 <div className="text-xs space-y-1 mb-4">
 <p className="font-bold text-slate-900 dark:text-white">To,</p>
 <p>The Senior Superintendent of Post Offices,</p>
 <p>Nagpur City Division, Nagpur - 440001.</p>
 </div>

 <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">
 Subject: Application for Sanction of 05 Days Earned Leave (EL) on Private Affairs — Regarding.
 </p>

 <div className="text-xs space-y-2 text-slate-700 dark:text-white/80 font-sans leading-relaxed">
 <p>Respected Sir,</p>
 <p>
 1. I have the honor to submit that due to urgent domestic affairs at my native place, I am unable to attend official duties from <strong>28th September 2026 to 02nd October 2026 (05 days)</strong> with permission to prefix Sunday (27th Sept) and suffix National Holiday (2nd Oct).
 </p>
 <p>
 2. I also request kind permission to leave the headquarters during the said period. My contact address during leave will be: <em>At/Post: Wardha, Dist: Wardha - 442001 (Mob: 9876543210)</em>.
 </p>
 <p>
 3. Shri R. K. Joshi, Postal Assistant, has kindly agreed to look after my routine branch duties during my absence.
 </p>
 </div>

 <div className="text-right text-xs pt-6 space-y-1">
 <p className="font-bold text-slate-900 dark:text-white">Yours faithfully,</p>
 <p className="text-slate-700 dark:text-white/80">[Signature]</p>
 <p className="text-slate-600 dark:text-white/70">Name: Sandeep K. Deshmukh</p>
 <p className="text-slate-500 dark:text-white/60">Designation: Postal Assistant, Estt. Branch</p>
 <p className="text-slate-500 dark:text-white/60">Employee ID: 10048291</p>
 </div>
 </div>
 </section>

 </article>

 {/* Social Share Bar */}
 <ShareButtons
 title="Leave Application Format & Maker - Swalekhani"
 description="Draft official leave letters (CL, EL, Medical) in seconds."
 />

 {/* In-article Ad Slot */}
 {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

 {/* FAQ Section */}
 <FaqAccordion
 items={FAQ_ITEMS}
 title="Leave Application FAQs"
 subtitle="Procedural answers for corporate and professional leave applications."
 />

 {/* Bottom CTA Card */}
 <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-white/[0.02] to-cyan-500/10 border border-slate-200 dark:border-white/10 text-center">
 <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-3">
 Draft Your Leave Application in Seconds
 </h3>
 <p className="text-sm sm:text-base text-slate-500 dark:text-white/60 max-w-xl mx-auto mb-6">
 Enter your leave dates and reason; Swalekhani formats an official leave letter ready for print or instant PDF download.
 </p>
 <Link
 href="/tools/letterpad-generator?preset=personal&sub=Application%20for%20Sanction%20of%20Earned%20Leave%20(EL)&tpl=A"
 className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
 >
 <Sparkles className="w-4 h-4 text-emerald-500" />
 <span>Open Leave Letter Studio</span>
 </Link>
 </div>

 </div>
 </main>
 );
}
