"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Sparkles, Building, Landmark, Scale, Briefcase, 
  Stethoscope, GraduationCap, Home, Users, ArrowRight, CheckCircle2,
  ShieldCheck, FileText, UtensilsCrossed, HardHat, Code2
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
  // 5 Core Established Templates
  {
    slug: 'government-letterpad',
    name: 'Government Office & Ministry Letterhead',
    category: 'Public',
    badge: 'GoI Rajbhasha Standard',
    description: 'Bilingual letterhead with Ashoka Lion Capital, Ministry header, file number alignment, and numbered paragraphing.',
    href: '/templates/government-letterpad',
    generatorHref: '/tools/letterpad-generator?preset=dop&tpl=A',
    icon: Landmark,
    accentColor: '#38bdf8',
    bgGlow: 'bg-sky-500/10',
    tags: ['Government', 'Ministry', 'Bilingual', 'Ashoka Emblem', 'Central Gov']
  },
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
    slug: 'political-leader',
    name: 'Public Representative / लोकप्रतिनिधी',
    category: 'Public',
    badge: 'Constituency Standard',
    description: PROFESSION_TEMPLATES['political-leader'].shortDesc,
    href: '/templates/political-leader',
    generatorHref: '/tools/letterpad-generator?template=political-leader',
    icon: ShieldCheck,
    accentColor: '#ea580c',
    bgGlow: 'bg-orange-500/10',
    tags: ['Public Representative', 'Corporator', 'Lokpratinidhi', 'Constituency', 'Bilingual']
  },
  {
    slug: 'gram-panchayat',
    name: 'Gram Panchayat & Village Administration',
    category: 'Public',
    badge: 'Panchayati Raj Standard',
    description: PROFESSION_TEMPLATES['gram-panchayat'].shortDesc,
    href: '/templates/gram-panchayat',
    generatorHref: '/tools/letterpad-generator?template=gram-panchayat',
    icon: Landmark,
    accentColor: '#d97706',
    bgGlow: 'bg-amber-500/10',
    tags: ['Gram Panchayat', 'Sarpanch', 'Gram Sevak', 'Tricolor', 'Devanagari', 'Village']
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
    <main className="min-h-screen bg-[#07090f] text-white pt-24 pb-20 selection:bg-brand-pink/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-orange/10 blur-[160px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>17 Official Formats & Profession Presets</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight mb-4 leading-tight">
            Official Letterhead & Profession Template Library
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Choose from authentic, legally structured letterhead templates tailored for Indian advocates, CAs, doctors, businesses, gram panchayats, and government ministries.
          </p>
        </div>

        {/* In-article Ad Slot */}
        {adsEnabled && <AdSlot slotKey="gallery-top" label="Sponsored Content" />}

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by profession, keyword, statutory code (e.g. RERA, Bar Council, PWD)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder-white/40 focus:outline-none focus:border-brand-orange transition-colors shadow-lg"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-white/[0.03] text-white/70 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.slug}
                className="group relative rounded-3xl bg-[#0d1017] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1.5"
              >
                {/* 3D Illustration Banner or Accent Header */}
                {tpl.image ? (
                  <div className="relative h-44 w-full overflow-hidden bg-black/60 border-b border-white/[0.06]">
                    <img 
                      src={tpl.image} 
                      alt={tpl.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-[#0d1017]/40 to-transparent"></div>
                    <div className="absolute top-3.5 right-3.5">
                      <span 
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 bg-black/70 backdrop-blur-md uppercase tracking-wider shadow-md"
                        style={{ color: tpl.accentColor }}
                      >
                        {tpl.badge}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="relative h-16 w-full p-4 flex items-center justify-between border-b border-white/[0.06]"
                    style={{ background: `linear-gradient(135deg, ${tpl.accentColor}18, transparent)` }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${tpl.accentColor}22` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: tpl.accentColor }} />
                    </div>
                    <span 
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wide"
                      style={{ 
                        color: tpl.accentColor,
                        borderColor: `${tpl.accentColor}33`,
                        backgroundColor: `${tpl.accentColor}11`
                      }}
                    >
                      {tpl.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider font-mono">
                      {tpl.category}
                    </span>

                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-brand-orange transition-colors">
                      {tpl.name}
                    </h3>

                    <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tpl.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-white/40 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.04]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center gap-2.5">
                    <Link
                      href={tpl.href}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View Format</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                    </Link>

                    <Link
                      href={tpl.generatorHref}
                      className="py-2.5 px-4 rounded-xl bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange text-xs font-semibold border border-brand-orange/30 text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <p className="text-white/60 text-sm">No templates matched your search for &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Educational Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-white/[0.03] via-white/[0.05] to-white/[0.03] border border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center justify-center md:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Statutory Compliance</span>
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Pre-formatted for Bar Council, ICAI, RERA, NMC Medical, PWD, and Panchayati Raj regulations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center justify-center md:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Devanagari Bilingual</span>
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Full Rajbhasha Hindi and Marathi font engine with bilingual ministry and local government layouts.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center justify-center md:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Print-Ready Vector PDF</span>
              </h4>
              <p className="text-xs text-white/50 leading-relaxed">
                1-click instant vector A4 PDF export or direct printing on executive letterhead bond stationery.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
