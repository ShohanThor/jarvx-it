import type { Metadata } from "next";
import { site } from "./site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  /** Overrides the auto-generated OG image */
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export function ogImageUrl(title: string, subtitle?: string) {
  const p = new URLSearchParams({ title });
  if (subtitle) p.set("subtitle", subtitle.slice(0, 140));
  return `/api/og?${p.toString()}`;
}

export function buildMetadata({ title, description, path, image, type = "website", noindex }: MetaInput): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}` || site.url;
  const img = image ?? ogImageUrl(title, description);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type,
      locale: "en_US",
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [img] },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
