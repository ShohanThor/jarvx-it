"use client";

import Link from "next/link";
import { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-[box-shadow,background-color,color,transform] duration-300 disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-glow hover:shadow-glow-lg",
  secondary: "glass text-fg hover:border-purple/50",
  ghost: "text-fg hover:bg-purple/10",
  white: "bg-white text-navy shadow-lg hover:shadow-glow",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  (
    | ({ href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

/** Wrapper that pulls its child toward the cursor */
export function Magnetic({ children, strength = 0.35, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

const Shine = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[120%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-shine"
  />
);

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, ref) {
  const { variant = "primary", size = "md", magnetic = true, className, children, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      {variant !== "ghost" && <Shine />}
      <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
    </>
  );

  let el: React.ReactNode;
  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...a } = rest as { href: string; external?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);
    el = isExternal ? (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...a}>
        {inner}
      </a>
    ) : (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} {...a}>
        {inner}
      </Link>
    );
  } else {
    const b = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
    el = (
      <button ref={ref as React.Ref<HTMLButtonElement>} type={b.type ?? "button"} className={cls} {...b}>
        {inner}
      </button>
    );
  }
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
});
