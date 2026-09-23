import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle2, Briefcase, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Company Letterhead Maker Online & Business Letterpad Format',
  description: 'Create modern corporate letterheads with Swalekhani, India’s top Company Letterhead Maker Online. Add company logo, CIN/GSTIN numbers, registered office address, and draft official business proposals with AI.',
  keywords: [
    'company letterhead maker online',
    'business letterpad generator',
    'corporate letterhead design online',
    'free company letterpad maker',
    'letterhead design with logo and gstin',
    'official business letterhead format'
  ],
  alternates: {
    canonical: '/templates/company-letterpad',
  },
  openGraph: {
    title: 'Company Letterhead Maker Online & Business Letterpad Format',
    description: 'Design and export professional corporate letterheads with logos, GSTIN details, and AI text composition.',
    url: 'https://swalekhani.vercel.app/templates/company-letterpad',
    images: ['/og/company-letterpad.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Letterhead Maker Online & Business Letterpad Format',
    description: 'Create and download corporate business letterheads with AI-assisted drafting.',
    images: ['/og/company-letterpad.svg'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What statutory information must appear on a company letterhead under Indian law?",
    answer: "Under Section 12(3)(c) of the Companies Act, 2013, every company registered in India must print its Name, Registered Office Address, Corporate Identity Number (CIN), Telephone Number, Fax number (if any), Email address, and Website on all business letters, notices, and official publications."
  },
  {
    question: "Is it mandatory to include the GSTIN on commercial company letterheads?",
    answer: "While CIN is mandatory under corporate law, printing your 15-digit GSTIN on business letterheads is essential for commercial tax compliance, quotations, vendor invoices, work orders, and inter-state purchase contracts."
  },
  {
    question: "How do I upload and position our custom company logo?",
    answer: "In Swalekhani Letterpad Studio, click 'Upload Logo' in the left sidebar. You can place your logo on the top-left, top-right, or top-center with custom width scaling and vertical alignment."
  },
  {
    question: "Can I use this company letterhead for employee Offer Letters and Experience Certificates?",
    answer: "Yes. Swalekhani's integrated AI assistant comes with dedicated prompt shortcuts for drafting formal Offer Letters, Appointment Letters, Relieving & Experience Certificates, Non-Disclosure Agreements (NDAs), and Salary Revision letters."
  },
  {
    question: "What is the standard font size and typography for business letterheads?",
    answer: "Company headers typically use 14pt to 18pt bold modern sans-serif fonts (such as Outfit, DM Sans, or Inter), subheaders in 9pt to 10pt for addresses, and 10.5pt to 11.5pt with 1.4x line spacing for the body text."
  },
  {
    question: "Can I add Director / Signatory DIN numbers to the letterhead?",
    answer: "Yes, you can configure the bottom signature footprint with the Director's full name, designation, Director Identification Number (DIN: 00000000), and digital signature."
  },
  {
    question: "Can startups and LLPs use this letterhead format?",
    answer: "Yes, LLPs can include their LLPIN (Limited Liability Partnership Identification Number) and registered partners, while proprietary startups can format professional trade letterpads."
  },
  {
    question: "Does Swalekhani store our confidential company letters or client data?",
    answer: "No. Swalekhani executes all text rendering, canvas styling, and PDF generation strictly inside your browser's local sandbox. No proprietary business agreements or employee records are sent to database storage."
  },
  {
    question: "How do I download the letterhead in high-resolution vector PDF format?",
    answer: "Click 'Open Company Letterhead Maker', input your company credentials, write or AI-generate your text, and click 'Export PDF' in the top bar. The document downloads immediately in standard A4 print resolution."
  },
  {
    question: "Is there any cost or watermarking on exported PDFs?",
    answer: "No, Swalekhani is completely free to use. All PDF exports are 100% vector-sharp without any watermarks or trial limitations."
  }
];

export default function CompanyLetterpadPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-brand-sky/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-white/80">Company Letterhead</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sky/10 border border-brand-sky/20 text-brand-sky text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate & Business Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Company Letterhead Maker Online
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Create sleek, high-trust corporate letterheads for startups, private limited companies, agencies, and enterprises. Includes logo positioning, CIN & GSTIN headers, and direct vector PDF downloads.
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=company&tpl=B"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky text-white font-semibold text-base shadow-[0_10px_30px_rgba(255,100,50,0.25)] hover:shadow-[0_15px_40px_rgba(255,100,50,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Open Company Letterhead Maker
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              Browse All Presets
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Core Guide Content (300-500 words) */}
        <article className="prose prose-invert max-w-none space-y-8 my-10 text-white/80 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <Briefcase className="w-6 h-6 text-brand-sky" />
              The Standard for Modern Corporate Letterheads
            </h2>
            <p>
              A company letterhead is the primary visual ambassador of your business brand. Whether issuing formal client quotations, employee appointment letters, commercial contracts, or board resolutions, a polished and legally compliant letterhead builds immediate credibility.
            </p>
            <p>
              Under Indian corporate governance norms (Section 12 of Companies Act 2013), statutory disclosures like the <strong>CIN, Registered Office, Official Website, and Email</strong> must be prominently printed. Swalekhani integrates these statutory fields into modern, clean grid layouts with customizable accent colors and crisp typography.
            </p>
          </section>

          {/* Key Checklist */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Essential Components for Business Letterheads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Company Logo & Branding", desc: "High-resolution corporate emblem aligned with brand guidelines." },
                { title: "CIN & GSTIN Numbers", desc: "Statutory identification numbers for commercial & tax compliance." },
                { title: "Registered & Branch Address", desc: "Complete physical address with PIN code and country." },
                { title: "Corporate Contact Details", desc: "Official domain email, telephone board numbers, and website." },
                { title: "Reference & Document Code", desc: "Internal tracking ID for audit trails and filing systems." },
                { title: "Executive Signature Block", desc: "Designation, DIN/PAN (if applicable), and digital signature." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-sky flex-shrink-0 mt-0.5" />
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
              <FileText className="w-5 h-5 text-brand-pink" />
              Corporate Business Letter Sample
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] text-white/90 text-sm leading-relaxed shadow-inner font-sans">
              <div className="flex justify-between items-start border-b border-white/[0.1] pb-4 mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">APEX ENTERPRISE SOLUTIONS PVT. LTD.</h4>
                  <p className="text-xs text-white/60">CIN: U72900KA2021PTC123456 | GSTIN: 29AABCU9603R1Z7</p>
                  <p className="text-xs text-white/50">Level 5, Cyber Park, Electronic City, Bengaluru - 560100</p>
                </div>
                <div className="text-right text-xs text-brand-sky font-medium">
                  <p>contact@apexsolutions.in</p>
                  <p>+91-80-41234567</p>
                </div>
              </div>

              <div className="flex justify-between text-xs text-white/60 mb-4">
                <span>Ref: AES/HR/OFFER/2026/089</span>
                <span>Date: September 23, 2026</span>
              </div>

              <div className="text-xs space-y-1 mb-4">
                <p className="font-semibold text-white">To: Mr. Rohit Verma</p>
                <p>Candidate ID: EMP-2026-441</p>
              </div>

              <p className="text-xs font-bold text-white mb-2">
                Subject: Offer of Employment — Senior Full Stack Engineer
              </p>

              <div className="text-xs space-y-2 text-white/80">
                <p>Dear Rohit,</p>
                <p>We are pleased to extend this offer of employment for the position of Senior Full Stack Engineer at Apex Enterprise Solutions Pvt. Ltd...</p>
              </div>

              <div className="text-right text-xs mt-6 space-y-1">
                <p className="font-semibold text-white">For Apex Enterprise Solutions Pvt. Ltd.</p>
                <p className="text-white/60">[Authorized Signatory]</p>
                <p className="text-white/50">Director of Human Resources</p>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="Company Letterhead Maker Online - Swalekhani"
          description="Create professional corporate letterheads with logos and GSTIN in seconds."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="Company Letterhead FAQs"
          subtitle="Answers to common questions about corporate letterpad design, legal requirements, and PDF generation."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-sky/15 via-white/[0.02] to-brand-pink/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Build Your Corporate Letterhead in Minutes
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            Enter your company details, upload your logo, write with AI, and download a ready-to-print vector PDF.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=company&tpl=B"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-brand-sky" />
            <span>Launch Company Letterhead Studio</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
