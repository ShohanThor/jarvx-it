"use client";

import { useRef } from "react";
import { useIsoLayoutEffect } from "@/components/motion/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, PenTool, Code2, BugOff, Rocket, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Compass, PenTool, Code2, BugOff, Rocket, LifeBuoy];

/** Vertical timeline: a glowing gradient line draws itself with scroll and lights up each step */
export function ProcessTimeline({ steps }: { steps: { title: string; desc: string }[] }) {
  const root = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(line.current, { scaleY: 1 });
        root.current?.querySelectorAll("[data-step]").forEach((s) => s.classList.add("is-active"));
        return;
      }
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 65%", end: "bottom 65%", scrub: 0.6 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: "top 65%", toggleClass: { targets: step, className: "is-active" } });
        gsap.from(step.querySelector("[data-body]"), {
          opacity: 0,
          x: step.dataset.side === "left" ? -50 : 50,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 80%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root} className="relative mx-auto max-w-5xl">
      {/* track + animated glowing line */}
      <div aria-hidden className="absolute bottom-0 left-6 top-0 w-[3px] -translate-x-1/2 rounded-full bg-line/10 md:left-1/2" />
      <div
        ref={line}
        aria-hidden
        className="absolute bottom-0 left-6 top-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo via-purple to-purple-300 shadow-[0_0_18px_3px_rgba(124,58,237,.55)] md:left-1/2"
      />
      {steps.map((s, i) => {
        const Icon = ICONS[i % ICONS.length];
        const left = i % 2 === 0;
        return (
          <li
            key={s.title}
            data-step
            data-side={left ? "left" : "right"}
            className="group/step relative grid grid-cols-[3rem_1fr] gap-6 pb-14 last:pb-0 md:grid-cols-[1fr_4rem_1fr] md:gap-8"
          >
            <div className="relative z-[1] col-start-1 row-start-1 flex justify-center md:col-start-2">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-line/20 bg-surface text-muted transition-all duration-500 group-[.is-active]/step:border-transparent group-[.is-active]/step:bg-brand group-[.is-active]/step:text-white group-[.is-active]/step:shadow-glow">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <div data-body className={cn("col-start-2 row-start-1", left ? "md:col-start-1 md:text-right" : "md:col-start-3")}>
              <div className="glass rounded-3xl p-6 transition-colors duration-500 group-[.is-active]/step:border-purple/40">
                <span className="font-display text-sm font-semibold text-purple dark:text-purple-300">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.desc}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
