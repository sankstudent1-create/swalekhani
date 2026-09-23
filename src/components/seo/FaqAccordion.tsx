"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}

export default function FaqAccordion({
  items,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about official formatting, standards, and Swalekhani."
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="my-14 pt-8 border-t border-white/[0.08]">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & FAQs</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-white/60">
          {subtitle}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? "bg-white/[0.04] border-white/[0.15] shadow-[0_10px_30px_rgba(0,0,0,0.3)]" 
                  : "bg-white/[0.015] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.1]"
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 font-medium text-white transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-heading font-semibold text-white/90">
                  {item.question}
                </span>
                <div className={`w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-white/[0.08]" : ""}`}>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-white/70 leading-relaxed border-t border-white/[0.04] animate-fadeIn">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
