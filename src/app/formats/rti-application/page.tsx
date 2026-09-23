import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, ArrowRight, CheckCircle2, FileSearch, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'RTI Application Format | Section 6(1) Right to Information Draft Maker',
  description: 'Download and generate legally sound RTI Application Formats under Section 6(1) of RTI Act 2005. Sample RTI drafts for exam marks, answer sheet copies, government recruitment status, and road/tender inquiries with AI.',
  keywords: [
    'RTI application format',
    'RTI act 2005 application format',
    'sample RTI format in english',
    'RTI application format in hindi',
    'RTI format for exam answer sheet',
    'how to write RTI application format'
  ],
  alternates: {
    canonical: '/formats/rti-application',
  },
  openGraph: {
    title: 'RTI Application Format | Section 6(1) Right to Information Draft Maker',
    description: 'Draft legally compliant RTI Applications under Section 6(1) of RTI Act 2005 with instant AI drafting.',
    url: 'https://www.swalekhani.com/formats/rti-application',
    images: ['/og/rti-application.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RTI Application Format | Section 6(1) Right to Information Draft Maker',
    description: 'Standard RTI Application generator for Central and State Public Information Officers.',
    images: ['/og/rti-application.svg'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What are the essential requirements of an RTI Application under Section 6(1)?",
    answer: "An RTI application must be addressed to the Central / State Public Information Officer (CPIO/SPIO), clearly state the specific information requested in numbered bullet points, confirm that the applicant is an Indian citizen, and state the details of the statutory application fee paid (IPO / Court Fee Stamp / DD of ₹10)."
  },
  {
    question: "Do I need to explain the reason why I am asking for the information?",
    answer: "No. Under Section 6(2) of the RTI Act 2005, an applicant is NOT required to give any reason for requesting information or any personal details other than contact address for communication."
  },
  {
    question: "How long does a CPIO have to respond to an RTI application?",
    answer: "As per Section 7(1) of the RTI Act, the CPIO must provide the requested information or reject it within 30 days of receiving the application. If the information concerns the life or liberty of a person, the response must be given within 48 hours."
  },
  {
    question: "What is the fee for filing an RTI application?",
    answer: "For Central Government authorities, the application fee is ₹10 paid via Indian Postal Order (IPO), Demand Draft, Banker's Cheque, or online payment. State government fees vary between ₹10 and ₹50. Applicants belonging to Below Poverty Line (BPL) families are exempt from all fees upon producing proof."
  },
  {
    question: "Can I file an RTI application to ask 'Why' an action was not taken?",
    answer: "Under the RTI Act (Section 2(f)), only existing material records, documents, emails, opinions, press releases, circulars, orders, logbooks, contracts, and samples can be requested. Public Information Officers are not mandated to answer hypothetical questions, create new data, or explain 'Why' decisions were taken unless documented in official note-sheets."
  },
  {
    question: "What should I do if the CPIO does not reply within 30 days?",
    answer: "If no response is received within 30 days or if you are aggrieved by the decision, you can file a First Appeal under Section 19(1) of the RTI Act before the designated First Appellate Authority (FAA) within 30 days from the expiry of the response period."
  },
  {
    question: "How can I request evaluated answer sheets or marks via RTI?",
    answer: "Following the Supreme Court judgment in CBSE vs. Aditya Bandopadhyay (2011), examinees have the legal right to inspect and obtain certified copies of their evaluated answer scripts by stating their Roll Number, exam name, and center details in an RTI application."
  },
  {
    question: "Can an RTI application be filed in Hindi or regional languages?",
    answer: "Yes, Section 6(1) explicitly permits filing applications in English, Hindi, or the official language of the state in which the application is being made."
  },
  {
    question: "Can Swalekhani generate RTI queries in Hindi and English?",
    answer: "Yes, Swalekhani's AI assistant can structure complex queries in either Hindi (सूचना का अधिकार अधिनियम, 2005) or English with standard legal phrasing."
  },
  {
    question: "Are private companies covered under the RTI Act 2005?",
    answer: "Purely private corporations are not directly covered unless they are substantially financed by government funds. However, information about private bodies that a government regulator (like RBI, SEBI, MCA, or TRAI) can access under existing law can be accessed via RTI from that regulator."
  },
  {
    question: "What is the standard format for paying fees via Indian Postal Order (IPO)?",
    answer: "The Indian Postal Order of ₹10 should be drawn in favor of 'Accounts Officer' or the designated authority specified by the concerned ministry/department and made payable at the local GPO/Head Post Office."
  }
];

export default function RtiApplicationPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-cyan-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Formats</Link>
          <span>/</span>
          <span className="text-white/80">RTI Application Format</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Right to Information Act, 2005</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            RTI Application Format & Legal Draft Maker
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Statutory RTI Application format under Section 6(1) of the RTI Act 2005. Format precise point-by-point inquiries for marks, public works, recruitments, and government records.
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=rti&sub=Application%20Seeking%20Information%20Under%20Section%206(1)%20of%20RTI%20Act,%202005&tpl=A"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold text-base shadow-[0_10px_30px_rgba(6,182,212,0.25)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generate RTI Application
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
              <FileSearch className="w-6 h-6 text-cyan-400" />
              How to Write an Effective RTI Application
            </h2>
            <p>
              The <strong>Right to Information Act, 2005</strong> empowers Indian citizens to seek transparent records from any public authority. However, poorly drafted RTI queries that ask hypothetical questions or demand opinions often get rejected under Section 2(f).
            </p>
            <p>
              A legally sound RTI application asks for <strong>specific, existing material records</strong> (e.g., certified copies of note-sheets, attendance sheets, marks rosters, or expenditure vouchers). It must be addressed to the designated Central Public Information Officer (CPIO) or State Public Information Officer (SPIO).
            </p>
          </section>

          {/* Key Checklist */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Checklist for Filing an RTI Application
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Competent CPIO Address", desc: "Correct public authority name, ministry, and official postal address." },
                { title: "Statutory Section Reference", desc: "Mandatory citation of Section 6(1) of RTI Act 2005 in subject." },
                { title: "Point-wise Specific Queries", desc: "Clear, numbered questions requesting physical copies or records." },
                { title: "Citizenship Declaration", desc: "Statutory declaration confirming Indian citizenship." },
                { title: "Application Fee Mode", desc: "Mention of ₹10 IPO, Court Fee Stamp, DD, or online transaction ID." },
                { title: "BPL Exemption (If Applicable)", desc: "Proof of Below Poverty Line (BPL) status for fee waiver." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
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
              <FileText className="w-5 h-5 text-cyan-400" />
              Standard RTI Application Draft Sample
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] text-white/90 text-sm leading-relaxed shadow-inner font-serif">
              <div className="text-center border-b border-white/[0.1] pb-3 mb-4">
                <h4 className="text-base font-bold text-white tracking-wide">APPLICATION UNDER SECTION 6(1) OF THE RTI ACT, 2005</h4>
                <p className="text-xs text-white/60">सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत आवेदन</p>
              </div>

              <div className="flex justify-between text-xs text-white/60 mb-4 font-mono">
                <span>Date: 23rd September, 2026</span>
                <span>Place: New Delhi</span>
              </div>

              <div className="text-xs space-y-1 mb-4">
                <p className="font-bold text-white">To,</p>
                <p>The Central Public Information Officer (CPIO),</p>
                <p>Staff Selection Commission (Northern Region),</p>
                <p>Block No. 12, CGO Complex, Lodhi Road, New Delhi - 110003.</p>
              </div>

              <p className="text-xs font-bold text-white mb-3">
                Subject: Request for Information under Section 6(1) of RTI Act, 2005 regarding CGL Examination 2025.
              </p>

              <div className="text-xs space-y-2 text-white/85 font-sans leading-relaxed">
                <p>Respected Sir / Madam,</p>
                <p>I, the undersigned, am a citizen of India. Please provide the following information under the RTI Act, 2005:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Certified copy of my evaluated Tier-II answer sheets for Roll No. 2201048921.</li>
                  <li>Category-wise cut-off marks for final selection under UR and OBC categories.</li>
                  <li>Total number of vacancies reported and filled in the final result.</li>
                </ol>
                <p className="pt-2">
                  <strong>Fee Details:</strong> An Indian Postal Order (IPO) of ₹10 (IPO No: 42F 981240) is attached herewith towards the statutory application fee.
                </p>
              </div>

              <div className="text-right text-xs pt-6 space-y-1">
                <p className="font-bold text-white">Yours faithfully,</p>
                <p className="text-white/80">[Applicant's Signature]</p>
                <p className="text-white/70">Name: Rohit Kumar Sharma</p>
                <p className="text-white/50">Address: Flat 204, Shanti Vihar, New Delhi - 110092</p>
                <p className="text-white/50">Mobile: +91-9876543210</p>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="RTI Application Format & Maker - Swalekhani"
          description="Draft legally sound RTI applications under Section 6(1) in seconds."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="RTI Application FAQs"
          subtitle="Legal guidelines for filing RTI applications and appeals."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-white/[0.02] to-blue-500/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Draft Your RTI Application with AI
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            State your questions in simple words; Swalekhani's AI transforms them into rigorous, legally compliant RTI queries.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=rti&sub=Application%20Seeking%20Information%20Under%20Section%206(1)%20of%20RTI%20Act,%202005&tpl=A"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Open RTI Draft Studio</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
