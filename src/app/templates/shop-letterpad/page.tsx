import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Store, ArrowRight, CheckCircle2, ShoppingBag, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Shop Letterpad Design & Retail Business Letterhead Format',
  description: 'Create professional Shop Letterpad Designs and Retail Business Letterheads online. Ideal for wholesale traders, retail stores, GST estimates, customer bills, and vendor agreements with Swalekhani.',
  keywords: [
    'shop letterpad design',
    'retail business letterhead format',
    'shop bill letterhead format',
    'gst shop letter pad design',
    'commercial trading letterhead maker',
    'kirana store letterhead format'
  ],
  alternates: {
    canonical: '/templates/shop-letterpad',
  },
  openGraph: {
    title: 'Shop Letterpad Design & Retail Business Letterhead Format',
    description: 'Design GST-compliant shop letterheads and commercial business pads with instant PDF export.',
    url: 'https://swalekhani.vercel.app/templates/shop-letterpad',
    images: ['/og/shop-letterpad.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Letterpad Design & Retail Business Letterhead Format',
    description: 'Create standardized shop letterpads and commercial retail letterheads online.',
    images: ['/og/shop-letterpad.svg'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What information should be present on a shop or retail business letterpad?",
    answer: "A standard shop letterhead includes the Trade / Firm Name, 15-digit GSTIN (GST Number), Shop & Establishment License Number, Complete Market / Shop Address, WhatsApp / Phone Order Numbers, Email Address, and Bank Account / UPI VPA details for instant payments."
  },
  {
    question: "Can I use this letterhead for formal customer quotations and rate estimates?",
    answer: "Yes, Swalekhani's AI letter drafting co-pilot can generate commercial price quotations, discount schemes, warranty terms, supply agreements, and dealer authorization letters in seconds."
  },
  {
    question: "Can I add religious invocations (e.g. || श्री गणेशाय नमः ||) on top?",
    answer: "Yes, Template A provides a dedicated top auspicious header row popular with Indian traders, hardware merchants, jewellers, and wholesale distributors."
  },
  {
    question: "Can I include bank account details and UPI QR codes on the shop letterpad?",
    answer: "Yes, you can configure the footer with your Current Account Bank Name, IFSC code, Account Number, and UPI ID for seamless vendor settlement."
  },
  {
    question: "Is this format suitable for Kirana stores, distributors, and hardware dealerships?",
    answer: "Yes, the format is fully customizable for FMCG distributors, electrical supply shops, textile traders, hardware merchants, and general retail stores."
  },
  {
    question: "Can I upload our custom shop logo or manufacturer dealership emblem?",
    answer: "Yes, you can upload PNG, JPG, or SVG logos and place them on the top-left or top-center with custom width scaling."
  },
  {
    question: "How do I print letterpads or export ready-to-print PDFs for the shop?",
    answer: "Click 'Design Shop Letterpad', adjust your shop details, and click 'Export PDF' in the top bar. The document downloads in high-resolution A4 size ready for shop counter printing."
  },
  {
    question: "Can I generate vendor supply dispute letters or delivery challan notices?",
    answer: "Yes, you can use the built-in AI co-pilot to compose formal goods replacement requests, damaged transit claims, and delayed payment reminders."
  },
  {
    question: "Does Swalekhani charge any fee for printing commercial shop pads?",
    answer: "No, Swalekhani is completely free to use without any watermark or subscription charge."
  },
  {
    question: "Can I use this letterpad on my mobile phone at the shop counter?",
    answer: "Yes, Swalekhani is 100% mobile-responsive, allowing shop owners to compose, sign, and WhatsApp official letters directly from their smartphone."
  }
];

export default function ShopLetterpadPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-amber-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-white/80">Shop Letterpad Design</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Store className="w-3.5 h-3.5" />
            <span>Retail & Commercial Trading</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Shop Letterpad Design & Retail Letterhead Format
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Create high-impact letterheads for retail shops, wholesale distributors, hardware stores, and commercial traders. Includes GSTIN details, shop license numbers, and AI quotation drafting.
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=shop&tpl=A"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-semibold text-base shadow-[0_10px_30px_rgba(245,158,11,0.25)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Design Shop Letterpad
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              Browse All Formats
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Core Guide Content (300-500 words) */}
        <article className="prose prose-invert max-w-none space-y-8 my-10 text-white/80 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
              Commercial Value of Professional Shop Letterheads
            </h2>
            <p>
              In Indian trade and commerce, a shop letterpad is indispensable for issuing official price estimates, authorization letters for delivery agents, guarantee certificates, supply inquiries, and bank current account documentation.
            </p>
            <p>
              Displaying your <strong>GSTIN, Trade License / Shop Establishment Number, and Verified WhatsApp Contact</strong> on every formal correspondence protects your business against commercial disputes and establishes immediate credibility with corporate buyers and government purchasers.
            </p>
          </section>

          {/* Key Checklist */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Essential Fields for Shop & Trading Letterpads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Trade & Firm Name", desc: "Registered business name prominently displayed with sub-trade category." },
                { title: "GSTIN / State Tax Code", desc: "15-digit GST Identification Number for tax compliance." },
                { title: "Shop & Market Address", desc: "Clear unit/shop number, market complex, landmark, city, and PIN." },
                { title: "WhatsApp & Telephone", desc: "Direct ordering numbers and customer support email." },
                { title: "Bank & UPI Payment Details", desc: "Optional footer ribbon with Current A/c details and UPI VPA." },
                { title: "Authorized Signature & Stamp", desc: "Proprietor / Partner authorization block." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
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
              <FileText className="w-5 h-5 text-amber-400" />
              Sample Shop Quotation Letter
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] text-white/90 text-sm leading-relaxed shadow-inner font-sans">
              <div className="text-center border-b border-white/[0.1] pb-4 mb-4">
                <p className="text-xs text-amber-400 font-mono tracking-widest">|| श्री गणेशाय नमः ||</p>
                <h4 className="text-lg font-bold text-white tracking-wide">SHREE GANESH COMMERCIAL TRADING CO.</h4>
                <p className="text-xs text-white/60">Wholesale & Retail Distributors | Electrical & Hardware Supplies</p>
                <p className="text-xs text-white/50">Shop No. 18, Central Market Yard, Pune - 411002 | GSTIN: 27AABCS1234F1Z8</p>
                <p className="text-xs text-amber-300/80">Ph: +91-20-24450000 | Mob: +91-9822012345</p>
              </div>

              <div className="flex justify-between text-xs text-white/60 mb-4 font-mono">
                <span>Ref: SGT/QTN/2026/412</span>
                <span>Date: 23-Sep-2026</span>
              </div>

              <div className="text-xs space-y-1 mb-4">
                <p className="font-semibold text-white">To: M/s Urban BuildCon Pvt Ltd</p>
                <p>Site Office: Sector 4, Hinjewadi, Pune</p>
              </div>

              <p className="text-xs font-bold text-white mb-2">
                Subject: Formal Price Quotation for Electrical Conduits & Heavy Wiring Cables
              </p>

              <div className="text-xs space-y-2 text-white/80">
                <p>Respected Sir,</p>
                <p>With reference to your inquiry dated 20th Sept 2026, we are pleased to submit our most competitive wholesale rates for the required electrical supplies...</p>
              </div>

              <div className="flex justify-between items-end text-xs pt-6">
                <p className="text-white/40">Terms: 18% GST Extra | Delivery within 48 Hrs</p>
                <div className="text-right">
                  <p className="font-semibold text-white">For Shree Ganesh Commercial Trading Co.</p>
                  <p className="text-white/50">Authorized Proprietor</p>
                </div>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="Shop Letterpad Design & Maker - Swalekhani"
          description="Create commercial shop letterheads with GSTIN in seconds."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="Shop Letterpad FAQs"
          subtitle="Helpful answers for retailers, distributors, and business owners."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500/15 via-white/[0.02] to-orange-500/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Build Your Shop Letterhead Online
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            Enter your shop name, GST number, address, and generate commercial quotations with AI in seconds.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=shop&tpl=A"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Launch Shop Letterpad Studio</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
