import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { Button } from "@/components/ui/Button";
import { MeshGradient } from "@/components/motion/MeshGradient";
import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function FinalCta({ t }: { t: Dictionary }) {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <Reveal variant="clip" className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-20 text-center text-white md:px-16 md:py-28">
          <MeshGradient intensity={0.8} className="opacity-90 [&_.mesh-blob]:!opacity-60" />
          <div className="relative">
            <SplitWords text={t.sections.ctaTitle} className="mx-auto max-w-3xl font-display text-4xl font-bold leading-[1.05] md:text-6xl" />
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">{t.sections.ctaText}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="white" size="lg">
                {t.common.getStarted} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={`tel:${site.phone}`} size="lg" variant="secondary" className="!text-white">
                <Phone className="h-4 w-4" /> {site.phoneDisplay}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
