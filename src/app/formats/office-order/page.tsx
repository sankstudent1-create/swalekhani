import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileBadge, ArrowRight, CheckCircle2, Building, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Office Order Format | Official Government & Corporate Order Maker - Swalekhani',
  description: 'Download and create official Office Order Formats online. Standard formats for Government of India ministries, PSUs, and corporate companies for Employee Transfers, Postings, Sanctions, and Promotions.',
  keywords: [
    'office order format',
    'sarkari office order format',
    'government transfer office order format',
    'office order format for employee promotion',
    'office order format in hindi and english',
    'sample office order format pdf'
  ],
  alternates: {
    canonical: '/formats/office-order',
  },
  openGraph: {
    title: 'Office Order Format | Swalekhani',
    description: 'Create standardized government and corporate office orders with endorsement copies and AI drafting.',
    url: 'https://www.swalekhani.com/formats/office-order',
    images: ['/icon-512.png'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office Order Format | Swalekhani',
    description: 'Official office order format generator for government ministries, departments, and corporate offices.',
    images: ['/icon-512.png'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is an Office Order and when is it issued in government offices?",
    answer: "An Office Order is an internal administrative instruction issued by a competent authority to convey decisions relating to internal administration, employee appointments, transfers, postings, grant of regular leave, distribution of work, disciplinary sanctions, and promotions."
  },
  {
    question: "How does an Office Order differ from an Official Memorandum (OM)?",
    answer: "An Office Order deals primarily with internal day-to-day personnel and establishment matters (transfers, leave, duties) affecting employees within the organization, whereas an Office Memorandum (OM) communicates policy decisions, clarifications, or inter-departmental inquiries."
  },
  {
    question: "Is an Endorsement (पृष्ठांकन) block required on an Office Order?",
    answer: "Yes, an Office Order almost always ends with an Endorsement block (Copy forwarded to...) distributing official copies to the concerned official, accounts branch (DDO), personnel file, and vigilance department."
  },
  {
    question: "Can Swalekhani generate bilingual Office Orders in Hindi and English?",
    answer: "Yes, Swalekhani natively formats bilingual headers (कार्यालय आदेश / OFFICE ORDER) with appropriate Devanagari typography and standard Indian administrative phrasing."
  }
];

export default function OfficeOrderPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-violet-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Formats</Link>
          <span>/</span>
          <span className="text-white/80">Office Order Format</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <FileBadge className="w-3.5 h-3.5" />
            <span>Administrative Orders & Establishment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Official Office Order Format & Generator
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Standard format for government and corporate office orders covering transfers, postings, promotions, work allocations, and sanctions with auto-formatted endorsement blocks.
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=office_order&sub=OFFICE%20ORDER%20NO.%2012/2026&tpl=A"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white font-semibold text-base shadow-[0_10px_30px_rgba(139,92,246,0.25)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generate Office Order in Studio
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              All Formats
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Core Guide Content (300-500 words) */}
        <article className="prose prose-invert max-w-none space-y-8 my-10 text-white/80 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <Building className="w-6 h-6 text-violet-400" />
              Structure & Rules of an Official Office Order
            </h2>
            <p>
              In Central and State Government secretariats, public sector undertakings, and corporate establishments, an <strong>Office Order (कार्यालय आदेश)</strong> is the authoritative instrument used to regulate personnel administration.
            </p>
            <p>
              Unlike a conversational business letter, an Office Order is written in the <strong>third person (passive voice)</strong> and opens directly with the operative decision (e.g. <em>"Sanction of the Competent Authority is hereby conveyed for..."</em>). It does not include formal salutations ("Sir/Madam") or conversational closings ("Yours faithfully"), concluding instead with the issuing authority's designation and an endorsement block.
            </p>
          </section>

          {/* Key Checklist */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Anatomy of a Compliant Office Order
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Header & File Number", desc: "Issuing Ministry/Department header with specific order serial number." },
                { title: "Bold Center Title", desc: "Prominent 'OFFICE ORDER' / 'कार्यालय आदेश' title centered on the page." },
                { title: "Direct Operative Text", desc: "No salutation; starts immediately with the sanction or transfer order." },
                { title: "Competent Authority Citation", desc: "Mentions prior approval from the Secretary, Director, or Board." },
                { title: "Issuing Officer Block", desc: "Signature, Name, Designation, and official phone/email of the officer." },
                { title: "Endorsement Block (पृष्ठांकन)", desc: "Numbered list of internal and external departments receiving copies." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Formatted Sample */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Standard Office Order Sample
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] text-white/90 text-sm leading-relaxed shadow-inner font-serif">
              <div className="text-center border-b border-white/[0.1] pb-4 mb-4">
                <p className="text-xs text-amber-300 font-semibold">भारत सरकार / GOVERNMENT OF INDIA</p>
                <h4 className="text-base font-bold text-white tracking-wide">कार्मिक एवं प्रशिक्षण विभाग / DEPARTMENT OF PERSONNEL & TRAINING</h4>
                <p className="text-xs text-white/60">North Block, New Delhi - 110001</p>
              </div>

              <div className="flex justify-between text-xs text-white/60 mb-4 font-mono">
                <span>File No. A-22012/1/2026-Estt.(A)</span>
                <span>Dated: 23rd September, 2026</span>
              </div>

              <div className="text-center my-4">
                <span className="font-bold text-base tracking-wider uppercase border-b-2 border-violet-400 pb-0.5">
                  OFFICE ORDER NO. 45 / 2026
                </span>
              </div>

              <div className="text-xs space-y-3 leading-relaxed text-white/85 mb-6 font-sans">
                <p>
                  1. Consequent upon the recommendations of the Departmental Screening Committee, the Competent Authority is pleased to order the transfer and posting of <strong>Shri Amit Kumar</strong>, Section Officer (Emp ID: 4920), from Vigilance Division to Administration Division with immediate effect.
                </p>
                <p>
                  2. The officer shall report to the Under Secretary (Admin) on or before 28th September 2026 (Forenoon).
                </p>
              </div>

              <div className="text-right text-xs pt-2">
                <p className="font-bold text-white">[S. K. Mukherjee]</p>
                <p className="text-white/60">Under Secretary to the Government of India</p>
                <p className="text-white/50">Tel: 011-23092000</p>
              </div>

              <div className="border-t border-white/[0.1] mt-6 pt-4 text-xs font-sans text-white/70">
                <p className="font-bold text-white mb-2">Copy forwarded for information and necessary action to:</p>
                <ol className="list-decimal pl-5 space-y-1 text-xs">
                  <li>Officer concerned.</li>
                  <li>Drawing and Disbursing Officer (DDO), Administration Division.</li>
                  <li>Pay & Accounts Office (PAO), North Block.</li>
                  <li>Personal File / Guard File.</li>
                </ol>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="Office Order Format & Generator - Swalekhani"
          description="Create government and corporate office orders with endorsement blocks in seconds."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="Office Order FAQs"
          subtitle="Key procedural rules for drafting and issuing official office orders."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-violet-500/15 via-white/[0.02] to-pink-500/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Draft an Official Office Order in Minutes
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            Preloaded with government typography, endorsement copy-to lists, and AI instant order composition.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=office_order&sub=OFFICE%20ORDER%20NO.%2012/2026&tpl=A"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Open Office Order Studio</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
