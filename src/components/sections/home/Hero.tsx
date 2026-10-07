import { ArrowRight, ArrowDown } from "lucide-react";
import { MeshGradient } from "@/components/motion/MeshGradient";
import { SplitWords } from "@/components/motion/SplitWords";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "@/components/three/HeroVisual";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Hero({ t }: { t: Dictionary }) {
  // Highlight the last two words of the headline with the brand gradient
  const words = t.hero.title.split(" ");
  const title = words.map((w, i) => (i >= words.length - 2 ? `*${w}*` : w)).join(" ");

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-24 md:pt-28">
      <MeshGradient />
      <div className="container relative grid items-center gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-[1] order-2 lg:order-1">
          <Reveal variant="fade" delay={0.1}>
            <span className="eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple" />
              </span>
              {t.hero.eyebrow}
            </span>
          </Reveal>
          <SplitWords
            as="h1"
            text={title}
            animateOnMount
            delay={0.25}
            stagger={0.09}
            className="mt-5 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.6rem]"
          />
          <Reveal delay={0.7}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{t.hero.subtitle}</p>
          </Reveal>
          <Reveal delay={0.85} className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" size="lg">
              {t.common.getStarted} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="/services" size="lg" variant="secondary">
              {t.common.exploreServices}
            </Button>
          </Reveal>
        </div>
        <HeroVisual className="order-1 -mx-5 h-[34svh] w-[calc(100%+2.5rem)] sm:mx-auto sm:aspect-square sm:h-auto sm:max-h-[520px] sm:w-full lg:order-2 lg:max-h-[640px]" />
      </div>
      <a
        href="#clients"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted md:flex"
        aria-label={t.common.scroll}
      >
        {t.common.scroll}
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-line/30 pt-2">
          <ArrowDown className="h-3 w-3 animate-bounce text-purple" />
        </span>
      </a>
    </section>
  );
}
