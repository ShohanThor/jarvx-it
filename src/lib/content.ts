import "server-only";
import { cache } from "react";
import { db } from "./db";
import { parseJson, readingTime } from "./utils";
import type { Lang } from "./i18n/dictionaries";

type I18n = Record<string, Record<string, string>>;

/** Apply translated fields stored in the `i18n` JSON column, falling back to the default language */
function localize<T extends { i18n: string }>(item: T, lang: Lang): T {
  if (lang === "en") return item;
  const tr = parseJson<I18n>(item.i18n, {})[lang];
  if (!tr) return item;
  const out = { ...item } as Record<string, unknown>;
  for (const [k, v] of Object.entries(tr)) if (v) out[k] = v;
  return out as T;
}

export type Step = { title: string; desc: string };
export type Plan = { name: string; monthly: number; yearly: number; features: string[] };
export type Result = { label: string; value: string };

const mapService = (s: Awaited<ReturnType<typeof db.service.findFirstOrThrow>>, lang: Lang) => {
  const l = localize(s, lang);
  return { ...l, features: parseJson<string[]>(s.features, []), process: parseJson<Step[]>(s.process, []) };
};
export type ServiceT = ReturnType<typeof mapService>;

export const getServices = cache(async (lang: Lang = "en") =>
  (await db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } })).map((s) => mapService(s, lang)),
);
export const getService = cache(async (slug: string, lang: Lang = "en") => {
  const s = await db.service.findFirst({ where: { slug, published: true } });
  return s ? mapService(s, lang) : null;
});

const mapProduct = (p: Awaited<ReturnType<typeof db.product.findFirstOrThrow>>, lang: Lang) => ({
  ...localize(p, lang),
  features: parseJson<string[]>(p.features, []),
  screenshots: parseJson<string[]>(p.screenshots, []),
  plans: parseJson<Plan[]>(p.plans, []),
});
export type ProductT = ReturnType<typeof mapProduct>;

export const getProducts = cache(async (lang: Lang = "en") =>
  (await db.product.findMany({ where: { published: true }, orderBy: { order: "asc" } })).map((p) => mapProduct(p, lang)),
);
export const getProduct = cache(async (slug: string, lang: Lang = "en") => {
  const p = await db.product.findFirst({ where: { slug, published: true } });
  return p ? mapProduct(p, lang) : null;
});

const mapProject = (p: Awaited<ReturnType<typeof db.project.findFirstOrThrow>>) => ({
  ...p,
  tech: parseJson<string[]>(p.tech, []),
  results: parseJson<Result[]>(p.results, []),
  gallery: parseJson<string[]>(p.gallery, []),
  serviceSlugs: parseJson<string[]>(p.serviceSlugs, []),
});
export type ProjectT = ReturnType<typeof mapProject>;

export const getProjects = cache(async () =>
  (await db.project.findMany({ where: { published: true }, orderBy: { order: "asc" } })).map(mapProject),
);
export const getProject = cache(async (slug: string) => {
  const p = await db.project.findFirst({ where: { slug, published: true } });
  return p ? mapProject(p) : null;
});

const mapPost = (p: Awaited<ReturnType<typeof db.post.findFirstOrThrow>>) => ({
  ...p,
  tags: parseJson<string[]>(p.tags, []),
  readingTime: readingTime(p.content),
});
export type PostT = ReturnType<typeof mapPost>;

export const getPosts = cache(async () =>
  (await db.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } })).map(mapPost),
);
export const getPost = cache(async (slug: string) => {
  const p = await db.post.findFirst({ where: { slug, published: true } });
  return p ? mapPost(p) : null;
});

const mapJob = (j: Awaited<ReturnType<typeof db.job.findFirstOrThrow>>) => ({
  ...j,
  responsibilities: parseJson<string[]>(j.responsibilities, []),
  requirements: parseJson<string[]>(j.requirements, []),
});
export type JobT = ReturnType<typeof mapJob>;

export const getJobs = cache(async () =>
  (await db.job.findMany({ where: { published: true }, orderBy: { postedAt: "desc" } })).map(mapJob),
);
export const getJob = cache(async (slug: string) => {
  const j = await db.job.findFirst({ where: { slug, published: true } });
  return j ? mapJob(j) : null;
});

export const getStats = cache(async (lang: Lang = "en") =>
  (await db.stat.findMany({ orderBy: { order: "asc" } })).map((s) => localize(s, lang)),
);
export const getFaqs = cache(async (lang: Lang = "en") =>
  (await db.faq.findMany({ where: { published: true }, orderBy: { order: "asc" } })).map((f) => localize(f, lang)),
);
export const getTestimonials = cache(() => db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }));
export const getClients = cache(() => db.clientLogo.findMany({ orderBy: { order: "asc" } }));
export const getTeam = cache(() => db.teamMember.findMany({ orderBy: { order: "asc" } }));
