import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, products, projects, posts, jobs] = await Promise.all([
    db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.job.findMany({ where: { published: true }, select: { slug: true, postedAt: true } }),
  ]);
  const now = new Date();
  const statics = ["", "/services", "/products", "/portfolio", "/about", "/careers", "/blog", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.3 : 0.8,
  }));
  return [
    ...statics,
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, lastModified: s.updatedAt, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/portfolio/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
    ...jobs.map((j) => ({ url: `${site.url}/careers/${j.slug}`, lastModified: j.postedAt, priority: 0.6 })),
  ];
}
