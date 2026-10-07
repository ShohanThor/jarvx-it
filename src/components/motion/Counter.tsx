"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

/**
 * The real value is rendered on the server (SEO-safe). When the number scrolls into view
 * it animates from zero to the value. Off-screen it simply shows the final number.
 */
export function Counter({ value, suffix = "", className, locale = "en" }: { value: number; suffix?: string; className?: string; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => Math.round(n).toLocaleString(locale === "bn" ? "bn-BD" : "en-US");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        controls = animate(0, value, {
          duration: 2,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => (el.textContent = fmt(v)),
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref}>{fmt(value)}</span>
      {suffix}
    </span>
  );
}
