import "server-only";
import { headers } from "next/headers";

/**
 * Minimal in-memory fixed-window rate limiter. Good enough for a single server;
 * use Redis/Upstash when running multiple instances.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function clientIp() {
  const h = headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return true;
  }
  b.count++;
  return b.count <= limit;
}
