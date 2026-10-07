"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/brand/Logo";

type Phase = "idle" | "cover" | "reveal";
const ease = [0.76, 0, 0.24, 1] as const;
const DURATION = 0.55;

/**
 * Purple gradient wipe between routes. Intercepts same-origin link clicks in the capture phase,
 * covers the screen, navigates, then reveals the new page once the pathname changes.
 * Timers (not animation callbacks) drive the phases so a throttled tab can never leave it stuck.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const fromPath = useRef(pathname);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (/^\/(admin|api|media)/.test(url.pathname)) return;
      if (url.pathname === window.location.pathname) return; // same page / hash links
      e.preventDefault();
      e.stopPropagation();
      target.current = url.pathname + url.search + url.hash;
      fromPath.current = window.location.pathname;
      router.prefetch(target.current);
      setPhase("cover");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // Screen covered: navigate (with a safety net in case navigation never completes)
  useEffect(() => {
    if (phase !== "cover") return;
    const push = setTimeout(() => {
      if (target.current) router.push(target.current);
      target.current = null;
    }, DURATION * 1000);
    const safety = setTimeout(() => setPhase("reveal"), 8000);
    return () => {
      clearTimeout(push);
      clearTimeout(safety);
    };
  }, [phase, router]);

  // New route rendered: reveal it
  useEffect(() => {
    if (phase === "cover" && pathname !== fromPath.current) setPhase("reveal");
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setPhase("idle"), DURATION * 1000 + 50);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key="wipe"
          aria-hidden
          className="fixed inset-0 z-[9000] flex items-center justify-center bg-brand"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={phase === "cover" ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: "inset(0% 0% 100% 0%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION, ease }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase === "cover" ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.4, delay: phase === "cover" ? 0.25 : 0 }}
          >
            <LogoMark className="h-14 w-auto brightness-0 invert" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
