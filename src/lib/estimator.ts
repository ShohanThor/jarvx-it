import { site } from "./site";

/** Indicative pricing model (USD). Tune these numbers to match your real rates. */
export const ESTIMATOR = {
  types: { web: 1500, webapp: 6000, mobile: 7000, ecommerce: 4000, ai: 5000, enterprise: 15000 },
  features: { auth: 600, payments: 1200, admin: 1500, chat: 1800, ai: 2500, integrations: 1500, multilang: 700, analytics: 1200 },
  designs: { basic: 1, custom: 1.25, premium: 1.6 },
  timelines: { relaxed: 0.95, standard: 1, rush: 1.35 },
} as const;

export type ProjectType = keyof typeof ESTIMATOR.types;
export type Feature = keyof typeof ESTIMATOR.features;
export type Design = keyof typeof ESTIMATOR.designs;
export type Timeline = keyof typeof ESTIMATOR.timelines;

export type Selection = { type: ProjectType; features: Feature[]; design: Design; timeline: Timeline };

export function estimate(sel: Selection) {
  const base = ESTIMATOR.types[sel.type] + sel.features.reduce((sum, f) => sum + ESTIMATOR.features[f], 0);
  const total = base * ESTIMATOR.designs[sel.design] * ESTIMATOR.timelines[sel.timeline];
  const round = (n: number, step: number) => Math.round(n / step) * step;
  const usd = { low: round(total * 0.85, 100), high: round(total * 1.25, 100) };
  const bdt = { low: round(usd.low * site.usdToBdt, 10000), high: round(usd.high * site.usdToBdt, 10000) };
  const weeks = Math.max(2, Math.round((total / 1800) * (sel.timeline === "rush" ? 0.6 : sel.timeline === "relaxed" ? 1.3 : 1)));
  return { usd, bdt, weeks };
}
