import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Professional Letterpad Templates & Format Library",
  description: "Browse corporate, startup, legal, healthcare, and personal letterhead templates. Draft instantly with Groq AI and export print-ready PDFs.",
  keywords: [
    "letterpad templates",
    "corporate letterhead format library",
    "bilingual letterhead presets",
    "business letterhead maker",
    "corporate letterhead maker"
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Professional Letterpad Templates & Format Library",
    description: "Browse and customize corporate, academic, and business letterpads with AI drafting.",
    url: "https://swalekhani.vercel.app/tools",
    images: ["/icon-512.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Letterpad Templates Library",
    description: "Corporate and business letterhead templates.",
    images: ["/icon-512.png"],
  },
};

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdSlot slotKey="tools-top" label="Tools Top Banner" />
      {children}
      <AdSlot slotKey="tools-bottom" label="Tools Bottom Banner" variant="inline" />
    </>
  );
}
