"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, FileText, Sparkles, Building, Landmark, Mail, 
  ShieldCheck, Award, ArrowRight, CheckCircle2, Stamp, BookOpen, UserCheck
} from 'lucide-react';

// Swalekhani Official Templates & Presets
const SWALEKHANI_TEMPLATES = [
  {
    id: "dop",
    name: "India Post / Department of Posts",
    badge: "Official Central Format",
    description: "Standard bilingual letterpad for Department of Posts, Ministry of Communications, featuring India Post emblem and Ashoka Lion Capital.",
    category: "Government of India",
    icon: Mail,
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    tags: ["India Post", "Bilingual", "DoP", "Central Gov"],
    presetKey: "dop",
  },
  {
    id: "district",
    name: "District & Divisional Administration",
    badge: "Divisional Office",
    description: "Tailored for Superintendent of Post Offices, Sub-Divisions, District Collectorates, and Zilla administrative headquarters.",
    category: "Administrative",
    icon: Building,
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    tags: ["District Office", "Superintendent", "Divisional", "Admin"],
    presetKey: "district",
  },
  {
    id: "minister",
    name: "Union Ministry / Cabinet Secretariat",
    badge: "Executive High Office",
    description: "Formal letterhead layout with Ashoka Lion Capital, Ministry header, file numbering, and strict governmental typography.",
    category: "Government of India",
    icon: Landmark,
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    tags: ["Ministry", "Cabinet", "Secretariat", "GoI"],
    presetKey: "minister",
  },
  {
    id: "mp",
    name: "Parliament of India (Lok Sabha / Rajya Sabha)",
    badge: "Parliamentary Letterhead",
    description: "Official Member of Parliament letterhead featuring the Sansad seal and national emblem for parliamentary correspondence.",
    category: "Legislative",
    icon: Award,
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    tags: ["Sansad", "MP Letterhead", "Lok Sabha", "Parliament"],
    presetKey: "mp",
  },
  {
    id: "mla",
    name: "State Legislative Assembly (Vidhan Sabha)",
    badge: "State Legislative",
    description: "Formal MLA & Legislative Assembly Secretariat format with state insignia and official secretariat references.",
    category: "Legislative",
    icon: ShieldCheck,
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    tags: ["Vidhan Sabha", "MLA", "State Government", "Assembly"],
    presetKey: "mla",
  },
  {
    id: "rms",
    name: "Railway Mail Service (RMS)",
    badge: "Transit & Logistics",
    description: "Operational letterpad for Railway Mail Service divisions, transit mail offices, and sorting hubs across Indian postal circles.",
    category: "Administrative",
    icon: Mail,
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    tags: ["RMS", "Railway Mail", "Postal Sorting", "DoP"],
    presetKey: "rms",
  },
  {
    id: "savings",
    name: "Post Office Savings Bank (POSB)",
    badge: "Financial & Banking",
    description: "Banking and financial services letterpad for Head Post Offices and Sub Post Offices managing POSB & IPPB schemes.",
    category: "Financial",
    icon: Stamp,
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    tags: ["POSB", "Savings Bank", "Head Post Office", "Financial"],
    presetKey: "savings",
  },
  {
    id: "custom",
    name: "Bilingual Central / State Department",
    badge: "Customizable Template",
    description: "Versatile bilingual template allowing custom Hindi/English department titles, emblems, reference styles, and contact ribbons.",
    category: "Government of India",
    icon: FileText,
    accent: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
    tags: ["Custom Gov", "Bilingual", "Rajbhasha", "State & Central"],
    presetKey: "custom",
  },
  {
    id: "personal",
    name: "Executive & Professional Letterhead",
    badge: "Clean Minimalist",
    description: "Sleek, modern letterhead for advocates, consultants, executives, and personal official representations without institutional emblems.",
    category: "Personal & Professional",
    icon: UserCheck,
    accent: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    tags: ["Personal", "Professional", "Minimal", "Executive"],
    presetKey: "personal",
  },
];

const CATEGORIES = ["All", "Government of India", "Administrative", "Legislative", "Financial", "Personal & Professional"];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = useMemo(() => {
    return SWALEKHANI_TEMPLATES.filter((tpl) => {
      const matchesSearch = 
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === "All" || tpl.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-sky/10 via-brand-pink/5 to-transparent blur-[140px] opacity-70"></div>
        <div className="absolute top-[40%] -left-40 w-[600px] h-[600px] bg-brand-orange/5 blur-[160px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Swalekhani Official Format Library
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white mb-6 leading-tight">
            Official Letterpad <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky bg-clip-text text-transparent">
              Templates & Presets
            </span>
          </h1>

          <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            Choose from authentic Government of India, India Post, State Secretariat, and Professional formats. Customize headers, logos, and draft with Groq AI instantly.
          </p>

          {/* Quick Action Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/tools/letterpad-generator"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky text-white font-medium text-base shadow-[0_10px_30px_rgba(255,100,50,0.25)] hover:shadow-[0_15px_40px_rgba(255,100,50,0.35)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Launch Swalekhani Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card p-4 sm:p-6 mb-12 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search templates (e.g. India Post, MP, Ministry, Bilingual)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-white/10 text-white border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="glass-card group relative flex flex-col justify-between p-6 rounded-3xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${template.bg} ${template.border} border flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className={`w-6 h-6 ${template.accent}`} />
                    </div>
                    <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60">
                      {template.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-semibold text-xl text-white mb-2 group-hover:text-white transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed mb-6">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.05] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-white/[0.05]">
                  <Link
                    href={`/tools/letterpad-generator`}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/10 text-sm font-medium text-white/80 hover:text-white transition-all group/btn"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover/btn:translate-x-1 group-hover/btn:text-white transition-all" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No templates found</h3>
            <p className="text-sm text-white/50 mb-6">Try searching for other keywords like "India Post", "Ministry", or "Bilingual".</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="px-5 py-2 rounded-xl bg-white/10 text-sm font-medium hover:bg-white/15 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Feature Highlights Section */}
        <div className="mt-24 p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent backdrop-blur-xl">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
              Why Swalekhani is India's Standard for Official Drafting
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Every template is built according to authentic Central and State government typographical conventions, with integrated Groq AI draft generation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Strict Indian Formats",
                desc: "Accurate file numbering, Subject-Reference alignment, and Annexure tags.",
              },
              {
                title: "Bilingual Devanagari",
                desc: "High-quality Devanagari typography paired smoothly with English headings.",
              },
              {
                title: "Groq AI Speed",
                desc: "Generate professional Hindi, English, or bilingual drafts in under 2 seconds.",
              },
              {
                title: "Print-Ready Vector PDF",
                desc: "Pixel-perfect A4 canvas with direct client-side PDF export without watermarks.",
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <CheckCircle2 className="w-5 h-5 text-brand-orange mb-3" />
                <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
