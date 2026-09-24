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
  category: 'Government & Admin' | 'HR & Office' | 'Legal & Public' | 'Banking & Utility';
  badge: string;
  desc: string;
  guideUrl?: string;
  generatorUrl: string;
  icon: any;
  tags: string[];
}

const OFFICIAL_FORMATS: FormatItem[] = [
  {
    slug: 'leave-application',
    title: 'Official Leave Application (CL / EL / Medical)',
    category: 'HR & Office',
    badge: 'CCS Leave Rules 1972',
    desc: 'Standard administrative leave application for Casual Leave, Earned Leave, and Medical absence with station leave permission.',
    guideUrl: '/formats/leave-application',
    generatorUrl: '/tools/letterpad-generator?preset=leave&sub=Application%20for%20Sanction%20of%20Earned%20Leave%20(EL)&tpl=A',
    icon: Clock,
    tags: ['Leave Application', 'Casual Leave', 'Earned Leave', 'Medical', 'Govt Employee', 'Corporate HR']
  },
  {
    slug: 'office-order',
    title: 'Official Office Order & Admin Circular Format',
    category: 'Government & Admin',
    badge: 'Central Secretariat CSMOP',
    desc: 'Formal administrative Office Order for transfers, duty allocations, pay fixations, and departmental committees.',
    guideUrl: '/formats/office-order',
    generatorUrl: '/tools/letterpad-generator?preset=dop&sub=OFFICE%20ORDER%20-%20Administrative%20Sanction&tpl=A',
    icon: Award,
    tags: ['Office Order', 'CSMOP', 'Transfer Order', 'Admin Directive', 'Bilingual']
  },
  {
    slug: 'rti-application',
    title: 'RTI Application (Form A) / माहिती अधिकार अर्ज',
    category: 'Legal & Public',
    badge: 'RTI Act 2005 (Sec 6(1))',
    desc: 'Statutory Right to Information (RTI) application format for Central and State Public Information Officers (PIO) in English & Marathi.',
    guideUrl: '/formats/rti-application',
    generatorUrl: '/tools/letterpad-generator?preset=custom&sub=Application%20under%20Section%206(1)%20of%20RTI%20Act%202005&tpl=A',
    icon: Shield,
    tags: ['RTI', 'Right to Information', 'Section 6(1)', 'PIO', 'BPO', 'माहिती अधिकार']
  },
  {
    slug: 'gram-panchayat-complaint',
    title: 'Gram Panchayat Public Representation / तक्रार अर्ज',
    category: 'Government & Admin',
    badge: 'Panchayati Raj Act',
    desc: 'Formal public application format to Sarpanch and Gram Sevak for village infrastructure, street lights, water supply, and road repair.',
    generatorUrl: '/tools/letterpad-generator?template=gram-panchayat&sub=%E0%A4%B0%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A4%BE%20%E0%A4%B5%20%E0%A4%AA%E0%A4%A5%E0%A4%A6%E0%A4%BF%E0%A4%B5%E0%A5%87%20%E0%A4%A6%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%80%E0%A4%AC%E0%A4%BE%E0%A4%AC%E0%A4%A4%20%E0%A4%85%E0%A4%B0%E0%A5%8D%E0%A4%9C',
    icon: Landmark,
    tags: ['Gram Panchayat', 'Sarpanch', 'Gram Sevak', 'Village Grievance', 'मराठी अर्ज']
  },
  {
    slug: 'police-complaint',
    title: 'Police Complaint & Formal Grievance Letter',
    category: 'Legal & Public',
    badge: 'CrPC / BNSS Compliant',
    desc: 'Formal representation to Station House Officer (SHO / Police Inspector) for non-cognizable loss, cyber harassment, or nuisance complaints.',
    generatorUrl: '/tools/letterpad-generator?preset=custom&sub=Complaint%20Regarding%20Lost%20Documents%20/%20Public%20Nuisance',
    icon: Shield,
    tags: ['Police Complaint', 'SHO', 'NC Complaint', 'Lost Documents', 'FIR Intimation']
  },
  {
    slug: 'bank-representation',
    title: 'Bank Application (Account, KYC, Address Update)',
    category: 'Banking & Utility',
    badge: 'Banking Ombudsman Format',
    desc: 'Official bank manager correspondence for account transfer, signature modification, stop cheque, and loan documentation.',
    generatorUrl: '/tools/letterpad-generator?preset=custom&sub=Application%20for%20Change%20of%20Address%20and%20Contact%20Details%20in%20Bank%20Account',
    icon: Building2,
    tags: ['Bank Application', 'KYC Update', 'Branch Manager', 'Account Transfer', 'Cheque Stop']
  },
  {
    slug: 'mahavitaran-electricity',
    title: 'Electricity Board / Mahavitaran Complaint Letter',
    category: 'Banking & Utility',
    badge: 'Electricity Consumer Code',
    desc: 'Application to Assistant Engineer (MSEDCL / Electricity Board) regarding faulty meters, excessive billing, and new power connection.',
    generatorUrl: '/tools/letterpad-generator?preset=custom&sub=Application%20for%20Rectification%20of%20Faulty%20Electricity%20Meter%20and%20Billing',
    icon: FileCheck,
    tags: ['Mahavitaran', 'Electricity Board', 'Meter Dispute', 'Consumer Grievance', 'Power Connection']
  },
  {
    slug: 'advocate-legal-notice',
    title: 'Advocate Formal Legal Notice Letterhead',
    category: 'Legal & Public',
    badge: 'Bar Council Standard',
    desc: 'Structured legal notice framework with client instructions recital, factual matrix, statutory warning, and notice period.',
    generatorUrl: '/tools/letterpad-generator?template=advocate',
    icon: FileText,
    tags: ['Advocate', 'Legal Notice', 'Bar Council', 'Demand Notice', 'Court Practice']
  },
  {
    slug: 'school-bonafide',
    title: 'School & College Bonafide Certificate Format',
    category: 'HR & Office',
    badge: 'Academic Board Standard',
    desc: 'Standard Bonafide & Character certificate template for educational institutes, student concession, and scholarship verification.',
    generatorUrl: '/tools/letterpad-generator?preset=school&tpl=D',
    icon: UserCheck,
    tags: ['Bonafide Certificate', 'Character Certificate', 'School', 'College Affiliation']
  }
];

const CATEGORIES = ["All", "Government & Admin", "HR & Office", "Legal & Public", "Banking & Utility"];

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
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-brand-sky/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/80">Official Formats Library</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Statutory & Administrative Standard Formats</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Official Indian Letter Formats & Drafting Guides
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Standardized, legally compliant formats for Government applications, RTI, Leave letters, Office Orders, and Public Representations with instant AI drafting.
          </p>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="formats-top" label="Sponsored Content" />}

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-10 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formats (e.g. Leave, RTI, Gram Panchayat, Office Order, Police)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 transition-colors shadow-lg"
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
                    : 'bg-white/[0.03] text-white/70 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
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
                className="group relative rounded-3xl bg-[#0d1017] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider font-mono">
                      {fmt.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 uppercase tracking-wide">
                      {fmt.badge}
                    </span>
                  </div>

                  {/* Header Title with Icon */}
                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {fmt.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                    {fmt.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {fmt.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-white/40 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/[0.06] mt-6 flex items-center gap-2.5">
                  {fmt.guideUrl ? (
                    <>
                      <Link
                        href={fmt.guideUrl}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-white/60" />
                        <span>Read Guide</span>
                      </Link>
                      <Link
                        href={fmt.generatorUrl}
                        className="py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Draft</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={fmt.generatorUrl}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open in Studio & Draft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFormats.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-white/60 text-sm">No formats matched &quot;{searchQuery}&quot;.</p>
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
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
              Frequently Asked Questions on Official Formats
            </h2>
            <p className="text-sm text-white/60">
              Guidance on statutory compliance, Marathi / Hindi Devanagari drafting, and legal standards.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What makes Swalekhani's official formats compliant with Indian government rules?",
                a: "All formats follow the Central Secretariat Manual of Office Procedure (CSMOP) and State Government Rajbhasha guidelines, including standard file numbering, Subject-Reference alignment, numbered paragraphs, and appropriate closing endorsements."
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
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-base font-semibold text-white mb-2 flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-white/65 pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
