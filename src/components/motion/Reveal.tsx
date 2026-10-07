"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const variants = {
  "fade-up": { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  "slide-left": { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  clip: {
    hidden: { clipPath: "inset(0% 0% 100% 0% round 24px)", opacity: 0.4 },
    show: { clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 },
  },
} satisfies Record<string, Variants>;

export type RevealVariant = keyof typeof variants;

type Props = {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "article";
};

/** Scroll-triggered entrance animation */
export function Reveal({ children, variant = "fade-up", delay = 0, duration = 0.8, className, as = "div" }: Props) {
  const M = motion[as];
  return (
    <M
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its <StaggerItem> children into view */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </M>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "fade-up",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  as?: "div" | "li" | "article";
}) {
  const M = motion[as];
  return (
    <M className={className} variants={variants[variant]} transition={{ duration: 0.7, ease }}>
      {children}
    </M>
  );
}
