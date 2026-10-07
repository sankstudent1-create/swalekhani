import { Metadata } from 'next';
import GeneratorGuide from './GeneratorGuide';

export const metadata: Metadata = {
  title: 'Professional AI Letterpad Studio & Document Generator',
  description: 'Swalekhani is India\'s premier AI-powered letterpad generator. Draft perfectly formatted corporate, bilingual Hindi-English, and professional letters instantly with Groq AI and direct vector PDF export.',
  keywords: [
    "swalekhani",
    "letterpad generator",
    "business letter format maker",
    "ai letter writer",
    "bilingual hindi letter generator",
    "company letterhead maker",
    "sw infosystems"
  ],
  alternates: {
    canonical: '/tools/letterpad-generator'
  },
  openGraph: {
    title: 'Professional AI Letterpad Studio & Generator',
    description: 'AI-powered letterpad and document generator. Draft perfectly formatted corporate, business, and bilingual letters instantly.',
    url: 'https://swalekhani.vercel.app/tools/letterpad-generator',
    images: ['/icon-512.png'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional AI Letterpad Studio & Generator',
    description: 'AI-powered letterpad and document generator with print-ready PDF export.',
    images: ['/icon-512.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GeneratorGuide />
    </>
  );
}
