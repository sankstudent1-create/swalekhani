import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Letterhead & Profession Template Library',
  description: 'Browse authentic, legally compliant official letterhead templates for Advocates, CAs, Doctors, Real Estate, Gram Panchayats, NGOs, and Government Offices. Customize and export print-ready A4 PDFs.',
  keywords: [
    'letterhead templates',
    'advocate letterhead format',
    'chartered accountant letterhead format',
    'gram panchayat letterpad format',
    'doctor letterhead format',
    'real estate letterhead format',
    'swalekhani profession templates'
  ],
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Official Letterhead & Profession Template Library',
    description: 'Browse 17+ authentic, legally compliant official letterheads for Indian professions, businesses, and government bodies.',
    url: 'https://swalekhani.vercel.app/templates',
    images: ['/icon-512.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official Letterhead & Profession Template Library',
    description: '17+ authentic letterhead templates for Advocates, CAs, Doctors, NGOs, and Government Offices.',
    images: ['/icon-512.png'],
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
