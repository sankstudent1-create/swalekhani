import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Stethoscope, ArrowRight, CheckCircle2, ShieldAlert, FileText, Sparkles, Layers } from 'lucide-react';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion, { FaqItem } from '@/components/seo/FaqAccordion';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Doctor Letterhead & Prescription Pad Format (NMC Compliant)',
  description: 'Download and create official Doctor Letterheads and Prescription Pads online. Standard National Medical Commission (NMC) compliant medical letterpads with Medical Council Registration Numbers, Clinic timings, and Rx headers.',
  keywords: [
    'doctor letterhead',
    'prescription pad format',
    'medical letterhead maker online',
    'doctor prescription design format',
    'clinic letterpad maker',
    'medical council registration letterhead'
  ],
  alternates: {
    canonical: '/templates/doctor-letterpad',
  },
  openGraph: {
    title: 'Doctor Letterhead & Prescription Pad Format (NMC Compliant)',
    description: 'Design NMC-compliant doctor letterheads and prescription pads with clinic timings and medical registration details.',
    url: 'https://swalekhani.vercel.app/templates/doctor-letterpad',
    images: ['/og/doctor-letterpad.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctor Letterhead & Prescription Pad Format (NMC Compliant)',
    description: 'Create standardized doctor letterheads and clinic prescription pads online.',
    images: ['/og/doctor-letterpad.svg'],
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What details are legally required on a Doctor's Prescription Pad in India?",
    answer: "As per the National Medical Commission (NMC) regulations, every medical prescription must clearly display the Doctor's Full Name, Recognized Medical Qualifications (e.g. MBBS, MD), State Medical Council / NMC Registration Number, Clinic Address, Contact Phone, and Date. Dedicated fields for Patient Name, Age, Gender, and Rx symbol must be present."
  },
  {
    question: "Can I generate Medical Leave Certificates and Fitness Certificates with this pad?",
    answer: "Yes, Swalekhani's AI assistant can instantly compose Medical Illness Certificates, Physical Fitness Certificates, and Hospital Discharge Summaries in standard professional clinical terminology."
  },
  {
    question: "Can clinic OPD consultation timings and emergency contact numbers be included?",
    answer: "Yes, Swalekhani's Doctor preset includes dedicated header lines for Morning & Evening OPD consultation hours, emergency ambulance numbers, and appointment booking WhatsApp links."
  },
  {
    question: "Is printing generic medicine names mandatory under NMC guidelines?",
    answer: "Yes, NMC guidelines advise registered medical practitioners to write prescriptions legibly and preferably in capital letters, recommending generic drug names wherever feasible."
  },
  {
    question: "Can dental surgeons, physiotherapists, and AYUSH doctors customize their qualifications?",
    answer: "Yes, the template allows full editing of degrees (BDS, MDS, BPT, BAMS, BHMS) and State Dental / AYUSH Council registration numbers."
  },
  {
    question: "Can I upload our clinic or hospital logo to the prescription pad?",
    answer: "Yes, you can upload your clinic or hospital crest logo (PNG, JPG, or SVG) and place it on the top-left or top-center with custom width and height controls."
  },
  {
    question: "Does the pad provide a dedicated Patient Vitals header box?",
    answer: "Yes, Template B provides a structured patient vitals ribbon containing Patient Name, Age, Gender, Blood Pressure (BP), Pulse, Body Weight, and Date of Consultation."
  },
  {
    question: "Can doctors sign electronically on the prescription pad?",
    answer: "Yes. Swalekhani provides a built-in touch-friendly digital signature canvas where doctors can sign with a stylus, finger, or mouse, or upload a transparent scanned signature."
  },
  {
    question: "Is patient medical data stored or tracked on Swalekhani servers?",
    answer: "No. Swalekhani processes all prescriptions entirely in client-side memory. No patient names, diagnoses, or confidential health records ever leave your personal browser."
  },
  {
    question: "Can I export high-quality A4 or A5 printable prescription pads?",
    answer: "Yes, you can export vector-sharp PDFs directly suited for A4 clinic printing or thermal prescription slips without watermarks."
  }
];

export default function DoctorLetterpadPage() {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  return (
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-rose-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-white/80">Doctor Letterhead</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Healthcare & Medical Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Doctor Letterhead & Prescription Pad Format
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            NMC-compliant medical prescription pad and clinic letterhead format for doctors, physicians, consultants, and hospitals. Includes registration number, Rx section, and consultation timings.
          </p>

          {/* Main Action Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/tools/letterpad-generator?preset=doctor&tpl=B"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-base shadow-[0_10px_30px_rgba(244,63,94,0.25)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generate Doctor Prescription Pad
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-sm font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              View All Templates
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Core Guide Content (300-500 words) */}
        <article className="prose prose-invert max-w-none space-y-8 my-10 text-white/80 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              Medical Council Norms for Doctor Letterpads
            </h2>
            <p>
              In healthcare practice, every medical prescription, fitness certificate, and clinical referral letter has statutory standing under the <strong>Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations</strong> and the National Medical Commission (NMC).
            </p>
            <p>
              Prescription pads must clearly demarcate the practitioner's credentials, university degrees, recognized medical council registration number, clinic schedule, and patient demographic indicators (Age, Gender, Weight, Date) to prevent medication errors and ensure legal clarity.
            </p>
          </section>

          {/* Key Checklist */}
          <section className="space-y-4">
            <h3 className="text-xl font-heading font-semibold text-white">
              Essential Fields on a Doctor's Letterpad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Doctor's Name & Qualifications", desc: "e.g. Dr. Aarav Sharma, MBBS, MD (Medicine), DM (Cardio)." },
                { title: "State Medical Council Reg. No.", desc: "Mandatory statutory registration (e.g. MMC / DMC Reg No)." },
                { title: "Clinic & Hospital Affiliation", desc: "Name of the clinic, department, and physical address." },
                { title: "Patient Vitals Header", desc: "Dedicated line for Patient Name, Age, Gender, Date, and BP/Weight." },
                { title: "Rx Prescription Symbol", desc: "Traditional medical symbol denoting prescribed treatment instructions." },
                { title: "Doctor's Stamp & Signature", desc: "Footprint for official doctor seal and signature." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
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
              <FileText className="w-5 h-5 text-rose-400" />
              Doctor Medical Certificate Sample
            </h3>
            <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] text-white/90 text-sm leading-relaxed shadow-inner font-sans">
              <div className="flex justify-between items-start border-b border-white/[0.1] pb-4 mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">DR. AARAV SHARMA, MBBS, MD (MEDICINE)</h4>
                  <p className="text-xs text-rose-300">Consultant Physician & Cardiologist</p>
                  <p className="text-xs text-white/60">Reg. No: MMC-2015-08-3421 | CareWell Specialty Clinic</p>
                </div>
                <div className="text-right text-xs text-white/50">
                  <p>OPD Timings: 10 AM - 2 PM, 6 PM - 9 PM</p>
                  <p>Ph: +91-9820012345</p>
                </div>
              </div>

              <div className="border border-white/[0.06] p-2.5 rounded-lg flex justify-between text-xs text-white/70 mb-4 font-mono">
                <span>Patient: Mr. Vikas Gupta</span>
                <span>Age: 32 Yrs / Male</span>
                <span>Date: 23/09/2026</span>
              </div>

              <div className="text-center my-3">
                <span className="font-bold text-sm tracking-wider uppercase border-b border-rose-400 pb-0.5">
                  MEDICAL FITNESS CERTIFICATE
                </span>
              </div>

              <p className="text-xs leading-relaxed text-white/85 mb-3">
                This is to certify that I have carefully examined <strong>Mr. Vikas Gupta</strong>. He was suffering from Acute Viral Gastroenteritis and was under my active medical treatment from 18th Sept 2026 to 22nd Sept 2026.
              </p>
              <p className="text-xs text-white/80 mb-6">
                He has now fully recovered and is physically fit to resume his official duties with effect from 24th September 2026.
              </p>

              <div className="flex justify-between items-end text-xs pt-4">
                <p className="text-white/40">[Clinic Seal]</p>
                <div className="text-right">
                  <p className="font-bold text-white">Dr. Aarav Sharma</p>
                  <p className="text-white/50">Reg. No: MMC-2015-08-3421</p>
                </div>
              </div>
            </div>
          </section>

        </article>

        {/* Social Share Bar */}
        <ShareButtons
          title="Doctor Letterhead & Prescription Pad Maker - Swalekhani"
          description="Design NMC-compliant doctor letterheads and prescription pads in seconds."
        />

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-mid" label="Advertisement" />}

        {/* FAQ Section */}
        <FaqAccordion
          items={FAQ_ITEMS}
          title="Doctor Letterhead FAQs"
          subtitle="Key information for physicians and healthcare clinics using online letterhead tools."
        />

        {/* Bottom CTA Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-500/15 via-white/[0.02] to-amber-500/10 border border-white/[0.1] text-center">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
            Generate Your Doctor Letterhead Now
          </h3>
          <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
            Input doctor name, council registration number, clinic schedule, and print crisp prescription pads instantly.
          </p>
          <Link
            href="/tools/letterpad-generator?preset=doctor&tpl=B"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Open Medical Letterpad Studio</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
