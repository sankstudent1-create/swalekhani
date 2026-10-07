import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Megaphone, ArrowRight, CheckCircle2, FileText, Sparkles, Layers, PenLine } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
 title: 'Complaint Letter Format | Consumer & Service Complaint Draft Maker',
 description: 'Write powerful formal complaint letters for defective products, deficient services, billing disputes, and warranty claims. Consumer Protection Act 2019 aligned format with AI drafting.',
 keywords: [
 'complaint letter format',
 'consumer complaint letter format',
 'formal complaint letter sample',
 'complaint letter to company',
 'service complaint letter format',
 'how to write a complaint letter'
 ],
 alternates: {
 canonical: '/formats/complaint-letter',
 },
 openGraph: {
 title: 'Complaint Letter Format | Consumer & Service Complaint Draft Maker',
 description: 'Draft firm, professional complaint letters for products, services, and billing disputes with instant AI drafting.',
 url: 'https://swalekhani.vercel.app/formats/complaint-letter',
 images: ['/og/complaint-letter.svg'],
 type: 'article',
 },
 twitter: {
 card: 'summary_large_image',
 title: 'Complaint Letter Format | Consumer & Service Complaint Draft Maker',
 description: 'Formal complaint letter generator for defective products and deficient services.',
 images: ['/og/complaint-letter.svg'],
 },
};

const FAQ_ITEMS: FaqItem[] = [
 {
 question: "What should a formal complaint letter always include?",
 answer: "A strong complaint letter states the facts with dates (purchase date, invoice number, service dates), describes the problem precisely, references supporting evidence (photos, receipts, prior complaint numbers), specifies the exact relief you want (refund, replacement, repair, compensation), and sets a reasonable deadline for response — typically 7 to 15 days."
 },
 {
 question: "What tone should I use in a complaint letter?",
 answer: "Firm but professional. State the problem and its impact without abuse or threats. Companies act faster on calm, well-documented complaints because they signal a customer who will escalate through proper channels if ignored."
 },
 {
 question: "How do I complain about a defective product under the Consumer Protection Act, 2019?",
 answer: "Address the seller or manufacturer first, citing the defect, invoice details, and warranty terms. If they fail to resolve it, you can file a complaint with the District Consumer Disputes Redressal Commission. Complaints up to ₹50 lakh fall under the District Commission's jurisdiction."
 },
 {
 question: "Should I mention legal action in my complaint letter?",
 answer: "A measured line such as 'I reserve the right to approach the consumer forum' is effective. Avoid aggressive ultimatums — they weaken your position. One clear escalation sentence near the end is enough."
 },
 {
 question: "How long should I wait before escalating a complaint?",
 answer: "Give the company 7–15 days to respond to a written complaint. If there is no satisfactory response, escalate to the company's nodal/grievance officer, then to the relevant ombudsman (banking, insurance, telecom) or the consumer commission."
 },
 {
 question: "Can I claim compensation for mental agony and harassment?",
 answer: "Yes. Consumer commissions routinely award compensation for deficiency in service, including mental agony and litigation costs, when the complaint is well-documented. Keep records of every call, email, and visit."
 },
 {
 question: "What evidence should I attach with a complaint letter?",
 answer: "Copies (never originals) of the invoice/bill, warranty card, product photographs showing the defect, prior complaint reference numbers, and any written communication with the seller. Mention each enclosure by name in the letter."
 },
 {
 question: "Can Swalekhani draft a complaint letter in Hindi or Marathi?",
 answer: "Yes. Describe your problem in simple words in English, Hindi, or Marathi, and the AI assistant structures it into a formal complaint with proper salutations, subject line, and closing."
 }
];

export default function ComplaintLetterPage() {
 const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

 return (
 <main className="min-h-screen bg-[#faf8f3] dark:bg-[#0a0d13] text-slate-900 dark:text-white pt-24 pb-20 selection:bg-brand-pink/30">
 {/* Background Glow */}
 <div className="fixed inset-0 pointer-events-none z-0">
 <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-orange-500/10 blur-[150px] rounded-full"></div>
 </div>

 <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Breadcrumb */}
 <nav className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-white/60 mb-6">
 <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
 <span>/</span>
 <Link href="/formats" className="hover:text-slate-900 dark:hover:text-white transition-colors">Formats</Link>
 <span>/</span>
 <span className="text-slate-700 dark:text-white/80">Complaint Letter Format</span>
 </nav>

 {/* Hero Header */}
 <div className="mb-10">
 <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-4">
 <Megaphone className="w-3.5 h-3.5" />
 <span>Consumer Protection Act, 2019</span>
 </div>

 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
 Complaint Letter Format & Grievance Draft Maker
 </h1>

 <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 leading-relaxed">
 Firm, professional complaint letters for defective products, deficient services, billing disputes, and warranty claims — structured to get a response, not get ignored.
 </p>

 {/* Main Action Bar */}
 <div className="mt-8 flex flex-wrap items-center gap-4">
 <Link
 href="/tools/letterpad-generator?preset=complaint&sub=Complaint%20Regarding%20Defective%20Product%20/%20Deficient%20Service&tpl=B"
 className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white font-semibold text-base shadow-[0_10px_30px_rgba(249,115,22,0.25)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition-all"
 >
 <Sparkles className="w-5 h-5" />
 Generate Complaint Letter
 <ArrowRight className="w-4 h-4" />
 </Link>

 <Link
 href="/formats"
 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#0f131d] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 text-sm font-medium transition-all"
 >
 <Layers className="w-4 h-4" />
 All Formats
 </Link>
 </div>
 </div>

 {/* In-article Ad Slot */}
 {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

 {/* Core Guide Content */}
 <article className="prose max-w-none space-y-8 my-10 text-slate-700 dark:text-white/80 leading-relaxed">

 <section className="space-y-4">
 <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
 <PenLine className="w-6 h-6 text-orange-500" />
 How to Write a Complaint Letter That Gets Results
 </h2>
 <p>
 A complaint letter is a <strong>record</strong> — unlike a phone call, it creates a paper trail with dates, reference numbers, and a clear demand. Companies prioritise written complaints because they know these can be produced before a consumer forum or ombudsman.
 </p>
 <p>
 The formula is simple: <strong>facts first, feelings second, demand last</strong>. Open with what you bought and when, describe exactly what went wrong, attach your evidence, and close with the specific resolution you expect and a deadline.
 </p>
 </section>

 {/* Key Checklist */}
 <section className="space-y-4">
 <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white">
 Checklist for an Effective Complaint Letter
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
 {[
 { title: "Exact Facts & Dates", desc: "Purchase date, invoice/order number, model, and service dates." },
 { title: "Clear Problem Statement", desc: "What is wrong, when it started, and how it affects you." },
 { title: "Evidence Reference", desc: "Photos, receipts, warranty card, prior complaint numbers." },
 { title: "Specific Relief Sought", desc: "Refund, replacement, free repair, or compensation — name it." },
 { title: "Response Deadline", desc: "A fair 7–15 day window for the company to act." },
 { title: "Escalation Line", desc: "One calm sentence reserving your right to approach the consumer forum." },
 ].map((item, idx) => (
 <div key={idx} className="p-4 rounded-xl bg-white dark:bg-[#0f131d] border border-slate-200 dark:border-white/10 flex items-start gap-3 shadow-sm">
 <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
 <div>
 <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h4>
 <p className="text-xs text-slate-600 dark:text-white/60 mt-0.5">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Formatted Sample */}
 <section className="space-y-4">
 <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white flex items-center gap-2">
 <FileText className="w-5 h-5 text-orange-500" />
 Sample: Defective Product Complaint
 </h3>
 <div className="p-6 rounded-2xl bg-white dark:bg-[#0f131d] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 text-sm leading-relaxed shadow-sm font-serif">
 <div className="flex justify-between text-xs text-slate-600 dark:text-white/60 mb-4 font-mono">
 <span>Date: 7th October, 2026</span>
 <span>Place: Pune</span>
 </div>

 <div className="text-xs space-y-1 mb-4">
 <p className="font-bold text-slate-900 dark:text-white">To,</p>
 <p>The Customer Service Manager,</p>
 <p>VoltEdge Home Appliances Pvt. Ltd.,</p>
 <p>Plot 42, MIDC Industrial Area, Chakan, Pune - 410501.</p>
 </div>

 <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">
 Subject: Complaint regarding defective 1.5-ton split air conditioner (Invoice No. VE/2026/88412) — request for replacement.
 </p>

 <div className="text-xs space-y-2 text-slate-700 dark:text-white/80 font-sans leading-relaxed">
 <p>Respected Sir / Madam,</p>
 <p>I purchased a 1.5-ton split air conditioner (Model: VE-CoolPro 18K, Serial No. SN88412076) from your authorised dealer, Shree Electronics, Pune, on 14th August 2026 vide Invoice No. VE/2026/88412 for ₹38,500. The unit carries a 5-year comprehensive warranty.</p>
 <p>Within three weeks of installation, the unit stopped cooling and began leaking water indoors. Your service engineer visited on 20th September 2026 (Service Ticket No. ST-55231) and confirmed a manufacturing defect in the cooling coil, assuring replacement within 10 days. No replacement has been provided to date despite two follow-up calls.</p>
 <p>I request a <strong>complete replacement of the unit within 10 days</strong> of receiving this letter. Copies of the invoice, warranty card, and service ticket are enclosed. If the matter is not resolved, I shall be constrained to approach the District Consumer Disputes Redressal Commission.</p>
 </div>

 <div className="text-right text-xs pt-6 space-y-1">
 <p className="font-bold text-slate-900 dark:text-white">Yours faithfully,</p>
 <p className="text-slate-700 dark:text-white/80">[Signature]</p>
 <p className="text-slate-600 dark:text-white/70">Name: Amit Deshmukh</p>
 <p className="text-slate-600 dark:text-white/60">Address: B-704, Green Acres, Baner, Pune - 411045</p>
 <p className="text-slate-600 dark:text-white/60">Mobile: +91-9822012345</p>
 </div>
 </div>
 </section>

 </article>

 {/* Social Share Bar */}
 <ShareButtons
 title="Complaint Letter Format & Maker - Swalekhani"
 description="Draft firm, professional complaint letters for products and services in seconds."
 />

 {/* In-article Ad Slot */}
 {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

 {/* FAQ Section */}
 <FaqAccordion
 items={FAQ_ITEMS}
 title="Complaint Letter FAQs"
 subtitle="Consumer rights, escalation paths, and drafting guidance."
 />

 {/* Bottom CTA Card */}
 <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500/15 via-white to-amber-500/10 border border-slate-200 dark:border-white/10 text-center">
 <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-3">
 Draft Your Complaint with AI
 </h3>
 <p className="text-sm sm:text-base text-slate-600 dark:text-white/60 max-w-xl mx-auto mb-6">
 Describe the problem in simple words; Swalekhani structures it into a firm, professional complaint letter.
 </p>
 <Link
 href="/tools/letterpad-generator?preset=complaint&sub=Complaint%20Regarding%20Defective%20Product%20/%20Deficient%20Service&tpl=B"
 className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-slate-800 hover:scale-105 transition-all shadow-lg"
 >
 <Sparkles className="w-4 h-4 text-orange-400" />
 <span>Open Complaint Draft Studio</span>
 </Link>
 </div>

 </div>
 </main>
 );
}
