"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { J_PATH, X_PATH, LOGO_STROKE, LOGO_VIEWBOX } from "@/components/brand/logo-paths";

const KEY = "jx-intro";

/** Inline script (runs before paint) that skips the intro on repeat visits / reduced motion */
export const introScript = `try{if(sessionStorage.getItem('${KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-done')}catch(e){document.documentElement.classList.add('intro-done')}`;

/**
 * 1. The JX strokes draw themselves  2. the brand gradient fills in
 * 3. the mark flies into the navbar logo position, and the overlay fades away.
 */
export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const [stage, setStage] = useState<"draw" | "fill">("draw");
  const overlay = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("intro-done")) {
      setMounted(false);
      return;
    }
    let cancelled = false;
    const finish = () => {
      html.classList.add("intro-done");
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      if (!cancelled) setMounted(false);
    };
    const t1 = setTimeout(() => setStage("fill"), 1500);
    const t2 = setTimeout(async () => {
      const nav = document.querySelector<HTMLElement>("[data-nav-logo]");
      const el = mark.current;
      if (nav && el && overlay.current) {
        const a = el.getBoundingClientRect();
        const b = nav.getBoundingClientRect();
        const dx = b.left + b.width / 2 - (a.left + a.width / 2);
        const dy = b.top + b.height / 2 - (a.top + a.height / 2);
        const s = b.height / a.height;
        animate(overlay.current, { backgroundColor: "rgba(7,11,31,0)" }, { duration: 0.7, ease: "easeInOut" });
        // Race a timer so a throttled/background tab can never keep the overlay up
        await Promise.race([animate(el, { x: dx, y: dy, scale: s }, { duration: 0.85, ease: [0.76, 0, 0.24, 1] }), new Promise((r) => setTimeout(r, 1200))]);
      }
      finish();
    }, 2300);
    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!mounted) return null;
  return (
    <div ref={overlay} id="intro-loader" className="fixed inset-0 z-[9500] flex items-center justify-center bg-ink" aria-hidden>
      <div ref={mark} className="w-36 md:w-44">
        <svg viewBox={LOGO_VIEWBOX} fill="none" className="w-full overflow-visible">
          <defs>
            <linearGradient id="intro-grad" x1="10" y1="88" x2="110" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#3B2FA0" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <filter id="intro-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* outline draw */}
          <motion.path
            d={J_PATH}
            stroke="#A78BFA"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: stage === "fill" ? 0 : 1 }}
            transition={{ pathLength: { duration: 1, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
          />
          <motion.path
            d={X_PATH}
            stroke="#A78BFA"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: stage === "fill" ? 0 : 1 }}
            transition={{ pathLength: { duration: 0.5, delay: 0.85, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
          />
          {/* gradient fill */}
          <motion.path
            d={J_PATH}
            stroke="url(#intro-grad)"
            strokeWidth={LOGO_STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#intro-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={stage === "fill" ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d={X_PATH}
            stroke="#2A4BB8"
            strokeWidth={LOGO_STROKE}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={stage === "fill" ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
