import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swalekhani | Official AI Letterpad Studio & Document Generator',
  description: 'Swalekhani is India\'s premier AI-powered official letterpad generator. Draft perfectly formatted Government of India, bilingual Hindi-English, and professional letters instantly with Groq AI and direct vector PDF export.',
  keywords: [
    "swalekhani",
    "official letterpad generator",
    "government letter format maker",
    "ai letter writer",
    "bilingual hindi letter generator",
    "india post letterpad",
    "sw infosystems"
  ],
  alternates: {
    canonical: '/tools/letterpad-generator'
  },
  openGraph: {
    title: 'Swalekhani | Official AI Letterpad Studio & Generator',
    description: 'AI-powered official letterpad and document generator. Draft perfectly formatted official, government, and bilingual letters instantly.',
    url: 'https://www.swalekhani.com/tools/letterpad-generator',
    images: ['/icon-512.png'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swalekhani | Official AI Letterpad Studio',
    description: 'AI-powered official letterpad and document generator with print-ready PDF export.',
    images: ['/icon-512.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
