"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useIsoLayoutEffect } from "@/components/motion/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Item = { slug: string; title: string; category: string; summary: string; cover: string; client: string };

/**
 * Desktop: section pins while vertical scroll drives a horizontal track; each card rotates in 3D
 * as it crosses the viewport. Mobile / reduced motion: native swipeable row with snap points.
 */
export function Showcase({ projects, eyebrow, title, cta, viewAll }: { projects: Item[]; eyebrow: string; title: string; cta: string; viewAll: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { rotateY: -24, z: -80, opacity: 0.6 },
          {
            keyframes: [
              { rotateY: 0, z: 0, opacity: 1, ease: "none" },
              { rotateY: 24, z: -80, opacity: 0.6, ease: "none" },
            ],
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden py-24 md:flex md:h-screen md:items-center md:py-0" aria-label={title}>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:snap-none md:gap-10 md:overflow-visible md:px-[8vw] md:pb-0 [&::-webkit-scrollbar]:hidden"
        style={{ perspective: "1400px" }}
      >
        <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-center md:w-[34vw]">
          <span className="eyebrow w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-purple" />
            {eyebrow}
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] md:text-6xl">{title}</h2>
          <Link href="/portfolio" className="mt-8 inline-flex w-fit items-center gap-2 font-semibold text-purple dark:text-purple-300">
            {viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-10 hidden text-sm uppercase tracking-[0.25em] text-muted md:block">Scroll →</p>
        </div>

        {projects.map((p, i) => (
          <article key={p.slug} data-card className="w-[80vw] shrink-0 snap-start md:w-[46vw] lg:w-[40vw]" style={{ transformStyle: "preserve-3d" }}>
            <Link href={`/portfolio/${p.slug}`} className="gradient-border glass group block overflow-hidden rounded-4xl" data-cursor="View">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={p.cover} alt={p.title} fill sizes="(min-width: 768px) 46vw, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute left-5 top-5 font-display text-sm font-semibold text-white/80">{String(i + 1).padStart(2, "0")}</span>
                <span className="glass absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold text-white">{p.category}</span>
              </div>
              <div className="flex items-end justify-between gap-4 p-6 md:p-7">
                <div>
                  <p className="text-sm text-muted">{p.client}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold md:text-[1.7rem]">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-muted">{p.summary}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-white transition-transform duration-300 group-hover:rotate-45" aria-label={cta}>
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
