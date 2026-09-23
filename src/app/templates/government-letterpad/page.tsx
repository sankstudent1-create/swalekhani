import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Landmark, ArrowRight, CheckCircle2, Shield, FileText, Sparkles, Copy, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Government Office Letterpad Format & Official GoI Maker',
  description: 'Download and create official Government Office Letterpad Formats online. Standard Government of India (GoI), Ministry, and State Department bilingual letterheads with Ashoka Emblem, File Numbering, and AI drafting.',
  keywords: [
    'government office letterpad format',
    'government letterhead maker online',
    'official government letter format india',
    'bilingual government letterpad',
    'ashoka emblem letterhead format',
    'sarkari letter pad format'
  ],
  alternates: {
    canonical: '/templates/government-letterpad',
  },
  openGraph: {
    title: 'Government Office Letterpad Format & Official GoI Maker',
    description: 'Create standardized Government of India and State Department letterheads with national emblems and AI assistance.',
    url: 'https://swalekhani.vercel.app/templates/government-letterpad',
    images: ['/og/government-letterpad.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Office Letterpad Format & Official GoI Maker',
    description: 'Standard Government of India and State Department bilingual letterhead generator.',
    images: ['/og/government-letterpad.svg'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is the standard Government Office Letterpad format in India?",
    answer: "A standard Government of India (GoI) letterpad follows a strict bilingual hierarchy: Line 1 in Hindi (e.g., भारत सरकार), Line 2 with the Ministry/Department, followed by the English equivalents. The State Emblem of India (Ashoka Lion Capital with Satyameva Jayate) is placed at the top-center or top-left, with File Reference Number on the left and Date on the right."
  },
  {
    question: "Is bilingual (Hindi & English) header mandatory for Central Government letters?",
    answer: "Yes. Under the Official Languages Act, 1963 and the Central Secretariat Manual of Office Procedure (CSMOP), all Central Government ministries, subordinate offices, and public sector undertakings must use bilingual letterheads (Devanagari on top/left, English below/right)."
  },
  {
    question: "What are the key differences between an Official Letter, DO Letter, and Office Memorandum (OM)?",
    answer: "An Official Letter is formal departmental correspondence to external agencies or subordinate offices. A Demi-Official (DO) letter is written between officers on a first-name basis to draw personal attention. An Office Memorandum (OM) conveys policy decisions or inter-ministerial views in the third person without formal salutations."
  },
  {
    question: "How should the State Emblem (Ashoka Lion Capital) be placed on an official letterhead?",
    answer: "As per the State Emblem of India (Prohibition of Improper Use) Act, the Lion Capital must be placed at the top-center (Template B/C) or top-left (Template A) of the letterpad, accompanied by the motto 'सत्यमेव जयते' in Devanagari script."
  },
  {
    question: "What is the correct way to write a File Number (पत्रांक) on a government letter?",
    answer: "The File Number should follow the standard departmental scheme: [Subject Code]-[Serial No.]/[Year]-[Section Code] (e.g., File No. 17-02/2026-Estt.). It is placed on the top-left margin above the recipient address."
  },
  {
    question: "What is the proper salutation and subscription for official correspondence?",
    answer: "For standard official letters, the salutation is 'Sir' or 'Madam' (महोदय/महोदया) and the subscription closing is 'Yours faithfully' (भवदीय). In Demi-Official letters, informal salutations like 'Dear Shri [Surname]' and closings like 'Yours sincerely' are used."
  },
  {
    question: "How are Endorsement (पृष्ठांकन) and Copy-To sections formatted?",
    answer: "The endorsement block appears below the signatory on the left margin, headlined with 'Copy forwarded for information and necessary action to:' followed by numbered departmental recipients and ending with a second signature of the issuing authority."
  },
  {
    question: "Can I customize the ministry name, department, and contact ribbon on Swalekhani?",
    answer: "Yes, Swalekhani allows full real-time customization of Hindi and English ministry titles, division names, office address, contact telephone numbers, official email IDs, and national or state emblems."
  },
  {
    question: "How does Swalekhani's AI assistant draft official government letters?",
    answer: "Swalekhani integrates advanced Groq LLMs fine-tuned on administrative conventions. You simply provide a brief topic (e.g., 'Request for cadre restructuring sanction'), and the AI drafts a complete, numbered official letter in flawless administrative English or Hindi."
  },
  {
    question: "How do I print or export the letterpad as PDF without watermarks?",
    answer: "Click 'Generate with Swalekhani', customize your letter on the live A4 paper canvas, and click 'Export PDF' in the top action bar. The system renders a pixel-perfect, vector A4 PDF directly in your browser without any watermark or fee."
  }
];

export default function GovernmentLetterpadPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-brand-orange/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-white/80">Government Office Letterpad</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <Landmark className="w-3.5 h-3.5" />
            <span>Central & State Government Standard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Government Office Letterpad Format & Generator
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Standardized, bilingual letterhead format for Government of India ministries, state administrative departments, and statutory bodies. Complies with the Central Secretariat Manual of Office Procedure (CSMOP).
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=dop&tpl=A"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky text-white font-semibold text-base shadow-[0_10px_30px_rgba(255,100,50,0.25)] hover:shadow-[0_15px_40px_rgba(255,100,50,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generate with Swalekhani
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              Explore All Templates
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Core Guide Content (300-500 words) */}
        <article className="prose prose-invert max-w-none space-y-8 my-10 text-white/80 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-brand-orange" />
              Understanding Government Office Letterhead Standards
            </h2>
            <p>
              In official Indian public administration, correspondence carries administrative, evidentiary, and legal weight. Whether issuing an official memorandum (OM), inter-ministerial communication, or public notice, formatting must adhere to the <strong>Central Secretariat Manual of Office Procedure (CSMOP)</strong>.
            </p>
            <p>
              An authentic government letterpad distinguishes itself through crisp dual-language alignment (राजभाषा हिंदी and English), the official placement of the Ashoka Lion Capital insignia, standard font geometry, and demarcated metadata blocks for File Numbering, Dispatch Dates, Subject-Reference hierarchies, and Endorsement structures.
            </p>
          </section>

          {/* Required Elements Grid */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Mandatory Elements in a Government Letterpad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Bilingual Header", desc: "Top Hindi header followed by English ministry & department names." },
                { title: "National Emblem", desc: "Ashoka Lion Capital with 'सत्यमेव जयते' placed centrally or on left." },
                { title: "File Number (पत्रांक)", desc: "Unique departmental file reference code aligned to the top-left." },
                { title: "Date & Station", desc: "Dispatch location and formatted date aligned opposite to file number." },
                { title: "To Address & Designation", desc: "Formal designation and address of the recipient." },
                { title: "Subject & Reference Block", desc: "Underlined or bold subject summary with prior sanction citations." },
                { title: "Numbered Paragraphs", desc: "Substantive letter body structured in sequentially numbered paras." },
                { title: "Endorsement & Copy-To", desc: "List of subordinate or related officers receiving copies." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Visual Sample Box */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-sky" />
              Standard Government Letterhead Sample
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] font-serif text-white/90 text-sm leading-relaxed shadow-inner">
              <div className="text-center border-b border-white/[0.1] pb-4 mb-4">
                <p className="font-semibold text-base text-amber-300">भारत सरकार / GOVERNMENT OF INDIA</p>
                <p className="text-sm">संचार मंत्रालय / MINISTRY OF COMMUNICATIONS</p>
                <p className="text-xs text-white/60">डाक विभाग / DEPARTMENT OF POSTS</p>
                <p className="text-xs text-white/50">डाक भवन, संसद मार्ग, नई दिल्ली - 110001</p>
              </div>

              <div className="flex justify-between text-xs font-mono text-white/70 mb-4">
                <span>File No. 17-02/2026-Estt.</span>
                <span>Dated: 23rd September, 2026</span>
              </div>

              <div className="text-xs space-y-1 mb-4">
                <p className="font-bold">To,</p>
                <p>All Heads of Postal Circles,</p>
                <p>Chief Postmasters General / Postmasters General.</p>
              </div>

              <p className="text-xs font-bold mb-3">
                Subject: Implementation of Digital Letterpad & Official Drafting Framework — Regarding.
              </p>

              <div className="text-xs space-y-2 text-white/80 font-sans">
                <p>Sir / Madam,</p>
                <p>1. I am directed to invite your kind attention to the subject cited above and convey administrative approval...</p>
                <p>2. All divisional units are instructed to adopt the standardized digital format with immediate effect.</p>
              </div>

              <div className="text-right text-xs mt-6 space-y-1">
                <p className="font-bold">Yours faithfully,</p>
                <p className="text-white/60">[Authorized Signatory]</p>
                <p className="text-white/50">Assistant Director General (Estt.)</p>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="Government Office Letterpad Format & AI Maker"
          description="Create Government of India and State Department official letterheads instantly on Swalekhani."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section with JSON-LD Schema */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="Government Letterpad FAQs"
          subtitle="Common questions on government letterhead compliance, emblems, and formatting."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-orange/15 via-white/[0.02] to-brand-sky/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Ready to Draft Your Government Letter?
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            Open Swalekhani Studio with the Government of India preset preloaded. Edit headers, adjust margins, generate drafts via AI, and export in crisp vector PDF.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=dop&tpl=A"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>Launch Government Studio Now</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
