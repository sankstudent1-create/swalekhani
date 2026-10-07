import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldAlert } from 'lucide-react';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';

const GUIDE_FAQS: FaqItem[] = [
  {
    question: 'What paper size should I use for formal letters in India?',
    answer: 'The standard is A4 (210 × 297 mm) for all corporate, legal, and personal correspondence in India. Swalekhani Studio renders a pixel-perfect A4 canvas, and the Export PDF button produces a true vector A4 file — no scaling needed at print time. Avoid US Letter size; Indian offices uniformly expect A4.'
  },
  {
    question: 'Can I print on pre-printed company letterhead paper?',
    answer: 'Yes. If your office already has printed letterhead stationery, switch the Studio header to the minimal layout, leave the top margin generous (at least 4 cm), and print only the body. Use the live preview to align the first line below your printed header before committing to a full run.'
  },
  {
    question: 'Are bilingual (Hindi & English) headers needed?',
    answer: 'For private companies, schools, and professionals, bilingual headers are optional but common in Hindi-speaking states. Swalekhani supports Devanagari typography natively, so you can add Hindi lines above your English header whenever it suits your audience.'
  },
  {
    question: 'Can I use my company logo on my draft?',
    answer: 'Yes — upload your own company or clinic logo in the Studio header settings. Use only logos you own or are authorised to use; never use another organisation\'s branding or any national emblem on your drafts.'
  },
  {
    question: 'How do I number paragraphs in a formal letter?',
    answer: 'Formal business letters use sequentially numbered paragraphs (1., 2., 3.) for the substantive body, each making one point. In Swalekhani Studio, use the numbered-paragraph insert button in the toolbar — it keeps numbering consistent even when you reorder text.'
  },
  {
    question: 'Is the AI-drafted text final and ready to send?',
    answer: 'No — treat AI output as a first draft. Always review facts, names, dates, file numbers, and tone before use. For legal or statutory letters (advocate notices, RTI applications), have a qualified professional verify the draft. See our Disclaimer for details.'
  }
];

export default function GeneratorGuide() {
  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Draft safeguard */}
      <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-amber-500/[0.07] border border-amber-500/25 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">
          <p className="font-semibold text-amber-300 mb-1">Drafting aid — always review before sending</p>
          <p className="text-slate-500">
            Swalekhani Studio creates <strong className="text-slate-700">AI-assisted drafts</strong> for your review.
            Always verify names, dates, amounts, and tone before printing or sending any letter.{' '}
            <Link href="/disclaimer" className="underline decoration-amber-400/50 underline-offset-2 hover:text-amber-300">Read the Disclaimer</Link>.
          </p>
        </div>
      </div>

      {/* Guide article — server-rendered reading content */}
      <article className="prose prose max-w-none text-slate-700 leading-relaxed">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Writing Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mb-2">
            How to Write a Formal Letter in India
          </h2>
          <p className="text-sm text-slate-500">
            The anatomy of a proper formal letter — from sender block to sign-off — and what each field in Swalekhani Studio means.
          </p>
        </div>

        <section className="space-y-4 mb-8">
          <h3 className="text-xl font-heading font-semibold text-slate-900">1. The sender block and header</h3>
          <p>
            Every formal letter opens with the sender&apos;s identity: organisation name, department, address, phone, and email.
            Bilingual headers (Hindi above English) are common in Indian business correspondence and supported natively.
            In Swalekhani Studio, the <strong className="text-slate-800">header fields (e1, e2, ofc, ph, em)</strong> control exactly this block —
            fill them once per template and every new letter inherits a consistent identity.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h3 className="text-xl font-heading font-semibold text-slate-900">2. File number and dispatch date</h3>
          <p>
            The <strong className="text-slate-800">file number (पत्रांक / fno)</strong> is the letter&apos;s unique identity in the office record system,
            typically in the form <em>[Subject Code]-[Serial]/[Year]-[Section]</em> (e.g. File No. 17-02/2026-Estt.).
            It sits top-left; the <strong className="text-slate-800">dispatch date and station</strong> sit top-right.
            Never reuse a file number, and never backdate — both are audit red flags. Swalekhani&apos;s fno field is free text so it
            accepts any departmental scheme.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h3 className="text-xl font-heading font-semibold text-slate-900">3. Recipient, subject, and reference</h3>
          <p>
            Address the recipient by <strong className="text-slate-800">designation, not just name</strong> — designations survive transfers, names don&apos;t.
            The <strong className="text-slate-800">subject line</strong> is a one-line summary in bold or underlined capitals, ending with an em dash and
            &ldquo;Regarding.&rdquo; If the letter responds to earlier correspondence, cite it in a
            <strong className="text-slate-800"> reference (Ref:) line</strong> directly below the subject. This single habit resolves half of all
            inter-office confusion.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h3 className="text-xl font-heading font-semibold text-slate-900">4. Numbered paragraphs</h3>
          <p>
            The body of an Indian official letter is written in <strong className="text-slate-800">sequentially numbered paragraphs</strong>,
            each making exactly one point: context, facts, the ask, and the deadline. Open with &ldquo;Sir/Madam,&rdquo; on its own line.
            Keep sentences short and verbs active — administrative English values precision over flourish. Use the Studio&apos;s
            numbered-paragraph button to keep the sequence intact while editing.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          <h3 className="text-xl font-heading font-semibold text-slate-900">5. Sign-off, endorsement, and copy-to</h3>
          <p>
            Close with &ldquo;Yours faithfully&rdquo; (भवदीय), followed by the signatory&apos;s name and designation — never a bare signature.
            If subordinate offices must act on the letter, add an <strong className="text-slate-800">endorsement (पृष्ठांकन)</strong> below the signature:
            &ldquo;Copy forwarded for information and necessary action to:&rdquo; followed by a numbered list. The
            <strong className="text-slate-800"> copy-to</strong> list is not courtesy — it creates the accountability trail, so include every office
            expected to act, and no one else.
          </p>
        </section>
      </article>

      {/* FAQs */}
      <FaqAccordion
        items={GUIDE_FAQS}
        title="Letterpad Studio FAQs"
        subtitle="Paper, printing, bilingual rules, emblem limits, and AI drafts — answered."
      />
    </div>
  );
}
