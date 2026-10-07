import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function readingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(d: Date | string, locale = "en") {
  return new Date(d).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length < 200;
}

/** Trim and length-limit untrusted string input */
export function clean(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
