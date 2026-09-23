import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, ArrowRight, CheckCircle2, BookOpen, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'School Letterhead Format | Principal & College Letterpad Generator - Swalekhani',
  description: 'Download and create official School Letterhead Formats online. Standard CBSE/ICSE/State Board school and college letterpads for Bonafide Certificates, Character Certificates, NOC, and Principal letters.',
  keywords: [
    'school letterhead format',
    'principal letterpad format',
    'college letterhead maker online',
    'bonafide certificate letterhead',
    'school transfer certificate letterhead format',
    'cbse school letter pad design'
  ],
  alternates: {
    canonical: '/templates/school-letterpad',
  },
  openGraph: {
    title: 'School Letterhead Format | Swalekhani',
    description: 'Design official school and college letterheads with affiliation numbers, school motto, and AI drafting.',
    url: 'https://www.swalekhani.com/templates/school-letterpad',
    images: ['/icon-512.png'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Letterhead Format | Swalekhani',
    description: 'Official academic letterpad generator for schools, colleges, and university departments.',
    images: ['/icon-512.png'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What details should be included on a school or college letterhead?",
    answer: "A standard school letterhead includes the school/trust name, school crest/emblem, motto (e.g. विद्या ददाति विनयं), affiliation details (e.g., Affiliated to CBSE, Affiliation No. & School Code), complete campus address, contact numbers, official school email, and website."
  },
  {
    question: "Can I generate Bonafide and Character Certificates using this template?",
    answer: "Yes. Swalekhani includes pre-built AI prompt shortcuts for generating student Bonafide Certificates, Character & Conduct Certificates, NOC for Passport / Visa, and Fee Structure certificates."
  },
  {
    question: "Can school administrators add dual bilingual mottos in Sanskrit/Hindi and English?",
    answer: "Yes, Swalekhani's Template A provides dedicated Sanskrit/Devanagari motto rows at the top with English academic names below."
  }
];

export default function SchoolLetterpadPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-emerald-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-white/80">School Letterhead</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic & Institutional Format</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            School Letterhead Format & Principal Letterpad Maker
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Format authentic school and college letterheads with educational emblems, CBSE/ICSE board affiliation codes, Sanskrit motto lines, and official certificate templates.
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=school&tpl=A"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white font-semibold text-base shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generate School Letterhead
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              View Other Templates
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Core Guide Content (300-500 words) */}
        <article className="prose prose-invert max-w-none space-y-8 my-10 text-white/80 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              Academic Standards for School & College Letterheads
            </h2>
            <p>
              Educational institutions issue dozens of high-stakes documents every week — including bonafide letters for student concessions, passport verifications, fee receipts, recommendation letters for foreign universities, and inter-school sports nominations.
            </p>
            <p>
              An authentic school letterhead must establish clear authority with the <strong>Affiliation Body (CBSE, CISCE, State Board, UGC, AICTE)</strong> and registration codes. Swalekhani provides educational institutions with balanced typographical hierarchy, emblem placeholders, and instant AI certificate generators.
            </p>
          </section>

          {/* Mandatory Details */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Key Requirements for Academic Letterpads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "School Crest / Motto", desc: "Traditional motto in Sanskrit/Hindi paired with the institutional logo." },
                { title: "Board Affiliation Code", desc: "Official board affiliation number (e.g., CBSE Affil. No. 2130000)." },
                { title: "Office of the Principal", desc: "Designation line indicating issuing department or dean's office." },
                { title: "Campus Contact & Email", desc: "Verified institutional domain email and front desk phone numbers." },
                { title: "Student Identifiers", desc: "Dedicated placeholders for Roll No., Admission No., and Academic Class." },
                { title: "Principal's Seal & Signature", desc: "Designated footprint for physical or digital rubber stamp and signature." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
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
              <FileText className="w-5 h-5 text-emerald-400" />
              Sample School Bonafide Certificate
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] text-white/90 text-sm leading-relaxed shadow-inner font-serif">
              <div className="text-center border-b border-white/[0.1] pb-4 mb-4">
                <p className="text-xs text-amber-300 font-semibold">विद्या ददाति विनयं</p>
                <h4 className="text-lg font-bold text-white tracking-wide">DELHI MODEL PUBLIC ACADEMY</h4>
                <p className="text-xs text-white/60">(Affiliated to CBSE, New Delhi | Affiliation No: 2730198 | School Code: 85210)</p>
                <p className="text-xs text-white/50">Sector 12, Institutional Area, New Delhi - 110075 | Tel: 011-28080000</p>
              </div>

              <div className="flex justify-between text-xs text-white/60 mb-4 font-mono">
                <span>Ref: DMPA/BON/2026/1042</span>
                <span>Date: 23-09-2026</span>
              </div>

              <div className="text-center my-4">
                <span className="font-bold text-sm tracking-wider uppercase border-b-2 border-emerald-400 pb-0.5">
                  TO WHOMSOEVER IT MAY CONCERN
                </span>
              </div>

              <p className="text-xs leading-relaxed text-white/85 mb-4">
                This is to certify that <strong>Master Aarav Sharma</strong>, S/o Shri Rajesh Sharma, is a bonafide student of this institution currently studying in <strong>Class X, Section B</strong> (Admission No. 8924) during the academic year 2026-2027.
              </p>
              <p className="text-xs text-white/80 mb-6">
                As per school records, his date of birth is 14th August 2011. He bears good moral character and conduct.
              </p>

              <div className="flex justify-between items-end text-xs pt-4">
                <p className="text-white/40">[School Round Seal]</p>
                <div className="text-right">
                  <p className="font-bold text-white">Principal</p>
                  <p className="text-white/50">Delhi Model Public Academy</p>
                </div>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="School Letterhead Format & Maker - Swalekhani"
          description="Create official school and college letterpads with affiliation details in seconds."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="School Letterhead FAQs"
          subtitle="Everything principals and administrators need to know about academic letterpad templates."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-white/[0.02] to-sky-500/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Create Your School Letterhead Now
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            Customize school name, affiliation numbers, logos, and issue certificates in print-ready PDF format.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=school&tpl=A"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Open School Letterhead Studio</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
