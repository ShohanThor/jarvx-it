"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useInView, useMediaQuery, usePrefersReducedMotion } from "@/components/motion/hooks";

const TechSphereScene = dynamic(() => import("./TechSphereScene"), { ssr: false });

/** Lazy-loaded interactive 3D sphere of technology logos, with an accessible text list underneath */
export function TechSphere({ techs }: { techs: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, "300px");
  const visible = useInView(ref, "0px", false);
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[560px]" data-cursor={fine ? "Drag" : undefined}>
        <div aria-hidden className="absolute inset-[18%] rounded-full bg-purple/20 blur-[80px]" />
        {near && <TechSphereScene active={visible} interactive={fine} reduced={reduced} onHover={setHovered} />}
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-display text-lg font-semibold text-gradient">
          {hovered ?? " "}
        </div>
      </div>
      <ul className="sr-only">
        {techs.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
