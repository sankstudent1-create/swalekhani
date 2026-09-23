import type { MetadataRoute } from "next";

const routes: { path: string; priority: number; changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/tools/letterpad-generator", priority: 1.0, changeFrequency: "daily" },
  { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates/government-letterpad", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates/company-letterpad", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates/school-letterpad", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates/doctor-letterpad", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates/shop-letterpad", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates/advocate", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/ca-accountant", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/real-estate-dealer", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/coaching-classes", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/clinic", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/restaurant-hotel", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/ngo-trust", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/contractor-builder", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/housing-society", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/political-leader", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/gram-panchayat", priority: 0.85, changeFrequency: "weekly" },
  { path: "/templates/freelancer", priority: 0.85, changeFrequency: "weekly" },
  { path: "/formats/office-order", priority: 0.9, changeFrequency: "weekly" },
  { path: "/formats/rti-application", priority: 0.9, changeFrequency: "weekly" },
  { path: "/formats/leave-application", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.5, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://swalekhani.vercel.app";
  const now = new Date();

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
