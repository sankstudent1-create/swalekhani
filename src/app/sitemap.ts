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
  { path: "/formats/office-order", priority: 0.9, changeFrequency: "weekly" },
  { path: "/formats/rti-application", priority: 0.9, changeFrequency: "weekly" },
  { path: "/formats/leave-application", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.5, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.5, changeFrequency: "monthly" },
  { path: "/offline", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.swalekhani.com";
  const now = new Date();

  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
