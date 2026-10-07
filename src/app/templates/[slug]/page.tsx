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
      'official letterhead maker'
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
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] ${template.theme.bgGlow} blur-[150px] rounded-full`}></div>
      </div>

      {/* HowTo JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/templates" className="hover:text-white transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-white/80">{template.profession}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{template.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            {template.title}
          </h1>

          {/* 150-word Original Intro Copy */}
          <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-4xl">
            {template.introText}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/tools/letterpad-generator?template=${template.slug}`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-semibold text-sm shadow-[0_10px_25px_rgba(249,115,22,0.25)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch in Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] text-xs font-medium transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Browse All 17 Templates</span>
            </Link>
          </div>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="content-top" label="Sponsored Content" />}

        {/* Interactive Customizer & Live Preview Component */}
        <ProfessionTemplateClient template={template} />

      </div>
    </main>
  );
}
