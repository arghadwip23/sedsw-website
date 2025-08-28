// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://seds-antariksh-vitc.in";
  return [
    { url: base, lastModified: new Date().toISOString() },
    { url: `${base}/#about`, lastModified: new Date().toISOString() },
    { url: `${base}/#projects`, lastModified: new Date().toISOString() },
    { url: `${base}/#outreach`, lastModified: new Date().toISOString() },
    { url: `${base}/#team`, lastModified: new Date().toISOString() },
    { url: `${base}/#contact`, lastModified: new Date().toISOString() },
  ];
}
