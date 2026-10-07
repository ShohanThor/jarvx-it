import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-14 max-w-3xl md:mb-16", align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow && (
        <Reveal variant="fade" className="mb-5">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-purple" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <SplitWords as={as} text={title} className={cn("font-display text-[2.1rem] font-bold leading-[1.08] md:text-5xl lg:text-[3.4rem]", as === "h1" && "md:text-6xl lg:text-7xl")} />
      {text && (
        <Reveal delay={0.15}>
          <p className={cn("mt-5 text-lg leading-relaxed text-muted", align === "center" && "mx-auto max-w-2xl")}>{text}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Hero band for inner pages */
export function PageHeader({ eyebrow, title, text, children }: { eyebrow?: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-40 md:pb-16 md:pt-48">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-purple/25 blur-[120px]" />
        <div className="bg-grid absolute inset-0 mask-fade-b opacity-70" />
      </div>
      <div className="container relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} className="mb-0" />
        {children}
      </div>
    </section>
  );
}
