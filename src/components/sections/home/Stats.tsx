import type { Stat } from "@prisma/client";
import { Counter } from "@/components/motion/Counter";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Lang } from "@/lib/i18n/dictionaries";

export function Stats({ stats, title, lang }: { stats: Stat[]; title: string; lang: Lang }) {
  return (
    <section className="relative py-12" aria-label={title}>
      <div className="container">
        <Stagger className="gradient-border glass grid grid-cols-2 gap-y-10 rounded-4xl px-6 py-10 md:grid-cols-4 md:px-10 md:py-14">
          {stats.map((s, i) => (
            <StaggerItem key={s.id} className={`text-center ${i > 0 ? "md:border-l md:border-line/10" : ""}`}>
              <Counter value={s.value} suffix={s.suffix} locale={lang} className="block font-display text-5xl font-bold text-gradient md:text-6xl" />
              <span className="mt-2 block text-sm font-medium text-muted md:text-base">{s.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
