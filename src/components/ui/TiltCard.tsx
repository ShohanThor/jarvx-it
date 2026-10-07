"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** 3D tilt on hover with a cursor-following glow and a gradient border */
export function TiltCard({
  children,
  className,
  max = 10,
  glow = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 180, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), cfg);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const spotlight = useTransform(
    [px, py],
    ([x, y]: number[]) => `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(124,58,237,.18), transparent 45%)`,
  );

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={ref}
        data-cursor
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY }}
        className={cn("gradient-border group glass relative h-full rounded-3xl transition-shadow duration-500 hover:shadow-glow", className)}
      >
        {glow && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
        )}
        <div className="relative h-full">{children}</div>
      </motion.div>
    </div>
  );
}
