"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { useInView, useIsLowPower, usePrefersReducedMotion } from "@/components/motion/hooks";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Static glowing SVG logo is rendered immediately (fast LCP); the 3D scene is
 * code-split and only loaded after the browser is idle. It pauses when off-screen.
 */
export function HeroVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, "0px", false);
  const lowPower = useIsLowPower();
  const reduced = usePrefersReducedMotion();
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const start = () => setLoad(true);
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2000 });
    else setTimeout(start, 600);
  }, []);

  useEffect(() => {
    if (!load) return;
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div ref={ref} className={cn("relative", className)} aria-hidden>
      <div className={cn("absolute inset-0 grid place-items-center transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")}>
        <div className="absolute h-2/3 w-2/3 rounded-full bg-purple/30 blur-[90px]" />
        <LogoMark className="relative w-1/2 animate-float drop-shadow-[0_0_40px_rgba(124,58,237,.6)]" title="" />
      </div>
      {load && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <HeroScene lowPower={lowPower} reduced={reduced} active={visible} />
        </div>
      )}
    </div>
  );
}
