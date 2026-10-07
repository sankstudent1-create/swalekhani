"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Sparkles, FileText, FileCheck, Shield, Building2, 
  ArrowRight, CheckCircle2, Landmark, UserCheck, HelpCircle,
  Clock, Award, BookOpen, Layers
} from 'lucide-react';
import AdSlot from '@/components/AdSlot';

interface FormatItem {
  slug: string;
  title: string;
  category: 'Corporate & Admin' | 'HR & Office' | 'Legal & Public' | 'Banking & Utility';
  badge: string;
  desc: string;
  guideUrl?: string;
  generatorUrl: string;
  icon: any;
  image?: string;
  gradient?: string;
  tags: string[];
}

const OFFICIAL_FORMATS: FormatItem[] = [
  {
    slug: 'leave-application',
    title: 'Leave Application (CL / EL / Medical)',
    category: 'HR & Office',
    badge: 'HR Standard',
    desc: 'Standard leave application for Casual Leave, Earned Leave, and Medical absence with charge handover.',
    guideUrl: '/formats/leave-application',
    generatorUrl: '/tools/letterpad-generator?preset=personal&sub=Application%20for%20Sanction%20of%20Earned%20Leave%20(EL)&tpl=A',
    icon: Clock,
    image: '/illustrations/leave-3d.jpg',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    tags: ['Leave Application', 'Casual Leave', 'Earned Leave', 'Medical', 'Employee', 'Corporate HR']
  },
  {
    slug: 'police-complaint',
    title: 'Police Complaint & Formal Grievance Letter',
    category: 'Legal & Public',
    badge: 'CrPC / BNSS Compliant',
    desc: 'Formal representation to Station House Officer (SHO / Police Inspector) for non-cognizable loss, cyber harassment, or nuisance complaints.',
    generatorUrl: '/tools/letterpad-generator?preset=complaint&sub=Complaint%20Regarding%20Lost%20Documents%20/%20Public%20Nuisance',
    icon: Shield,
    image: '/illustrations/police-3d.jpg',
    gradient: 'from-blue-500/20 to-amber-500/10',
    tags: ['Police Complaint', 'SHO', 'NC Complaint', 'Lost Documents', 'FIR Intimation']
  },
  {
    slug: 'advocate-legal-notice',
    title: 'Advocate Formal Legal Notice Letterhead',
    category: 'Legal & Public',
    badge: 'Bar Council Standard',
    desc: 'Structured legal notice framework with client instructions recital, factual matrix, statutory warning, and notice period.',
    generatorUrl: '/tools/letterpad-generator?template=advocate',
    icon: FileText,
    image: '/illustrations/advocate-3d.jpg',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    tags: ['Advocate', 'Legal Notice', 'Bar Council', 'Demand Notice', 'Court Practice']
  },
  {
    slug: 'office-order',
    title: 'Office Order & Admin Circular Format',
    category: 'Corporate & Admin',
    badge: 'Corporate Standard',
    desc: 'Formal administrative Office Order for transfers, duty allocations, and internal committees.',
    guideUrl: '/formats/office-order',
    generatorUrl: '/tools/letterpad-generator?preset=corporate&sub=OFFICE%20ORDER%20-%20Administrative%20Sanction&tpl=A',
    icon: Award,
    gradient: 'from-sky-500/20 to-blue-500/10',
    tags: ['Office Order', 'Transfer Order', 'Admin Directive', 'Bilingual']
  },
  {
    slug: 'rti-application',
    title: 'RTI Application (Form A) / माहिती अधिकार अर्ज',
    category: 'Legal & Public',
    badge: 'RTI Act 2005 (Sec 6(1))',
    desc: 'Statutory Right to Information (RTI) application format for Central and State Public Information Officers (PIO) in English & Marathi.',
    guideUrl: '/formats/rti-application',
    generatorUrl: '/tools/letterpad-generator?preset=rti&sub=Application%20under%20Section%206(1)%20of%20RTI%20Act%202005&tpl=A',
    icon: Shield,
    gradient: 'from-indigo-500/20 to-purple-500/10',
    tags: ['RTI', 'Right to Information', 'Section 6(1)', 'PIO', 'BPO', 'माहिती अधिकार']
  },
  {
    slug: 'consumer-complaint',
    guideUrl: '/formats/complaint-letter',
    title: 'Consumer Complaint Letter',
    category: 'Legal & Public',
    badge: 'Consumer Rights Format',
    desc: 'Formal complaint format for defective products, poor service, billing disputes, and warranty claims.',
    generatorUrl: '/tools/letterpad-generator?preset=complaint&sub=Complaint%20Regarding%20Defective%20Product%20/%20Deficient%20Service',
    icon: Landmark,
    gradient: 'from-amber-600/20 to-orange-500/10',
    tags: ['Consumer Complaint', 'Defective Product', 'Warranty Claim', 'Service Grievance']
  },
  {
    slug: 'bank-representation',
    title: 'Bank Application (Account, KYC, Address Update)',
    category: 'Banking & Utility',
    badge: 'Banking Ombudsman Format',
    desc: 'Official bank manager correspondence for account transfer, signature modification, stop cheque, and loan documentation.',
    generatorUrl: '/tools/letterpad-generator?preset=personal&sub=Application%20for%20Change%20of%20Address%20and%20Contact%20Details%20in%20Bank%20Account',
    icon: Building2,
    gradient: 'from-cyan-500/20 to-blue-500/10',
    tags: ['Bank Application', 'KYC Update', 'Branch Manager', 'Account Transfer', 'Cheque Stop']
  },
  {
    slug: 'electricity-complaint',
    title: 'Electricity Complaint Letter',
    category: 'Banking & Utility',
    badge: 'Consumer Grievance Format',
    desc: 'Application to the electricity provider regarding faulty meters, excessive billing, and new power connection.',
    generatorUrl: '/tools/letterpad-generator?preset=complaint&sub=Application%20for%20Rectification%20of%20Faulty%20Electricity%20Meter%20and%20Billing',
    icon: FileCheck,
    gradient: 'from-yellow-500/20 to-amber-500/10',
    tags: ['Electricity Complaint', 'Meter Dispute', 'Consumer Grievance', 'Power Connection']
  },
  {
    slug: 'school-bonafide',
    title: 'School & College Bonafide Certificate Format',
    category: 'HR & Office',
    badge: 'Academic Board Standard',
    desc: 'Standard Bonafide & Character certificate template for educational institutes, student concession, and scholarship verification.',
    generatorUrl: '/tools/letterpad-generator?preset=school&tpl=D',
    icon: UserCheck,
    gradient: 'from-teal-500/20 to-emerald-500/10',
    tags: ['Bonafide Certificate', 'Character Certificate', 'School', 'College Affiliation']
  }
];

const CATEGORIES = ["All", "Corporate & Admin", "HR & Office", "Legal & Public", "Banking & Utility"];

export default function FormatsIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  const filteredFormats = useMemo(() => {
    return OFFICIAL_FORMATS.filter((fmt) => {
      const matchesSearch = 
        fmt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fmt.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fmt.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fmt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === "All" || fmt.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-slate-900 pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-brand-sky/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Official Formats Library</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Statutory & Administrative Standard Formats</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            Official Indian Letter Formats & Drafting Guides
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Standardized formats for Corporate applications, RTI, Leave letters, Office Orders, and Complaint letters with instant AI drafting.
          </p>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="formats-top" label="Sponsored Content" />}

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-10 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formats (e.g. Leave, RTI, Complaint, Office Order, Police)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors shadow-lg"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/[0.03] text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormats.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <div
                key={fmt.slug}
                className="group relative rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1.5"
              >
                {/* 3D Illustration Banner or Vibrant Gradient Header */}
                {fmt.image ? (
                  <div className="relative h-44 w-full overflow-hidden bg-black/60 border-b border-slate-200">
                    <img 
                      src={fmt.image} 
                      alt={fmt.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-[#0d1017]/40 to-transparent"></div>
                    <div className="absolute top-3.5 right-3.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 bg-black/70 backdrop-blur-md text-emerald-700 uppercase tracking-wide shadow-md">
                        {fmt.badge}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={`h-24 w-full bg-gradient-to-br ${fmt.gradient || 'from-emerald-500/10 to-transparent'} border-b border-slate-200 p-4 flex items-center justify-between`}>
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-slate-200 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 uppercase tracking-wide">
                      {fmt.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                        {fmt.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {fmt.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {fmt.desc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {fmt.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200 mt-4 flex items-center gap-2.5">
                    {fmt.guideUrl ? (
                      <>
                        <Link
                          href={fmt.guideUrl}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-900 text-xs font-semibold border border-slate-200 text-center transition-all flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                          <span>Read Guide</span>
                        </Link>
                        <Link
                          href={fmt.generatorUrl}
                          className="py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 text-xs font-semibold border border-emerald-500/30 text-center transition-all flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        href={fmt.generatorUrl}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 text-xs font-semibold border border-emerald-500/30 text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Open in Studio & Draft</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFormats.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl bg-white border border-slate-200">
            <p className="text-slate-500 text-sm">No formats matched &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* FAQs */}
        <section className="mt-20 max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-2">
              Frequently Asked Questions on Official Formats
            </h2>
            <p className="text-sm text-slate-500">
              Guidance on statutory compliance, Marathi / Hindi Devanagari drafting, and legal standards.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What makes Swalekhani's formats professional and compliant?",
                a: "All formats follow standard Indian business correspondence conventions, including standard file numbering, Subject-Reference alignment, numbered paragraphs, and appropriate closing endorsements."
              },
              {
                q: "Can I draft applications directly in Marathi (मराठी) or Hindi (हिन्दी)?",
                a: "Yes. Swalekhani features native Devanagari font engines and AI prompt assistants that produce authentic, high-formality Marathi and Hindi official drafts ready for print."
              },
              {
                q: "How do I download or print the completed document?",
                a: "Once you draft your letter in the Studio, click 'Download PDF' for an unwatermarked, high-resolution vector A4 PDF, or 'Print' to send directly to your connected office letterhead printer."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-slate-500 pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
