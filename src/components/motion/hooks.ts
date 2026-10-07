"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/** True when the user prefers reduced motion (SSR-safe, defaults to false) */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useMediaQuery(query: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/** Coarse pointer or narrow viewport: lower 3D quality and particle counts */
export function useIsLowPower() {
  const coarse = useMediaQuery("(pointer: coarse)");
  const narrow = useMediaQuery("(max-width: 767px)");
  return coarse || narrow;
}

/** Becomes true once the element approaches the viewport (or tracks visibility when once=false) */
export function useInView<T extends Element>(ref: React.RefObject<T>, rootMargin = "200px", once = true) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

/** useLayoutEffect on the client, useEffect during SSR (avoids React's server warning) */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
