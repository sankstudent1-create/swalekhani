"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
 Search, Sparkles, Building, Scale, Briefcase, 
 Stethoscope, GraduationCap, Home, Users, ArrowRight, CheckCircle2,
 FileText, UtensilsCrossed, HardHat, Code2
} from 'lucide-react';
import { PROFESSION_TEMPLATES } from '@/data/profession-templates';
import AdSlot from '@/components/AdSlot';

interface GalleryTemplate {
 slug: string;
 name: string;
 category: 'Legal' | 'Medical' | 'Business' | 'Public' | 'Education';
 badge: string;
 description: string;
 href: string;
 generatorHref: string;
 icon: any;
 image?: string;
 accentColor: string;
 bgGlow: string;
 tags: string[];
}

const ALL_GALLERY_TEMPLATES: GalleryTemplate[] = [
 // 4 Core Established Templates
 {
 slug: 'advocate',
 name: 'Advocate & Legal Practitioner Letterhead',
 category: 'Legal',
 badge: 'Bar Council Standard',
 description: PROFESSION_TEMPLATES['advocate'].shortDesc,
 href: '/templates/advocate',
 generatorHref: '/tools/letterpad-generator?template=advocate',
 icon: Scale,
 image: '/illustrations/advocate-3d.jpg',
 accentColor: '#d97706',
 bgGlow: 'bg-amber-500/10',
 tags: ['Advocate', 'Legal Notice', 'Bar Council', 'High Court', 'Law Chambers']
 },
 {
 slug: 'company-letterpad',
 name: 'Company Letterhead Maker Online',
 category: 'Business',
 badge: 'MCA & Companies Act',
 description: 'Section 12(3)(c) compliant corporate stationery with CIN, GSTIN, registered office, and brand logo placement.',
 href: '/templates/company-letterpad',
 generatorHref: '/tools/letterpad-generator?preset=company&tpl=B',
 icon: Building,
 accentColor: '#818cf8',
 bgGlow: 'bg-indigo-500/10',
 tags: ['Corporate', 'CIN', 'GSTIN', 'Private Limited', 'LLP']
 },
 {
 slug: 'school-letterpad',
 name: 'School & College Academic Letterhead',
 category: 'Education',
 badge: 'CBSE / ICSE / State Board',
 description: 'Institutional letterhead with school crest motto, board affiliation codes, and bonafide certification layouts.',
 href: '/templates/school-letterpad',
 generatorHref: '/tools/letterpad-generator?preset=school&tpl=D',
 icon: GraduationCap,
 accentColor: '#34d399',
 bgGlow: 'bg-emerald-500/10',
 tags: ['School', 'College', 'Affiliation', 'Bonafide', 'Academic']
 },
 {
 slug: 'doctor-letterpad',
 name: 'Doctor Letterhead & Rx Prescription Pad',
 category: 'Medical',
 badge: 'NMC Ethics 2023',
 description: 'Medical council compliant Rx prescription letterhead with clinic timings, qualification, and vital stats block.',
 href: '/templates/doctor-letterpad',
 generatorHref: '/tools/letterpad-generator?preset=doctor&tpl=C',
 icon: Stethoscope,
 accentColor: '#22d3ee',
 bgGlow: 'bg-cyan-500/10',
 tags: ['Doctor', 'Prescription', 'NMC', 'Rx Pad', 'Medical']
 },
 {
 slug: 'shop-letterpad',
 name: 'Shop & Retail Business Letterhead',
 category: 'Business',
 badge: 'MSME & GST Compliant',
 description: 'Commercial business pad for trade firms, retail shops, wholesale dealers with GSTIN, address, and bank footer.',
 href: '/templates/shop-letterpad',
 generatorHref: '/tools/letterpad-generator?preset=shop&tpl=B',
 icon: Briefcase,
 accentColor: '#fb923c',
 bgGlow: 'bg-orange-500/10',
 tags: ['Shop', 'Retail', 'GSTIN', 'Quotation', 'MSME']
 },
 {
 slug: 'ca-accountant',
 name: 'Chartered Accountant & Audit Firm',
 category: 'Legal',
 badge: 'ICAI Compliant',
 description: PROFESSION_TEMPLATES['ca-accountant'].shortDesc,
 href: '/templates/ca-accountant',
 generatorHref: '/tools/letterpad-generator?template=ca-accountant',
 icon: FileText,
 accentColor: '#2563eb',
 bgGlow: 'bg-blue-500/10',
 tags: ['CA', 'Chartered Accountant', 'ICAI', 'FRN', 'UDIN', 'Audit']
 },
 {
 slug: 'real-estate-dealer',
 name: 'Real Estate & Property Consultant',
 category: 'Business',
 badge: 'RERA Compliant',
 description: PROFESSION_TEMPLATES['real-estate-dealer'].shortDesc,
 href: '/templates/real-estate-dealer',
 generatorHref: '/tools/letterpad-generator?template=real-estate-dealer',
 icon: Home,
 accentColor: '#059669',
 bgGlow: 'bg-emerald-500/10',
 tags: ['Real Estate', 'RERA', 'Property Broker', 'Realtor', 'Housing']
 },
 {
 slug: 'coaching-classes',
 name: 'Coaching Classes & Academy',
 category: 'Education',
 badge: 'Academic Standard',
 description: PROFESSION_TEMPLATES['coaching-classes'].shortDesc,
 href: '/templates/coaching-classes',
 generatorHref: '/tools/letterpad-generator?template=coaching-classes',
 icon: GraduationCap,
 accentColor: '#6366f1',
 bgGlow: 'bg-indigo-500/10',
 tags: ['Coaching', 'Tuition', 'IIT-JEE', 'NEET', 'Academy']
 },
 {
 slug: 'clinic',
 name: 'Polyclinic & Healthcare Centre',
 category: 'Medical',
 badge: 'NMC & CEA Compliant',
 description: PROFESSION_TEMPLATES['clinic'].shortDesc,
 href: '/templates/clinic',
 generatorHref: '/tools/letterpad-generator?template=clinic',
 icon: Stethoscope,
 accentColor: '#0891b2',
 bgGlow: 'bg-cyan-500/10',
 tags: ['Clinic', 'Polyclinic', 'Diagnostics', 'Medical Centre', 'Doctors']
 },
 {
 slug: 'restaurant-hotel',
 name: 'Restaurant, Hotel & Hospitality',
 category: 'Business',
 badge: 'FSSAI Compliant',
 description: PROFESSION_TEMPLATES['restaurant-hotel'].shortDesc,
 href: '/templates/restaurant-hotel',
 generatorHref: '/tools/letterpad-generator?template=restaurant-hotel',
 icon: UtensilsCrossed,
 accentColor: '#e11d48',
 bgGlow: 'bg-rose-500/10',
 tags: ['Restaurant', 'Hotel', 'FSSAI', 'Banquet', 'Hospitality', 'Cafe']
 },
 {
 slug: 'ngo-trust',
 name: 'NGO, Non-Profit & Charitable Trust',
 category: 'Public',
 badge: '80G / 12A Compliant',
 description: PROFESSION_TEMPLATES['ngo-trust'].shortDesc,
 href: '/templates/ngo-trust',
 generatorHref: '/tools/letterpad-generator?template=ngo-trust',
 icon: Users,
 accentColor: '#0d9488',
 bgGlow: 'bg-teal-500/10',
 tags: ['NGO', 'Trust', 'Charity', '80G', '12A', 'DARPAN', 'CSR']
 },
 {
 slug: 'contractor-builder',
 name: 'Civil Contractor & Builder',
 category: 'Business',
 badge: 'PWD / CPWD Registered',
 description: PROFESSION_TEMPLATES['contractor-builder'].shortDesc,
 href: '/templates/contractor-builder',
 generatorHref: '/tools/letterpad-generator?template=contractor-builder',
 icon: HardHat,
 accentColor: '#b45309',
 bgGlow: 'bg-amber-500/10',
 tags: ['Contractor', 'Civil Works', 'PWD', 'Builder', 'Tender', 'Infra']
 },
 {
 slug: 'housing-society',
 name: 'Co-operative Housing Society (CHS)',
 category: 'Public',
 badge: 'Co-op Societies Act',
 description: PROFESSION_TEMPLATES['housing-society'].shortDesc,
 href: '/templates/housing-society',
 generatorHref: '/tools/letterpad-generator?template=housing-society',
 icon: Building,
 accentColor: '#2563eb',
 bgGlow: 'bg-blue-500/10',
 tags: ['Housing Society', 'CHS', 'RWA', 'Apartment', 'Society NOC']
 },
 {
 slug: 'freelancer',
 name: 'Freelancer & Digital Consultant',
 category: 'Business',
 badge: 'Modern Executive',
 description: PROFESSION_TEMPLATES['freelancer'].shortDesc,
 href: '/templates/freelancer',
 generatorHref: '/tools/letterpad-generator?template=freelancer',
 icon: Code2,
 accentColor: '#7c3aed',
 bgGlow: 'bg-violet-500/10',
 tags: ['Freelancer', 'Consultant', 'Software', 'Designer', 'Remote', 'Invoice']
 }
];

const CATEGORIES = ["All", "Legal", "Medical", "Business", "Public", "Education"];

export default function TemplatesGalleryPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("All");

 const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

 const filteredTemplates = useMemo(() => {
 return ALL_GALLERY_TEMPLATES.filter((tpl) => {
 const matchesSearch = 
 tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
 tpl.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
 tpl.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

 const matchesCategory = selectedCategory === "All" || tpl.category === selectedCategory;

 return matchesSearch && matchesCategory;
 });
 }, [searchQuery, selectedCategory]);

 return (
 <main className="min-h-screen bg-[#faf8f3] dark:bg-[#0a0d13] text-slate-900 dark:text-white pt-28 pb-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

 {/* Header */}
 <div className="text-center max-w-2xl mx-auto mb-10">
 <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">Template library</p>
 <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight mb-4">Pick your letterhead.</h1>
 <p className="text-slate-500 dark:text-white/50 leading-relaxed">
 Professionally structured letterheads for advocates, CAs, doctors, businesses, and freelancers — ready to customize in the Studio.
 </p>
 </div>

 {/* In-article Ad Slot */}
 {adsEnabled && <AdSlot slotKey="gallery-top" label="Sponsored Content" />}

 {/* Search & Filter */}
 <div className="mb-10 max-w-2xl mx-auto">
 <div className="relative mb-4">
 <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search professions, e.g. advocate, clinic, contractor…"
 className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10 text-sm placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-orange shadow-sm transition-colors"
 />
 </div>
 <div className="flex flex-wrap justify-center gap-2">
 {CATEGORIES.map((cat) => (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
 selectedCategory === cat
 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
 : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25'
 }`}
 >
 {cat}
 </button>
 ))}
 </div>
 </div>

 {/* Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {filteredTemplates.map((tpl) => {
 const Icon = tpl.icon;
 return (
 <div
 key={tpl.slug}
 className="group rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10 hover:border-brand-orange/40 hover:shadow-[0_20px_50px_-20px_rgba(232,118,43,0.35)] hover:-translate-y-1 transition-all flex flex-col overflow-hidden"
 >
 <div className="p-6 pb-0 flex items-start justify-between">
 <div
 className="w-12 h-12 rounded-2xl flex items-center justify-center"
 style={{ backgroundColor: `${tpl.accentColor}18` }}
 >
 <Icon className="w-6 h-6" style={{ color: tpl.accentColor }} />
 </div>
 <span
 className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
 style={{ color: tpl.accentColor, backgroundColor: `${tpl.accentColor}14` }}
 >
 {tpl.badge}
 </span>
 </div>
 <div className="p-6 pt-4 flex-1 flex flex-col">
 <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-1">{tpl.category}</p>
 <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-brand-orange transition-colors">{tpl.name}</h3>
 <p className="text-[13px] text-slate-500 dark:text-white/50 leading-relaxed line-clamp-2 mb-4">{tpl.description}</p>
 <div className="flex flex-wrap gap-1.5 mb-5">
 {tpl.tags.slice(0, 3).map((tag, idx) => (
 <span key={idx} className="text-[10px] font-medium text-slate-400 dark:text-white/40 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">#{tag}</span>
 ))}
 </div>
 <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/10 flex gap-2.5">
 <Link
 href={tpl.href}
 className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-center border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 transition-colors"
 >
 View format
 </Link>
 <Link
 href={tpl.generatorHref}
 className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-center bg-brand-orange text-white hover:brightness-95 transition-all inline-flex items-center justify-center gap-1.5"
 >
 <Sparkles className="w-3.5 h-3.5" /> Use it
 </Link>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 {/* Empty State */}
 {filteredTemplates.length === 0 && (
 <div className="text-center py-16 px-8 rounded-3xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10">
 <p className="text-slate-500 dark:text-white/50 text-sm mb-4">No templates matched &ldquo;{searchQuery}&rdquo;.</p>
 <button
 onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
 className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
 >
 Reset filters
 </button>
 </div>
 )}

 {/* Bottom strip */}
 <div className="mt-16 grid sm:grid-cols-3 gap-5">
 {[
 { title: 'Profession-grade formats', desc: 'Structured for Bar Council, ICAI, and medical council conventions.' },
 { title: 'Hindi · Marathi · English', desc: 'Full Devanagari font engine with bilingual layout support.' },
 { title: 'Print-ready vector PDF', desc: 'One-click A4 export — crisp at any zoom, no watermark.' },
 ].map((b) => (
 <div key={b.title} className="p-6 rounded-2xl bg-white dark:bg-[#11161f] border border-slate-200 dark:border-white/10">
 <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
 <h4 className="font-bold text-sm mb-1.5">{b.title}</h4>
 <p className="text-xs text-slate-500 dark:text-white/50 leading-relaxed">{b.desc}</p>
 </div>
 ))}
 </div>

 {/* Request CTA */}
 <div className="mt-8 p-8 sm:p-10 rounded-[2rem] bg-slate-900 dark:bg-white text-center relative overflow-hidden">
 <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl" aria-hidden />
 <div className="relative">
 <h3 className="font-heading font-bold text-2xl text-white dark:text-slate-900 mb-2">Need a letterhead for your profession?</h3>
 <p className="text-sm text-white/60 dark:text-slate-600 max-w-md mx-auto mb-6">Tell us your profession or business type — we&apos;ll add a tailored template to the gallery.</p>
 <a
 href="/contact"
 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold hover:scale-[1.03] transition-transform"
 >
 Request a template <ArrowRight className="w-4 h-4" />
 </a>
 </div>
 </div>

 </div>
 </main>
 );
}
