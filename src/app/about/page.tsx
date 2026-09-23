"use client";

import Link from "next/link";

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function LightbulbIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "SW InfoSystems",
    role: "Founded 2008",
    description: "Established tech company specializing in practical software products for education, operations, publishing, and enterprise workflows.",
  },
  {
    name: "Swalekhani AI Team",
    role: "Core Engineering",
    description: "Engineers and designers focused on building the most intuitive, bilingual, AI-assisted letterpad and document creator for India and global offices.",
  },
];

const values = [
  {
    icon: LightbulbIcon,
    title: "Intelligent Drafting",
    description: "Empowering users with ultra-fast Groq AI models to compose articulate official letters, applications, and memorandums in seconds.",
  },
  {
    icon: HeartIcon,
    title: "Standardized Formats",
    description: "Crafted following official Government of India, departmental, and institutional letterpad typographical standards.",
  },
  {
    icon: UsersIcon,
    title: "Bilingual First",
    description: "Native support for Hindi (राजभाषा), English, and side-by-side bilingual headings with Devanagari typography.",
  },
  {
    icon: GlobeIcon,
    title: "Privacy & Speed",
    description: "Client-side rendering, instant signature signing, and direct pixel-perfect PDF export without external file storage.",
  },
];

export default function AboutPage() {
  const websiteUrl = process.env.NEXT_PUBLIC_COMPANY_WEBSITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.swinfosystems.com";
  const websiteLabel = websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-orange/10 via-brand-pink/5 to-brand-sky/10" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="space-y-6 animate-fade-in-up">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Studio
            </Link>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                About
                <span className="block bg-gradient-to-r from-brand-orange via-brand-pink to-brand-sky bg-clip-text text-transparent">
                  Swalekhani
                </span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-foreground/75 leading-relaxed">
                India's modern AI-powered Letterpad Studio & Official Document Creator, developed by SW InfoSystems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 border-t border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-lg text-foreground/75 leading-relaxed">
                Drafting official correspondence, departmental endorsements, RTI responses, and formal letterpads shouldn't require complex Word formatting or guesswork. Swalekhani combines AI intelligence with authentic Indian departmental formats to make professional drafting effortless for government officers, employees, professionals, and citizens.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="space-y-3">
                  <value.icon className="w-10 h-10 text-brand-orange" />
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="text-foreground/70">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-brand-orange/5 via-transparent to-brand-sky/5 border-t border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="space-y-12">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">About SW InfoSystems</h2>
              <p className="text-lg text-foreground/70">Building trusted software solutions since 2008</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">🏢</span> Company Heritage
                </h3>
                <p className="text-foreground/75 leading-relaxed">
                  SW InfoSystems is an established technology company with over 15 years of experience building software for education, operations, publishing, and digital workflows across India.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">✍️</span> The Swalekhani Vision
                </h3>
                <p className="text-foreground/75 leading-relaxed">
                  Swalekhani represents the modern digital evolution of the traditional Indian letterpad ("स्व-लेखनी"). Designed to bridge the gap between AI speed and strict administrative decorum, it enables clean bilingual typography, emblem positioning, endorsement numbering, and direct A4 PDF exports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Swalekhani */}
      <section className="py-20 md:py-32 border-t border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose Swalekhani?</h2>
              <p className="text-lg text-foreground/70">Designed specifically for official, departmental, and personal letter writing</p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  title: "AI Co-Pilot with Real-Time Drafts",
                  desc: "Intelligent prompts allow you to generate complete official letters, request drafts, or replies in seconds using cutting-edge LLMs.",
                },
                {
                  title: "Official Government & Departmental Formats",
                  desc: "Preconfigured templates for Government of India, India Post, State Secretariats, Educational Institutes, and Corporate Letterheads.",
                },
                {
                  title: "Bilingual Header & Emblem Alignment",
                  desc: "Effortlessly place National Emblems, Department Logos, and dual Hindi/English header titles with proper typographical balance.",
                },
                {
                  title: "Endorsement & Copy-To Section Controls",
                  desc: "Native support for complex administrative workflows including Endorsement Blocks, Copy To recipients, and Annexure / Enclosure listings.",
                },
                {
                  title: "Built-In Digital Signature Pad",
                  desc: "Draw, upload, or adjust your signature directly on the canvas without leaving the editor.",
                },
                {
                  title: "100% Client-Side Privacy & Crisp PDF Export",
                  desc: "Your letter content remains in your browser. Generate print-ready vector A4 PDFs without watermarks.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-foreground/10 hover:border-brand-orange/30 hover:bg-brand-orange/5 transition-all">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-brand-orange to-brand-pink text-white font-semibold">
                      {idx + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-foreground/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-brand-orange/10 via-brand-pink/5 to-brand-sky/10 border-t border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
            <p className="text-lg text-foreground/70">Have questions or feedback on Swalekhani? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-xl border border-foreground/10 bg-background/50">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold mb-2">Company Website</h3>
              <p className="text-foreground/70">
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                  {websiteLabel}
                </a>
              </p>
            </div>

            <div className="p-6 rounded-xl border border-foreground/10 bg-background/50">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-foreground/70">
                <a href="mailto:support@swinfosystems.com" className="hover:text-brand-orange transition-colors">
                  support@swinfosystems.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-foreground/10">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Create Your Letterpad?</h2>
            <p className="text-lg text-foreground/70">Launch Swalekhani Letterpad Studio now and generate your official letter in seconds.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-orange to-brand-pink text-white hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Open Swalekhani Studio
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <p className="text-sm text-foreground/60">
            &copy; 2026 Swalekhani. A product of SW InfoSystems. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
