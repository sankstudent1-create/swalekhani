import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Swalekhani | AI Letterpad Studio & Official Document Creator',
  description: 'Learn about Swalekhani by SW InfoSystems — India’s modern AI-powered Letterpad Studio & Official Document Creator supporting bilingual Hindi-English typography and Groq AI drafting.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Swalekhani | AI Letterpad Studio',
    description: 'Learn about Swalekhani by SW InfoSystems — India’s modern AI-powered Letterpad Studio.',
    url: 'https://www.swalekhani.com/about',
    images: ['/icon-512.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Swalekhani',
    description: 'Learn about Swalekhani by SW InfoSystems.',
    images: ['/icon-512.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
