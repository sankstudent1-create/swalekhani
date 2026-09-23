"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Printer, Copy, Check, ArrowRight, 
  Layers, CheckCircle2, FileText, Globe, Palette, Download, Eye
} from 'lucide-react';
import type { ProfessionTemplate } from '@/data/profession-templates';
import { PROFESSION_TEMPLATES } from '@/data/profession-templates';
import ShareButtons from '@/components/seo/ShareButtons';
import FaqAccordion from '@/components/seo/FaqAccordion';

interface Props {
  template: ProfessionTemplate;
}

export default function ProfessionTemplateClient({ template }: Props) {
  // Field values state
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.fields.forEach(f => {
      initial[f.id] = f.defaultValue;
    });
    return initial;
  });

  // Selected sample letter
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const currentSample = template.sampleLetters[selectedSampleIndex] || template.sampleLetters[0];

  // Active language
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'mr'>(template.languages[0] || 'en');

  // Active theme color (default from template)
  const [accentColor, setAccentColor] = useState(template.theme.primaryHex);
  const [copied, setCopied] = useState(false);

  // Field change handler
  const handleFieldChange = (id: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [id]: value }));
  };

  // Language switch handler (updates bilingual headers if available)
  const handleLanguageChange = (lang: 'en' | 'hi' | 'mr') => {
    setSelectedLang(lang);
    if (template.bilingualDefaults) {
      if (lang === 'hi' && template.bilingualDefaults.hi) {
        setFieldValues(prev => ({
          ...prev,
          name: template.bilingualDefaults?.hi?.header1 || prev.name,
          subTitle: template.bilingualDefaults?.hi?.header2 || prev.subTitle,
          devanagariHeader: template.bilingualDefaults?.hi?.header1 || prev.devanagariHeader,
        }));
      } else if (lang === 'mr' && template.bilingualDefaults.mr) {
        setFieldValues(prev => ({
          ...prev,
          name: template.bilingualDefaults?.mr?.header1 || prev.name,
          subTitle: template.bilingualDefaults?.mr?.header2 || prev.subTitle,
          devanagariHeader: template.bilingualDefaults?.mr?.header1 || prev.devanagariHeader,
        }));
      } else {
        // Reset to English defaults
        const initial: Record<string, string> = {};
        template.fields.forEach(f => {
          initial[f.id] = f.defaultValue;
        });
        setFieldValues(initial);
      }
    }
  };

  const handleCopySample = async () => {
    if (!currentSample) return;
    const textToCopy = `${currentSample.recipient}\n\n${currentSample.subject}\n\n${currentSample.body.join('\n\n')}\n\n${currentSample.signoff}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generator pre-fill deep link URL
  const generatorLink = useMemo(() => {
    const params = new URLSearchParams();
    params.set('template', template.slug);
    if (fieldValues.name) params.set('h1', fieldValues.name);
    if (fieldValues.subTitle || fieldValues.qualifications || fieldValues.designation) {
      params.set('h2', fieldValues.subTitle || fieldValues.qualifications || fieldValues.designation || '');
    }
    if (fieldValues.address || fieldValues.chamberAddress || fieldValues.officeAddress) {
      params.set('ofc', fieldValues.address || fieldValues.chamberAddress || fieldValues.officeAddress || '');
    }
    if (fieldValues.phone) params.set('ph', fieldValues.phone);
    if (fieldValues.email) params.set('em', fieldValues.email);
    if (currentSample) {
      params.set('sub', currentSample.subject);
      params.set('body', currentSample.body.join('\n\n'));
      params.set('to', currentSample.recipient);
    }
    return `/tools/letterpad-generator?${params.toString()}`;
  }, [template.slug, fieldValues, currentSample]);

  // Color options for live customizer
  const colorOptions = [
    { name: 'Original', hex: template.theme.primaryHex },
    { name: 'Royal Navy', hex: '#1e40af' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Crimson', hex: '#e11d48' },
    { name: 'Amber Gold', hex: '#d97706' },
    { name: 'Slate Dark', hex: '#334155' },
    { name: 'Purple', hex: '#7c3aed' },
  ];

  return (
    <div className="space-y-12">
      {/* ── LIVE PREVIEW & CUSTOMIZER STUDIO GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start not-prose">
        
        {/* Left / Top: Interactive Live A4 Canvas Preview */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Interactive A4 Canvas Preview
              </span>
            </div>
            <div className="text-xs text-white/40 font-mono">210mm × 297mm (Standard A4)</div>
          </div>

          {/* Printable Letterpad Canvas Container */}
          <div 
            id="printable-letterpad"
            className="w-full bg-[#fcfcfc] text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/20 transition-all font-sans relative overflow-hidden"
            style={{ minHeight: '680px' }}
          >
            {/* Special Tricolor Top Border Ribbon for Gram Panchayat */}
            {template.theme.headerLayout === 'tricolor' && (
              <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                <div className="flex-1 bg-[#ff9933]"></div>
                <div className="flex-1 bg-[#ffffff] border-y border-slate-200"></div>
                <div className="flex-1 bg-[#138808]"></div>
              </div>
            )}

            {/* Letterhead Header Band */}
            <div className="border-b-2 pb-5 mb-6" style={{ borderColor: accentColor }}>
              
              {/* Devanagari Bilingual Top Line (if applicable) */}
              {fieldValues.devanagariHeader && (
                <div className="text-center font-bold text-lg sm:text-xl text-slate-900 mb-1 tracking-wide">
                  {fieldValues.devanagariHeader}
                </div>
              )}

              {/* Main Organization / Person Name */}
              <h2 
                className={`text-xl sm:text-2xl font-bold tracking-tight text-center ${template.theme.font === 'serif' ? 'font-serif' : 'font-sans'}`}
                style={{ color: accentColor }}
              >
                {fieldValues.name || template.profession}
              </h2>

              {/* Sub-header / Qualifications / Designation */}
              {(fieldValues.subTitle || fieldValues.qualifications || fieldValues.designation || fieldValues.panchayatSamiti) && (
                <p className="text-xs sm:text-sm text-slate-700 font-medium text-center mt-1">
                  {fieldValues.subTitle || fieldValues.qualifications || fieldValues.designation || fieldValues.panchayatSamiti}
                </p>
              )}

              {/* Statutory Registration IDs / Bar Council / RERA / FRN / FSSAI */}
              {(fieldValues.enrolmentNo || fieldValues.frn || fieldValues.membershipNo || fieldValues.reraNo || fieldValues.ceaNo || fieldValues.fssai || fieldValues.trustReg || fieldValues.darpanId || fieldValues.pwdClass || fieldValues.regNo || fieldValues.panGst) && (
                <div className="text-[11px] font-mono text-slate-600 font-semibold text-center mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
                  {fieldValues.enrolmentNo && <span>Enrolment: {fieldValues.enrolmentNo}</span>}
                  {fieldValues.membershipNo && <span>{fieldValues.membershipNo}</span>}
                  {fieldValues.frn && <span>{fieldValues.frn}</span>}
                  {fieldValues.reraNo && <span>{fieldValues.reraNo}</span>}
                  {fieldValues.ceaNo && <span>{fieldValues.ceaNo}</span>}
                  {fieldValues.fssai && <span>{fieldValues.fssai}</span>}
                  {fieldValues.trustReg && <span>{fieldValues.trustReg}</span>}
                  {fieldValues.darpanId && <span>{fieldValues.darpanId}</span>}
                  {fieldValues.pwdClass && <span>{fieldValues.pwdClass}</span>}
                  {fieldValues.regNo && <span>{fieldValues.regNo}</span>}
                  {fieldValues.panGst && <span>{fieldValues.panGst}</span>}
                </div>
              )}

              {/* Contact Bar: Address, Phone, Email */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10.5px] text-slate-600 gap-2">
                <div className="max-w-[65%] truncate">
                  📍 {fieldValues.address || fieldValues.chamberAddress || fieldValues.officeAddress || fieldValues.branchAddress || fieldValues.location || 'Official Premises Address'}
                </div>
                <div className="flex items-center gap-3">
                  {fieldValues.phone && <span>📞 {fieldValues.phone}</span>}
                  {fieldValues.email && <span>✉️ {fieldValues.email}</span>}
                </div>
              </div>
            </div>

            {/* Letter Date & Reference Code */}
            <div className="flex justify-between text-xs text-slate-600 mb-6 font-mono">
              <span>{currentSample?.fileNo || 'REF: SW/OFFICIAL/2026/01'}</span>
              <span>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>

            {/* Recipient Block */}
            <div className="text-xs text-slate-800 whitespace-pre-line font-medium mb-4 leading-relaxed">
              {currentSample?.recipient || 'To,\nThe Competent Authority,\nOfficial Address, City - 000000.'}
            </div>

            {/* Subject Line */}
            <div className="text-xs font-bold text-slate-900 mb-4 tracking-tight uppercase border-b border-slate-200 pb-1">
              Subject: {currentSample?.subject || 'OFFICIAL COMMUNICATION & DRAFT'}
            </div>

            {/* Letter Body Paragraphs */}
            <div className="text-xs text-slate-800 space-y-3 leading-relaxed text-justify mb-8">
              {currentSample?.body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Signature & Seal Block */}
            <div className="flex justify-end pt-4">
              <div className="text-right text-xs text-slate-800 space-y-1 font-medium whitespace-pre-line">
                {currentSample?.signoff || 'Yours faithfully,\n\n[Authorized Signatory]'}
              </div>
            </div>

            {/* Letterhead Footer Ribbon */}
            <div className="absolute bottom-4 left-6 right-6 border-t border-slate-200 pt-2 flex justify-between text-[9.5px] text-slate-400 font-mono">
              <span>Powered by Swalekhani • Official Letterpad Engine</span>
              <span>Confidential & Official Document</span>
            </div>
          </div>

          {/* Quick Action Toolbar Below Preview */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={generatorLink}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use in Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-sm font-medium transition-all"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print A4</span>
            </button>

            <button
              onClick={handleCopySample}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] text-sm font-medium transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Letter Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right / Bottom: Live Customizer Panel */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0d1017] border border-white/[0.1] space-y-6 shadow-xl">
            
            <div className="border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-brand-orange" />
                Customize Letterpad Fields
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Edit inputs below to update the live preview canvas in real-time.
              </p>
            </div>

            {/* Language Switcher (if template supports multilingual) */}
            {template.languages.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Language / भाषा
                </label>
                <div className="flex gap-2">
                  {template.languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                        selectedLang === lang 
                          ? 'bg-white text-black border-white font-semibold' 
                          : 'bg-white/[0.04] text-white/70 border-white/[0.08] hover:bg-white/[0.08]'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी (Hindi)' : 'मराठी (Marathi)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Letterhead Theme Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 relative flex items-center justify-center"
                    style={{ 
                      backgroundColor: c.hex,
                      borderColor: accentColor === c.hex ? '#ffffff' : 'rgba(255,255,255,0.2)' 
                    }}
                    title={c.name}
                  >
                    {accentColor === c.hex && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Customizer Inputs based on template.fields */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {template.fields.map(field => (
                <div key={field.id} className="space-y-1">
                  <label className="text-xs font-medium text-white/80 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={fieldValues[field.id] || ''}
                    onChange={e => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Sample Letter Preset Selector */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-orange" />
                Select Realistic Sample Draft
              </label>
              <div className="space-y-1.5">
                {template.sampleLetters.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSampleIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                      selectedSampleIndex === idx
                        ? 'bg-brand-orange/15 border-brand-orange text-white font-medium'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/70 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="font-semibold text-white">{s.title}</div>
                    <div className="text-[11px] text-white/50 truncate mt-0.5">{s.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Link to Open in Full Swalekhani Generator */}
            <div className="pt-2">
              <Link
                href={generatorLink}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span>Open Full Studio with This Data</span>
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ── 2-3 FULL REALISTIC SAMPLE LETTERS SECTION ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-brand-orange" />
          <h2 className="text-2xl font-heading font-bold text-white">
            Realistic Sample Letters for {template.profession}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          {template.sampleLetters.map((sample, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#0d1017] border border-white/[0.1] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-lg bg-white/[0.05] text-brand-orange font-mono text-xs font-semibold">
                  Sample {idx + 1}: {sample.title}
                </div>
                <p className="text-xs text-white/60">{sample.description}</p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05] text-xs font-mono text-white/80 space-y-2 max-h-48 overflow-y-auto">
                  <div className="text-white/50">Subject: {sample.subject}</div>
                  <div className="text-white/70 text-[11px] whitespace-pre-line">{sample.body[0]}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedSampleIndex(idx);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium border border-white/[0.08] transition-all"
                >
                  Load in Canvas
                </button>
                <Link
                  href={`/tools/letterpad-generator?template=${template.slug}&sub=${encodeURIComponent(sample.subject)}&body=${encodeURIComponent(sample.body.join('\n\n'))}`}
                  className="flex-1 py-2 rounded-xl bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange text-xs font-semibold border border-brand-orange/30 text-center transition-all"
                >
                  Edit with AI
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMAT & COMPLIANCE GUIDE (5+ RULES) ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2.5">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          Format Guidelines & Statutory Rules for {template.profession}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
          {template.formatGuide.map((guide, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {guide.importance}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white pt-1">{guide.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{guide.rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL SHARE BAR ── */}
      <ShareButtons
        title={`${template.title} - Free Maker on Swalekhani`}
        description={template.shortDesc}
        url={`https://swalekhani.vercel.app/templates/${template.slug}`}
      />

      {/* ── FAQ ACCORDION WITH FAQPAGESCHEMA ── */}
      <FaqAccordion
        items={template.faqs}
        title={`${template.profession} Letterhead FAQs`}
        subtitle="Frequently asked questions on compliance, formatting, printing, and digital drafting."
      />

      {/* ── RELATED TEMPLATES SECTION ── */}
      {template.relatedSlugs && template.relatedSlugs.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-orange" />
              Related Profession Letterheads
            </h2>
            <Link href="/templates" className="text-xs text-white/60 hover:text-white flex items-center gap-1">
              <span>View All Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
            {template.relatedSlugs.map(relSlug => {
              const rel = PROFESSION_TEMPLATES[relSlug];
              if (!rel) return null;
              return (
                <Link
                  key={rel.slug}
                  href={`/templates/${rel.slug}`}
                  className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] transition-all group"
                >
                  <span className="text-[10px] font-semibold text-brand-orange uppercase tracking-wider block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-semibold text-white group-hover:text-brand-orange transition-colors">
                    {rel.profession}
                  </h4>
                  <p className="text-xs text-white/50 line-clamp-2 mt-1">
                    {rel.shortDesc}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA CARD ── */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500/15 via-white/[0.02] to-amber-500/10 border border-white/[0.1] text-center not-prose">
        <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
          Draft Your Official {template.profession} Letterhead with AI
        </h3>
        <p className="text-sm sm:text-base text-white/65 max-w-xl mx-auto mb-6">
          Say goodbye to complex Word templates. Swalekhani formats and styles your official letterhead to perfection in seconds.
        </p>
        <Link
          href={generatorLink}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <span>Open Full Draft Studio</span>
        </Link>
      </div>

    </div>
  );
}
