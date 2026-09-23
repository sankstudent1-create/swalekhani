import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Official Letterpad Templates & Format Library - Swalekhani",
  description: "Browse official Government of India, India Post, State Secretariat, Legislative, and Corporate letterhead templates. Draft instantly with Groq AI and export print-ready PDFs.",
  keywords: [
    "official letterpad templates",
    "government letterhead format library",
    "bilingual letterhead presets",
    "india post letterpad format",
    "corporate letterhead maker"
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Official Letterpad Templates & Format Library | Swalekhani",
    description: "Browse and customize authentic government, academic, and business letterpads with AI drafting.",
    url: "https://www.swalekhani.com/tools",
    images: ["/icon-512.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Letterpad Templates Library | Swalekhani",
    description: "Authentic government and business letterhead templates.",
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
