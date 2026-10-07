import { cn } from "@/lib/utils";

/**
 * Slow-flowing mesh gradient made of blurred, GPU-composited blobs.
 * Pure CSS (no JS cost); animation stops automatically under prefers-reduced-motion.
 */
export function MeshGradient({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  const blobs = [
    { c: "#3B2FA0", s: "55vw", t: "-10%", l: "-10%", d: "26s", x1: "18%", y1: "12%", x2: "6%", y2: "-6%" },
    { c: "#7C3AED", s: "45vw", t: "10%", l: "55%", d: "22s", x1: "-20%", y1: "18%", x2: "-6%", y2: "-10%" },
    { c: "#0D2B7E", s: "50vw", t: "55%", l: "15%", d: "30s", x1: "20%", y1: "-14%", x2: "-10%", y2: "6%" },
    { c: "#9F67FF", s: "30vw", t: "60%", l: "70%", d: "24s", x1: "-12%", y1: "-18%", x2: "8%", y2: "4%" },
  ];
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {blobs.map((b, i) => (
        <span
          key={i}
          className="mesh-blob opacity-[.22] dark:opacity-[.35]"
          style={
            {
              background: b.c,
              width: b.s,
              height: b.s,
              top: b.t,
              left: b.l,
              opacity: undefined,
              filter: `blur(${90 * intensity}px)`,
              "--d": b.d,
              "--x1": b.x1,
              "--y1": b.y1,
              "--x2": b.x2,
              "--y2": b.y2,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="bg-grid absolute inset-0 mask-fade-b opacity-60" />
    </div>
  );
}
