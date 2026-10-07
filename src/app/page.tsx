"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Scale, Building2, Stethoscope, Calculator, HardHat, Briefcase,
  ArrowRight, CheckCircle2, ShieldCheck, Printer, Zap, Layers,
  HelpCircle, ChevronRight, Copy, Check, FileText, Megaphone, Clock, Award, Send
} from 'lucide-react';
import AdSlot from '@/components/AdSlot';

interface SamplePrompt {
  id: string;
  lang: string;
  category: string;
  title: string;
  prompt: string;
  subject: string;
  preset: string;
  template?: string;
  preview: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'corporate-hr',
    lang: 'English',
    category: 'Corporate / HR',
    title: 'Job Offer Letter',
    prompt: 'Formal job offer letter for a software engineer role with joining date, CTC breakup, and probation terms',
    subject: 'Offer of Employment — Software Engineer.',
    preset: 'corporate',
    preview: 'Dear Candidate, We are pleased to offer you the position of Software Engineer at our organisation. Your annual cost-to-company (CTC) will be as per the annexure, with a probation period of six months from your date of joining. Please confirm your acceptance by signing and returning a copy of this letter.'
  },
  {
    id: 'client-complaint',
    lang: 'English',
    category: 'Consumer / Complaint',
    title: 'Defective Product Complaint',
    prompt: 'Formal complaint to a retailer about a defective appliance delivered last week, seeking replacement under warranty',
    subject: 'Complaint Regarding Defective Product — Request for Replacement.',
    preset: 'complaint',
    preview: 'Dear Sir/Madam, I am writing to bring to your attention that the appliance delivered to my address on the above date stopped working within three days of installation. As the product is under warranty, I request an immediate replacement or a full refund of the purchase amount.'
  },
  {
    id: 'vendor-payment',
    lang: 'English',
    category: 'Business / Vendor',
    title: 'Vendor Payment Follow-up',
    prompt: 'Polite but firm follow-up letter to a vendor regarding long-pending invoice payment',
    subject: 'Follow-up: Payment Against Invoice No. 4821.',
    preset: 'corporate',
    preview: 'Dear Sir/Madam, This is to follow up on our invoice No. 4821 dated last month, which remains unpaid despite two earlier reminders. We request you to release the outstanding payment within seven working days to avoid any disruption in ongoing supplies.'
  },
  {
    id: 'legal-notice',
    lang: 'English / Legal',
    category: 'Advocate / Bar Council',
    title: 'Legal Notice (Cheque Dishonour / Sec 138)',
    prompt: 'Statutory demand notice under Section 138 of Negotiable Instruments Act for cheque return due to insufficient funds',
    subject: 'Statutory Demand Notice under Section 138 of the Negotiable Instruments Act, 1881.',
    preset: 'legal',
    template: 'advocate',
    preview: 'Under instructions from and on behalf of my client, I hereby serve upon you this formal legal notice calling upon you to make payment of the cheque amount within 15 days of receipt of this notice, failing which criminal proceedings will be instituted.'
  },
];

const TEMPLATE_CARDS = [
  {
    name: 'Corporate Letterhead',
    desc: 'Registered office block, CIN line, and clean executive typography.',
    href: '/tools/letterpad-generator?preset=corporate&tpl=A',
    Icon: Building2,
  },
  {
    name: 'Advocate Chambers',
    desc: 'Enrolment number, court jurisdiction, and formal notice styling.',
    href: '/tools/letterpad-generator?template=advocate',
    Icon: Scale,
  },
  {
    name: 'Clinic & Hospital',
    desc: 'Doctor panel, timings, and prescription-ready layout.',
    href: '/tools/letterpad-generator?template=clinic',
    Icon: Stethoscope,
  },
  {
    name: 'CA & Accountant',
    desc: 'Firm registration, membership number, and UDIN-ready format.',
    href: '/tools/letterpad-generator?template=ca-accountant',
    Icon: Calculator,
  },
  {
    name: 'Contractor & Builder',
    desc: 'GSTIN, project credentials, and bid-ready presentation.',
    href: '/tools/letterpad-generator?template=contractor-builder',
    Icon: HardHat,
  },
  {
    name: 'Freelancer & Consultant',
    desc: 'Personal brand header with services and payment terms.',
    href: '/tools/letterpad-generator?template=freelancer',
    Icon: Briefcase,
  },
];

const FORMAT_CARDS = [
  {
    name: 'RTI Application',
    desc: 'Section 6(1) format with point-wise queries and fee details.',
    href: '/formats/rti-application',
    Icon: FileText,
  },
  {
    name: 'Complaint Letter',
    desc: 'Consumer complaints that get answered — with escalation line.',
    href: '/formats/complaint-letter',
    Icon: Megaphone,
  },
  {
    name: 'Leave Application',
    desc: 'Casual, earned, and medical leave with charge handover.',
    href: '/formats/leave-application',
    Icon: Clock,
  },
  {
    name: 'Office Order',
    desc: 'Transfers, duty allocation, and internal circulars.',
    href: '/formats/office-order',
    Icon: Award,
  },
];

const FAQS = [
  {
    q: 'Is Swalekhani really free?',
    a: 'Yes. Drafting, formatting, and unwatermarked A4 PDF export are free — no account, no trial, no catch.',
  },
  {
    q: 'Will my letters and personal details stay private?',
    a: 'Everything runs inside your browser. Your drafts, names, and addresses are never uploaded to our servers or stored in any database.',
  },
  {
    q: 'Can I write in Hindi or Marathi?',
    a: 'Yes. The AI drafts in English, Hindi (हिन्दी), and Marathi (मराठी) with proper formal salutations and subject lines for each language.',
  },
  {
    q: 'Can I print on my existing printed letterhead paper?',
    a: 'Yes. Toggle off the header in the Studio and only your letter body prints — aligned to your pre-printed stationery.',
  },
];

function LetterVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-brand-orange/15 via-transparent to-brand-sky/15 rounded-[2rem] blur-2xl" aria-hidden />
      <div className="relative bg-white dark:bg-[#11161f] rounded-2xl border border-slate-200 dark:border-white/10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] p-6 sm:p-8 rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="text-center border-b-2 border-slate-900 dark:border-white pb-4 mb-4">
          <p className="font-heading font-bold text-lg text-slate-900 dark:text-white tracking-wide">VOLTEDGE HOME APPLIANCES</p>
          <p className="text-[10px] text-slate-600 dark:text-white/50 tracking-[0.2em] uppercase mt-1">Private Limited · Pune · Mumbai</p>
        </div>
        <p className="text-[11px] font-semibold text-slate-900 dark:text-white mb-3">Subject: Offer of Employment — Software Engineer.</p>
        <div className="space-y-2" aria-hidden>
          {[92, 100, 88, 96, 70].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-slate-100 dark:bg-white/10" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="flex justify-between items-end mt-6">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-orange" />
            <span className="w-2 h-2 rounded-full bg-brand-pink" />
            <span className="w-2 h-2 rounded-full bg-brand-sky" />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-white/60 font-medium">A4 · Vector PDF</p>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 bg-white dark:bg-[#11161f] rounded-xl border border-slate-200 dark:border-white/10 shadow-lg px-4 py-3 flex items-center gap-2.5 -rotate-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">PDF exported</p>
          <p className="text-[10px] text-slate-600 dark:text-white/50">No watermark · Print-ready</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const currentPrompt = SAMPLE_PROMPTS[activePromptIdx];
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt.preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#faf8f3] dark:bg-[#0a0d13] text-slate-900 dark:text-white font-sans overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-white/70 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                AI letterpad studio · English · हिन्दी · मराठी
              </div>
              <h1 className="font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] mb-6">
                Letters that look like you{' '}
                <span className="text-brand-orange">mean business.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-white/60 leading-relaxed max-w-lg mb-8">
                Swalekhani drafts, formats, and prints professional letters — corporate, legal, personal, complaints, RTI — in seconds. Free forever, private by design, no sign-up.
              </p>
              <div className="flex flex-wrap gap-3.5 mb-10">
                <Link
                  href="/tools/letterpad-generator"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-[15px] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Open the Studio
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-semibold text-[15px] hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 transition-all"
                >
                  <Layers className="w-4 h-4 text-brand-orange" />
                  Browse templates
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['Free forever', 'No sign-up needed', 'Runs in your browser'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-white/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <LetterVisual />
            </div>
          </div>
        </div>
      </section>

      {adsEnabled && <AdSlot slotKey="home-top" label="Sponsored Content" />}

      {/* ── TEMPLATES ── */}
      <section className="py-16 sm:py-20 border-t border-slate-200/70 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">Templates</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">Letterheads for every profession</h2>
            </div>
            <Link href="/templates" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">
              View all 14+ templates <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMPLATE_CARDS.map((t) => (
              <Link
                key={t.name}
                href={t.href}
                className="group p-6 rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10 hover:border-brand-orange/50 hover:shadow-[0_16px_40px_-16px_rgba(232,118,43,0.35)] hover:-translate-y-1 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors">
                  <t.Icon className="w-5 h-5 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1.5">{t.name}</h3>
                <p className="text-sm text-slate-600 dark:text-white/50 leading-relaxed mb-4">{t.desc}</p>
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-orange">
                  Use template <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#0d1117] border-y border-slate-200/70 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">How it works</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight mb-3">Blank page to signed PDF in three steps</h2>
            <p className="text-slate-600 dark:text-white/50">No design skills. Nothing to install.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { n: '01', Icon: Layers, title: 'Pick a letterhead', desc: 'Choose a profession template or start blank with your own logo and details.' },
              { n: '02', Icon: Sparkles, title: 'Draft with AI', desc: 'Describe the letter in plain words. The AI structures it with subject, reference, and formal tone.' },
              { n: '03', Icon: Printer, title: 'Export and print', desc: 'Preview on a live A4 canvas. Export a crisp, unwatermarked vector PDF.' },
            ].map((s) => (
              <div key={s.n} className="relative p-7 rounded-2xl bg-[#faf8f3] dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <span className="font-heading font-extrabold text-5xl text-slate-200 dark:text-white/10 absolute top-5 right-6 select-none">{s.n}</span>
                <s.Icon className="w-6 h-6 text-brand-orange mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PLAYGROUND ── */}
      <section id="ai-studio-section" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">Try it now</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight mb-3">Watch AI draft a real letter</h2>
            <p className="text-slate-600 dark:text-white/50">Pick a scenario — this is exactly how the Studio structures your draft.</p>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto items-start">
            <div className="lg:col-span-5 space-y-3">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => setActivePromptIdx(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    activePromptIdx === idx
                      ? 'bg-white dark:bg-[#11161f] border-brand-orange/60 shadow-[0_8px_30px_-12px_rgba(232,118,43,0.4)]'
                      : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 font-mono">{sample.lang}</span>
                    <span className="text-[11px] font-semibold text-brand-orange">{sample.category}</span>
                  </div>
                  <h4 className="text-sm font-bold mb-1">{sample.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-white/50 line-clamp-2">&ldquo;{sample.prompt}&rdquo;</p>
                </button>
              ))}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10">
                <label className="text-xs font-bold text-slate-600 dark:text-white/70 block mb-2">Or describe your own letter:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. NOC for passport, salary hike request…"
                    className="flex-1 bg-[#faf8f3] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-orange"
                  />
                  <Link
                    href={`/tools/letterpad-generator?sub=${encodeURIComponent(customPrompt || 'Letter')}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    Draft <Send className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] text-slate-500 dark:text-white/60 font-mono ml-2">Live preview</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy text'}
                  </button>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 mb-1">Subject</p>
                  <p className="text-sm font-bold mb-5">{currentPrompt.subject}</p>
                  <p className="text-sm text-slate-600 dark:text-white/70 leading-[1.9]">{currentPrompt.preview}</p>
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-3">
                    <Link
                      href={`/tools/letterpad-generator?preset=${currentPrompt.preset}${currentPrompt.template ? `&template=${currentPrompt.template}` : ''}&sub=${encodeURIComponent(currentPrompt.subject)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:brightness-95 transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Open in Studio
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/60 font-medium self-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Private — drafts never leave your browser
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMATS ── */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#0d1117] border-y border-slate-200/70 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">Formats</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">Ready-made formats, done right</h2>
            </div>
            <Link href="/formats" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">
              All formats <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FORMAT_CARDS.map((f) => (
              <Link
                key={f.name}
                href={f.href}
                className="group p-6 rounded-2xl bg-[#faf8f3] dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-brand-orange/50 hover:-translate-y-1 transition-all"
              >
                <f.Icon className="w-6 h-6 text-brand-orange mb-4" />
                <h3 className="font-heading font-bold mb-1.5">{f.name}</h3>
                <p className="text-[13px] text-slate-600 dark:text-white/50 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">FAQ</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight">Questions, answered</h2>
          </div>
          <div className="space-y-3.5">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10">
                <h3 className="font-bold text-[15px] mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-600 dark:text-white/50 leading-relaxed pl-[30px]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-white px-8 py-14 sm:p-16 text-center">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-orange/25 rounded-full blur-3xl" aria-hidden />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-sky/20 rounded-full blur-3xl" aria-hidden />
            <div className="relative">
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-white dark:text-slate-900 mb-4">
                Your next letter is two minutes away.
              </h2>
              <p className="text-white/60 dark:text-slate-600 max-w-xl mx-auto mb-8">
                Pick a letterhead, describe your letter, export the PDF. No account, no watermark, no fuss.
              </p>
              <Link
                href="/tools/letterpad-generator"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold hover:scale-[1.03] transition-transform shadow-xl"
              >
                <Sparkles className="w-5 h-5 text-brand-orange" />
                Start drafting — it&apos;s free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
