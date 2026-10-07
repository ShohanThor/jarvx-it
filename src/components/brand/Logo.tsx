import { useId } from "react";
import { cn } from "@/lib/utils";
import { J_PATH, X_PATH, LOGO_STROKE, LOGO_VIEWBOX } from "./logo-paths";

export function LogoMark({ className, title = "JarvX IT" }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role="img" aria-label={title} fill="none">
      <defs>
        <linearGradient id={`jx-${id}`} x1="10" y1="88" x2="110" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3B2FA0" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path d={J_PATH} stroke={`url(#jx-${id})`} strokeWidth={LOGO_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d={X_PATH} className="stroke-navy dark:stroke-[#3A5BC0]" strokeWidth={LOGO_STROKE} strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-tight", className)}>
      <span className="text-navy dark:text-[#E6E8FF]">Jarv</span>
      <span className="text-purple">X</span>
      <span className="ml-[0.18em] font-medium text-slate-brand dark:text-[#9AA6B4]">IT</span>
    </span>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-auto", markClassName)} title="" />
      <Wordmark className="text-xl" />
      <span className="sr-only">JarvX IT</span>
    </span>
  );
}
