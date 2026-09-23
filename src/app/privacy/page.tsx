import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Swalekhani AI Official Letterpad Platform.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#07090f] text-white/80 p-8 pt-24 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide to us when you use Swalekhani, such as your name, email address, or any information you enter into the letterpad generator.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to operate, maintain, and improve our services, as well as to personalize your experience and display relevant advertisements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. Third-Party Advertisers (Google AdSense)</h2>
          <p>We use Google AdSense to display ads on our platform. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">4. Log Files</h2>
          <p>Like many other websites, we use log files. These files merely log visitors to the site - usually a standard procedure for hosting companies and a part of hosting services's analytics. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and possibly the number of clicks.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us through our Contact page.</p>
        </section>
      </div>
    </main>
  );
}
