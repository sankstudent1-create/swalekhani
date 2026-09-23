import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Offline Mode | Swalekhani',
  description: 'Swalekhani offline application mode.',
  alternates: {
    canonical: '/offline',
  },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Offline Mode</p>
        <h1 className="mt-3 text-3xl font-bold">You are offline</h1>
        <p className="mt-3 text-foreground/70">
          Swalekhani is available in offline mode for cached pages and assets. Reconnect to access real-time AI drafting and updates.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="ui-btn-primary">Open Letterpad Studio</Link>
          <Link href="/about" className="ui-btn-secondary">About Swalekhani</Link>
        </div>
      </section>
    </main>
  );
}
