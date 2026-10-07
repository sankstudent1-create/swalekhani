import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { PROFESSION_TEMPLATES, ALL_PROFESSION_SLUGS } from '@/data/profession-templates';
import ProfessionTemplateClient from '@/components/templates/ProfessionTemplateClient';
import AdSlot from '@/components/AdSlot';

interface PageProps {
 params: Promise<{
 slug: string;
 }>;
}

export async function generateStaticParams() {
 return ALL_PROFESSION_SLUGS.map((slug) => ({
 slug,
 }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const { slug } = await params;
 const template = PROFESSION_TEMPLATES[slug];

 if (!template) {
 return {
 title: 'Template Not Found',
 };
 }

 return {
 title: template.title,
 description: template.shortDesc,
 keywords: [
 template.targetKeyword,
 `${template.profession.toLowerCase()} letterhead format`,
 `${template.profession.toLowerCase()} letterhead maker online`,
 `sample ${template.profession.toLowerCase()} letterhead format in english`,
 'swalekhani letterpad templates',
 'professional letterhead maker'
 ],
 alternates: {
 canonical: `/templates/${slug}`,
 },
 openGraph: {
 title: template.title,
 description: template.shortDesc,
 url: `https://swalekhani.vercel.app/templates/${slug}`,
 images: ['/icon-512.png'],
 type: 'article',
 },
 twitter: {
 card: 'summary_large_image',
 title: template.title,
 description: template.shortDesc,
 images: ['/icon-512.png'],
 },
 };
}

export default async function ProfessionTemplatePage({ params }: PageProps) {
 const { slug } = await params;
 const template = PROFESSION_TEMPLATES[slug];

 if (!template) {
 notFound();
 }

 const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

 // HowTo JSON-LD Structured Data Schema
 const howToSchema = {
 "@context": "https://schema.org",
 "@type": "HowTo",
 "name": `How to Create and Format a Professional ${template.profession} Letterhead`,
 "description": `Step-by-step procedure to generate, customize, and print compliant ${template.profession} letterheads with Swalekhani.`,
 "step": [
 {
 "@type": "HowToStep",
 "name": "Select Letterhead Template & Theme",
 "text": `Choose the official ${template.profession} format preset and customize your brand theme color.`
 },
 {
 "@type": "HowToStep",
 "name": "Enter Statutory Credentials",
 "text": "Fill in your official registration number, chamber/office address, and contact details."
 },
 {
 "@type": "HowToStep",
 "name": "Draft Content with AI",
 "text": "Select a pre-built realistic sample letter or generate custom formal text using AI."
 },
 {
 "@type": "HowToStep",
 "name": "Export Vector PDF or Print",
 "text": "Export a crisp, print-ready vector A4 PDF or print directly onto executive bond letterhead paper."
 }
 ]
 };

 return (
 <main className="min-h-screen bg-[#faf8f3] dark:bg-[#0a0d13] text-slate-900 dark:text-white pt-28 pb-20">
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

 {/* HowTo JSON-LD Injection */}
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
 />

 {/* Breadcrumb */}
 <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-white/40 mb-8">
 <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
 <span>/</span>
 <Link href="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</Link>
 <span>/</span>
 <span className="text-slate-600 dark:text-white/70">{template.profession}</span>
 </nav>

 {/* Hero */}
 <div className="max-w-3xl mb-10">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange text-[11px] font-bold uppercase tracking-wider mb-4">
 <ShieldCheck className="w-3.5 h-3.5" />
 {template.badge}
 </span>
 <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.9rem] tracking-tight leading-[1.12] mb-4">
 {template.title}
 </h1>
 <p className="text-slate-500 dark:text-white/50 leading-relaxed mb-7">
 {template.introText}
 </p>
 <div className="flex flex-wrap gap-3">
 <Link
 href={`/tools/letterpad-generator?template=${template.slug}`}
 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm shadow-[0_12px_30px_-10px_rgba(232,118,43,0.6)] hover:brightness-95 hover:-translate-y-0.5 transition-all"
 >
 <Sparkles className="w-4 h-4" />
 Customize this template
 <ArrowRight className="w-4 h-4" />
 </Link>
 <Link
 href="/templates"
 className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-sm hover:border-slate-300 dark:hover:border-white/25 transition-all"
 >
 <Layers className="w-4 h-4 text-brand-orange" />
 All templates
 </Link>
 </div>
 </div>

 {/* In-article Ad Slot */}
 {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

 {/* Interactive Customizer & Live Preview */}
 <ProfessionTemplateClient template={template} />

 {/* Related templates */}
 <div className="mt-16">
 <h2 className="font-heading font-bold text-2xl tracking-tight mb-6">Related templates</h2>
 <div className="grid sm:grid-cols-3 gap-4">
 {template.relatedSlugs.slice(0, 3).map((relSlug) => {
 const rel = PROFESSION_TEMPLATES[relSlug];
 if (!rel) return null;
 return (
 <Link
 key={relSlug}
 href={`/templates/${relSlug}`}
 className="group p-5 rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10 hover:border-brand-orange/40 hover:-translate-y-0.5 transition-all"
 >
 <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-1.5">{rel.category}</p>
 <h3 className="font-heading font-bold group-hover:text-brand-orange transition-colors">{rel.profession}</h3>
 </Link>
 );
 })}
 </div>
 </div>

 </div>
 </main>
 );
}
