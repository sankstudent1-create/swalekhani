"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Landmark, FileText, Scale, Building2, Stethoscope, 
  ArrowRight, CheckCircle2, ShieldCheck, Printer, Zap, 
  Layers, HelpCircle, ChevronRight, Copy, Check, Terminal,
  Clock, Award, BookOpen, UserCheck, Flame, Send
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
    id: 'marathi-gram',
    lang: 'मराठी',
    category: 'ग्रामपंचायत / स्थानिक प्रशासन',
    title: 'पथदिवे व रस्ता दुरुस्तीबाबत अर्ज',
    prompt: 'ग्रामपंचायत कार्यालयाला वॉर्ड क्र. ३ मधील पथदिवे (स्ट्रीट लाईट) दुरुस्ती आणि पावसाळ्यापूर्वी रस्ता दुरुस्तीबाबत तातडीने अर्ज',
    subject: 'वॉर्ड क्र. ३ मधील नादुरुस्त पथदिवे आणि रस्ता डांबरीकरण / दुरुस्ती करणेबाबत.',
    preset: 'custom',
    template: 'gram-panchayat',
    preview: 'महोदय, उपरोक्त विषयान्वये सविनय सादर करण्यात येते की आमच्या वॉर्ड क्रमांक ३ मधील मुख्य मार्गावरील पथदिवे गेल्या १५ दिवसांपासून बंद अवस्थेत आहेत. तसेच आगामी पावसाळा लक्षात घेता रस्त्यावरील खड्डे त्वरित बुजविणे अत्यंत गरजेचे आहे. तरी जनहितास्तव सदर कामे तातडीने मार्गी लावावीत ही नम्र विनंती.'
  },
  {
    id: 'hindi-nagar',
    lang: 'हिन्दी',
    category: 'नगर पालिका / शिकायत पत्र',
    title: 'पेयजल एवं जल भराव समस्या हेतु',
    prompt: 'नगर निगम आयुक्त को वार्ड में दूषित पेयजल आपूर्ति और जल भराव की समस्या समाधान हेतु औपचारिक पत्र',
    subject: 'वार्ड क्रमांक १२ में दूषित पेयजल आपूर्ति एवं जल निकासी व्यवस्था दुरुस्त करने के संबंध में।',
    preset: 'district',
    preview: 'महोदय, सविनय निवेदन है कि हमारे क्षेत्र में पिछले एक सप्ताह से पेयजल आपूर्ति अत्यंत दूषित आ रही है, जिससे नागरिकों में संक्रामक बीमारियों का खतरा बढ़ गया है। अतः आपसे विनम्र अनुरोध है कि संबंधित अभियंताओं को त्वरित निरीक्षण एवं पाइपलाइन मरम्मत हेतु निर्देशित करने की कृपा करें।'
  },
  {
    id: 'eng-leave',
    lang: 'English',
    category: 'Govt & HR / CCS Leave',
    title: 'Earned Leave (EL) Application',
    prompt: 'Application for 5 days Earned Leave on private affairs with Station Leave Permission and charge handover',
    subject: 'Application for Sanction of 05 Days Earned Leave (EL) on Private Affairs — Reg.',
    preset: 'dop',
    template: 'A',
    preview: 'Respected Sir, I have the honour to submit that due to urgent domestic affairs, I am unable to attend official duties from 28th Sept to 02nd Oct (05 days) with permission to leave headquarters. Shri R. K. Joshi has kindly consented to look after my routine branch duties during my absence.'
  },
  {
    id: 'legal-notice',
    lang: 'English / Legal',
    category: 'Advocate / Bar Council',
    title: 'Legal Notice (Cheque Dishonour / Sec 138)',
    prompt: 'Statutory demand notice under Section 138 of Negotiable Instruments Act for cheque return due to insufficient funds',
    subject: 'Statutory Demand Notice under Section 138 of the Negotiable Instruments Act, 1881.',
    preset: 'custom',
    template: 'advocate',
    preview: 'Under instructions from and on behalf of my client, I hereby serve upon you this formal legal notice calling upon you to make payment of the cheque amount within 15 days of receipt of this notice, failing which criminal proceedings will be instituted.'
  }
];

const FEATURED_PRESETS = [
  {
    id: 'dop',
    name: 'India Post / Central Ministry',
    badge: 'Rajbhasha Standard',
    desc: 'Bilingual Ashoka emblem letterhead with file numbering and numbered paragraphing.',
    href: '/tools/letterpad-generator?preset=dop&tpl=A',
    icon: Landmark,
    color: 'from-sky-500/20 to-blue-600/10',
    border: 'border-sky-500/30',
    accent: 'text-sky-400'
  },
  {
    id: 'gram-panchayat',
    name: 'Gram Panchayat & Sarpanch',
    badge: 'Panchayati Raj',
    desc: 'Authentic village administration letterhead in Devanagari with Tricolor emblem header.',
    href: '/tools/letterpad-generator?template=gram-panchayat',
    icon: Building2,
    color: 'from-amber-500/20 to-orange-600/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-400'
  },
  {
    id: 'advocate',
    name: 'Advocate & High Court Chambers',
    badge: 'Bar Council Format',
    desc: 'Formal legal letterhead with enrolment details, court jurisdiction, and notice styling.',
    href: '/tools/letterpad-generator?template=advocate',
    icon: Scale,
    color: 'from-amber-600/20 to-yellow-600/10',
    border: 'border-amber-600/30',
    accent: 'text-yellow-400'
  },
  {
    id: 'doctor',
    name: 'Doctor & Hospital Rx Pad',
    badge: 'NMC Ethics 2023',
    desc: 'Medical prescription pad with clinic timings, qualification, and vital stats layout.',
    href: '/tools/letterpad-generator?preset=doctor&tpl=C',
    icon: Stethoscope,
    color: 'from-cyan-500/20 to-teal-600/10',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-400'
  },
  {
    id: 'company',
    name: 'Corporate & MSME Letterhead',
    badge: 'MCA & GST Compliant',
    desc: 'Section 12(3)(c) compliant business stationery with CIN, GSTIN, and registered office.',
    href: '/tools/letterpad-generator?preset=company&tpl=B',
    icon: Building2,
    color: 'from-purple-500/20 to-indigo-600/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-400'
  },
  {
    id: 'leave',
    name: 'Official Leave Application',
    badge: 'CCS Leave Rules',
    desc: 'Standard administrative leave format for CL, EL, Medical, and Station Leaving.',
    href: '/formats/leave-application',
    icon: Clock,
    color: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400'
  }
];

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

  const buildStudioLaunchUrl = (promptObj: SamplePrompt) => {
    let url = `/tools/letterpad-generator?preset=${promptObj.preset}`;
    if (promptObj.template) url += `&template=${promptObj.template}`;
    if (promptObj.subject) url += `&sub=${encodeURIComponent(promptObj.subject)}`;
    return url;
  };

  return (
    <main className="min-h-screen bg-[#07090f] text-white selection:bg-brand-pink/30 relative overflow-x-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-brand-orange/15 via-brand-pink/10 to-transparent blur-[160px] rounded-full opacity-70"></div>
        <div className="absolute top-[35%] -left-32 w-[600px] h-[600px] bg-brand-sky/10 blur-[180px] rounded-full"></div>
        <div className="absolute top-[65%] -right-32 w-[600px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Hero Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              India&apos;s Standard AI Letterpad & Document Studio
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Draft, Format & Print <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky bg-clip-text text-transparent">
              Official Indian Letters
            </span> in Seconds.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/65 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            Create authentic bilingual letterheads for Government, Panchayati Raj, Legal, Corporate, and Citizen communications. Generate structured, formal drafts with Groq AI in <strong className="text-white">मराठी, हिन्दी & English</strong>.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/tools/letterpad-generator"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky text-white font-semibold text-base shadow-[0_10px_35px_rgba(255,100,50,0.3)] hover:shadow-[0_15px_45px_rgba(255,100,50,0.45)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              <span>Launch Letterpad Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-semibold transition-all backdrop-blur-md"
            >
              <Layers className="w-4 h-4" />
              <span>Browse 17+ Templates</span>
            </Link>

            <Link
              href="/formats"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-sm font-semibold transition-all backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Statutory Formats (RTI / Leave)</span>
            </Link>
          </div>

          {/* 4 Core Entry Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-6xl mx-auto">
            
            {/* Gateway 1: Blank Studio */}
            <Link
              href="/tools/letterpad-generator"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-brand-orange/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/20 flex items-center justify-center mb-3 text-brand-orange">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base mb-1 group-hover:text-brand-orange transition-colors">
                1. Make Your Letterpad
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                Design official stationery with Ashoka Lion, state insignia, department emblems, or company logos.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-orange">
                <span>Start Studio</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Gateway 2: AI Write */}
            <a
              href="#ai-studio-section"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-brand-pink/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-pink/15 border border-brand-pink/20 flex items-center justify-center mb-3 text-brand-pink">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base mb-1 group-hover:text-brand-pink transition-colors">
                2. Write Letter by AI
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                Provide brief bullet points in Marathi, Hindi, or English; get structured formal paragraphs instantly.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-pink">
                <span>Try AI Prompts</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Gateway 3: Profession Templates */}
            <Link
              href="/templates"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-brand-sky/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-sky/15 border border-brand-sky/20 flex items-center justify-center mb-3 text-brand-sky">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base mb-1 group-hover:text-brand-sky transition-colors">
                3. 17+ Profession Presets
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                Pre-formatted layouts for Advocates, CAs, Doctors, Gram Panchayats, Housing Societies & Shops.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-sky">
                <span>View Templates</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Gateway 4: Formats & RTI */}
            <Link
              href="/formats"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-400/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-base mb-1 group-hover:text-emerald-300 transition-colors">
                4. Statutory Formats
              </h3>
              <p className="text-xs text-white/55 leading-relaxed">
                RTI Form A, CCS Leave Applications, Office Orders, Police Complaints & Mahavitaran grievances.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <span>Explore Formats</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* Top Ad Slot */}
      {adsEnabled && <AdSlot slotKey="home-top" label="Sponsored Content" />}

      {/* SECTION: Interactive AI Prompt Playground */}
      <section id="ai-studio-section" className="relative z-10 py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Multilingual AI Prompt Generator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight mb-3">
              Experience Instant AI Drafting in Action
            </h2>
            <p className="text-sm sm:text-base text-white/60">
              Select a real-world scenario or type your prompt to see how Swalekhani structures formal Rajbhasha and official letters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Prompt Selector Column */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1">
                Select a Standard Use Case
              </span>

              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => setActivePromptIdx(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                    activePromptIdx === idx
                      ? 'bg-white/[0.08] border-brand-pink/50 shadow-[0_4px_20px_rgba(236,72,153,0.15)] scale-[1.02]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] text-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-white/80 font-mono">
                      {sample.lang}
                    </span>
                    <span className="text-[11px] font-medium text-brand-pink">
                      {sample.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {sample.title}
                  </h4>
                  <p className="text-xs text-white/50 line-clamp-2">
                    &quot;{sample.prompt}&quot;
                  </p>
                </button>
              ))}

              {/* Custom Prompt Box */}
              <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <label className="text-xs font-semibold text-white/70 block mb-2">
                  Or Write Your Own Custom Subject / Need:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="उदा. रस्ता दुरुस्ती, NOC अर्ज, Transfer order..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-pink"
                  />
                  <Link
                    href={`/tools/letterpad-generator?sub=${encodeURIComponent(customPrompt || 'Official Representation')}`}
                    className="px-4 py-2 rounded-xl bg-brand-pink text-white font-semibold text-xs flex items-center gap-1 hover:bg-brand-pink/90 transition-all shadow-md"
                  >
                    <span>Draft</span>
                    <Send className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Interactive A4 Preview Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-[#0d1017] border border-white/[0.1] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                
                {/* Top Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    <span className="text-xs text-white/40 font-mono ml-2">A4 Canvas Live Preview</span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Sample'}</span>
                  </button>
                </div>

                {/* Subject Block */}
                <div className="mb-4 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-1">
                    Subject / विषय:
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {currentPrompt.subject}
                  </p>
                </div>

                {/* Formatted Body */}
                <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/[0.04] text-white/85 text-xs sm:text-sm leading-relaxed font-serif">
                  <p className="whitespace-pre-line">
                    {currentPrompt.preview}
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                  <div className="text-xs text-white/50 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Formatted with Rajbhasha & CSMOP standards</span>
                  </div>

                  <Link
                    href={buildStudioLaunchUrl(currentPrompt)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-orange text-white text-xs font-semibold shadow-lg hover:shadow-brand-pink/20 hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open in Studio & Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: Featured Letterhead & Profession Presets */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sky/10 border border-brand-sky/20 text-brand-sky text-xs font-semibold uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Profession Presets</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
                Authentic Layouts for Every Authority
              </h2>
            </div>
            
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-sky hover:text-white transition-colors"
            >
              <span>Explore all 17 Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PRESETS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative rounded-3xl bg-[#0d1017] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${item.accent}`} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-brand-orange transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-xs text-white/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.06] mt-6">
                    <Link
                      href={item.href}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] text-center transition-all flex items-center justify-between group/btn"
                    >
                      <span>Launch Template</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION: 3-Step Simple Workflow */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight mb-4">
            How Swalekhani Works
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto mb-16">
            From blank page to print-ready official stationery in 3 frictionless steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="relative p-7 rounded-3xl bg-white/[0.02] border border-white/[0.06] shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange font-mono font-bold text-xl flex items-center justify-center mb-6">
                01
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Choose Header & Layout
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Select your department insignia, emblem, contact ribbons, and bilingual font sizing in the live A4 visual studio.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-7 rounded-3xl bg-white/[0.02] border border-white/[0.06] shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/15 border border-brand-pink/30 text-brand-pink font-mono font-bold text-xl flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Draft with AI or Rich Text
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Use integrated Groq AI to structure paragraphs in Marathi, Hindi, or English, or format manually with dynamic date stamps and paragraph markers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-7 rounded-3xl bg-white/[0.02] border border-white/[0.06] shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-brand-sky/15 border border-brand-sky/30 text-brand-sky font-mono font-bold text-xl flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="text-lg font-heading font-bold text-white mb-2">
                Export PDF or Print Direct
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Download a 100% vector, crystal-clear unwatermarked A4 PDF or print directly onto your pre-printed office bond letterhead paper.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Mid Ad Slot */}
      {adsEnabled && <AdSlot slotKey="home-mid" label="Advertisement" />}

      {/* SECTION: Trust & Compliance Badges */}
      <section className="relative z-10 py-16 sm:py-20 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "100% Client-Side Privacy",
                desc: "Your confidential representations and drafts stay inside your browser without database logging."
              },
              {
                icon: Landmark,
                title: "Rajbhasha & CSMOP Ready",
                desc: "Strictly aligns with Indian Central Secretariat and State Government typographical rules."
              },
              {
                icon: Printer,
                title: "Zero Watermark Export",
                desc: "Export crisp vector PDF documents ready for administrative submission and stamping."
              },
              {
                icon: Zap,
                title: "Sub-Second Groq AI",
                desc: "Draft complex multi-paragraph administrative letters in under 2 seconds with high formality."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <Icon className="w-6 h-6 text-brand-orange mb-3" />
                  <h4 className="font-heading font-semibold text-white text-base mb-1">{feature.title}</h4>
                  <p className="text-xs text-white/55 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION: FAQ */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-white/60">
              Everything you need to know about Swalekhani letterheads and AI drafting.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Swalekhani completely free to use?",
                a: "Yes. Swalekhani is free for citizens, students, advocates, government employees, and small business owners to generate official letterheads, draft letters, and export unwatermarked A4 PDFs."
              },
              {
                q: "Can I print directly onto pre-printed letterhead bond paper?",
                a: "Yes! In the Studio settings, you can toggle 'Hide Headers' off. This keeps your text margins perfectly aligned while printing only your letter body onto your existing pre-printed stationery."
              },
              {
                q: "How accurate is the Marathi and Hindi AI letter drafting?",
                a: "Swalekhani is optimized with specialized Indian administrative prompts, ensuring proper Rajbhasha salutations (मा. महोदय / सविनय सादर), Subject-Reference format, and grammatically precise closing endorsements."
              },
              {
                q: "Are my confidential letters or personal details stored?",
                a: "No. All text editing, formatting, and PDF rendering take place entirely within your local browser session. No personal drafts or contact details are saved to external databases."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-base font-semibold text-white mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-white/65 pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION: Bottom CTA Banner */}
      <section className="relative z-10 py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-brand-orange/20 via-brand-pink/15 to-brand-sky/20 border border-white/[0.15] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-4 tracking-tight">
              Ready to Draft Your Official Letter?
            </h3>
            
            <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-8 font-normal">
              No login required. Choose a template or prompt and start drafting in the Studio immediately.
            </p>

            <Link
              href="/tools/letterpad-generator"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-white text-black font-bold text-base hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <Sparkles className="w-5 h-5 text-brand-orange" />
              <span>Open Swalekhani Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
