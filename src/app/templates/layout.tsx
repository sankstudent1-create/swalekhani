import type { Metadata } from 'next';

export const metadata: Metadata = {
 title: 'Professional Letterhead & Profession Template Library',
 description: 'Browse authentic, professionally structured letterhead templates for Advocates, CAs, Doctors, Real Estate, Companies, NGOs, and Clinics. Customize and export print-ready A4 PDFs.',
 keywords: [
 'letterhead templates',
 'advocate letterhead format',
 'chartered accountant letterhead format',
 'company letterhead format',
 'doctor letterhead format',
 'real estate letterhead format',
 'swalekhani profession templates'
 ],
 alternates: {
 canonical: '/templates',
 },
 openGraph: {
 title: 'Professional Letterhead & Profession Template Library',
 description: 'Browse 12+ authentic, professionally structured letterheads for Indian professions and businesses.',
 url: 'https://swalekhani.vercel.app/templates',
 images: ['/icon-512.png'],
 type: 'website',
 },
 twitter: {
 card: 'summary_large_image',
 title: 'Professional Letterhead & Profession Template Library',
 description: '12+ authentic letterhead templates for Advocates, CAs, Doctors, NGOs, and Companies.',
 images: ['/icon-512.png'],
 },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
 return children;
}
