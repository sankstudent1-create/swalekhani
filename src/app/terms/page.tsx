import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Swalekhani AI Official Letterpad Platform.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#07090f] text-white/80 p-8 pt-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Swalekhani, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
          <p>Swalekhani provides users with tools for generating and formatting letters, documents, and other content ("Service"). You understand and agree that the Service is provided "AS-IS".</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. User Conduct</h2>
          <p>You agree to not use the Service to generate content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, or otherwise objectionable.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">4. Intellectual Property</h2>
          <p>The letters and content you generate using our tool belong to you. The platform itself, its branding, design, and original code belong to SW Info Systems.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">5. Modifications to Service</h2>
          <p>We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
        </section>
      </div>
    </main>
  );
}
