// components/MetaInjector.tsx
"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { STATIC_METADATA } from "@/lib/staticMetadata";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function MetaInjector() {
  const path = usePathname();
  const meta = STATIC_METADATA[path] ?? STATIC_METADATA["/"];

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords.join(", ")} />}

      {/* Open Graph */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}${path}`} />
      <meta property="og:image" content={`${siteUrl}${meta.image}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={`${siteUrl}${meta.image}`} />

      {/* Canonical */}
      <link rel="canonical" href={`${siteUrl}${path}`} />
    </Head>
  );
}
