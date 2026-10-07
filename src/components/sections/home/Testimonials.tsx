"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { useMediaQuery, usePrefersReducedMotion } from "@/components/motion/hooks";
import { cn } from "@/lib/utils";

/** 3D ring carousel: cards sit on a cylinder, the ring rotates to bring the active card forward */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const small = useMediaQuery("(max-width: 640px)");
  const reduced = usePrefersReducedMotion();
  const cardW = small ? 290 : 380;
  const step = 360 / n;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n)) + (small ? 30 : 60);

  const go = useCallback((d: number) => setIndex((i) => i + d), []);
  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => go(1), 5500);
    return () => clearInterval(t);
  }, [paused, reduced, go]);

  const active = ((index % n) + n) % n;

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <motion.div
        className="relative mx-auto h-[440px] select-none md:h-[420px]"
        style={{ perspective: 1600 }}
        onPanEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 50) go(info.offset.x < 0 ? 1 : -1);
        }}
      >
        <motion.div
          className="absolute left-1/2 top-0 h-full preserve-3d"
          style={{ width: cardW, marginLeft: -cardW / 2, z: -radius }}
          animate={{ rotateY: -index * step }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          {items.map((t, i) => {
            const dist = Math.min(Math.abs(i - active), n - Math.abs(i - active));
            return (
              <article
                key={t.id}
                aria-hidden={i !== active}
                className={cn(
                  "glass absolute inset-x-0 top-4 flex flex-col rounded-4xl p-7 backface-hidden transition-[opacity,box-shadow] duration-700",
                  i === active ? "gradient-border is-active opacity-100 shadow-glow" : dist === 1 ? "opacity-45" : "opacity-15",
                )}
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              >
                <div className="flex items-center justify-between">
                  <Quote className="h-9 w-9 text-purple/60" />
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={cn("h-4 w-4", s < t.rating ? "fill-amber-400 text-amber-400" : "text-muted/40")} />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-5 flex-1 text-[1.02rem] leading-relaxed text-fg/90">“{t.quote}”</blockquote>
                <footer className="mt-6 flex items-center gap-3.5">
                  {t.photo && <Image src={t.photo} alt={t.name} width={52} height={52} className="h-[52px] w-[52px] rounded-full object-cover ring-2 ring-purple/40" />}
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold">{t.name}</p>
                    <p className="truncate text-sm text-muted">
                      {t.role}, {t.company}
                    </p>
                  </div>
                  {t.companyLogo && <Image src={t.companyLogo} alt={`${t.company} logo`} width={96} height={32} className="h-7 w-auto opacity-70 dark:brightness-[1.8]" />}
                </footer>
              </article>
            );
          })}
        </motion.div>
      </motion.div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} className="glass grid h-12 w-12 place-items-center rounded-full transition hover:border-purple/60" aria-label="Previous testimonial">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(index + (((i - active + n + Math.floor(n / 2)) % n) - Math.floor(n / 2)))}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === active}
              className={cn("h-2 rounded-full transition-all duration-500", i === active ? "w-8 bg-brand" : "w-2 bg-line/25")}
            />
          ))}
        </div>
        <button onClick={() => go(1)} className="glass grid h-12 w-12 place-items-center rounded-full transition hover:border-purple/60" aria-label="Next testimonial">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
