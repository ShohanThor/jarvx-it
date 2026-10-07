import Image from "next/image";
import { Eye, Linkedin, Target } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stats } from "@/components/sections/home/Stats";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getStats, getTeam } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "About Us",
  description: "Meet JarvX IT — a custom software company in Uttara, Dhaka. Our story, mission, team and office.",
  path: "/about",
});

const OFFICE = ["/images/office/1.webp", "/images/office/2.webp", "/images/office/3.webp", "/images/office/4.webp"];

export default async function AboutPage() {
  const lang = getLang();
  const t = getDict();
  const [team, stats] = await Promise.all([getTeam(), getStats(lang)]);

  return (
    <>
      <PageHeader
        eyebrow={t.nav.about}
        title="Engineering *digital* growth from Dhaka to the world"
        text="JarvX IT is a team of engineers, designers and problem-solvers who build software that businesses depend on every day."
      />

      <section className="section pt-8">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="clip" className="relative aspect-[4/3] overflow-hidden rounded-4xl">
            <Image src={OFFICE[0]} alt="The JarvX IT office in Uttara, Dhaka" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Built by builders, for builders" className="mb-6" />
            <Reveal>
              <div className="space-y-4 text-lg leading-relaxed text-muted">
                <p>
                  JarvX IT started with a simple belief: world-class software can be built in Bangladesh, by people who care deeply about the businesses they serve.
                </p>
                <p>
                  What began as a small team building websites for local brands has grown into a full-service software partner — delivering ecommerce platforms, healthcare systems, streaming services, AI assistants and dedicated engineering teams for clients across Asia, Europe, the Middle East and North America.
                </p>
                <p>We still work the way we started: small focused teams, honest communication and an obsession with quality.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-6 md:grid-cols-2">
          {[
            { Icon: Target, title: "Our mission", text: "To help businesses grow by building reliable, beautiful and intelligent software — delivered with transparency and care." },
            { Icon: Eye, title: "Our vision", text: "To be the most trusted technology partner from South Asia, known for engineering excellence and genuine partnership." },
          ].map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1} className="gradient-border glass rounded-4xl p-8 md:p-10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-glow">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-bold">{title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Stats stats={stats} title={t.sections.statsTitle} lang={lang} />

      <section className="section" id="team">
        <div className="container">
          <SectionHeading eyebrow="Team" title="The people behind the code" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <StaggerItem key={m.id} className="group">
                <div className="gradient-border glass relative aspect-[4/5] overflow-hidden rounded-4xl">
                  {m.photo && <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />}
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-3xl bg-ink/70 p-4 text-white backdrop-blur">
                    <div className="min-w-0">
                      <p className="truncate font-display font-semibold">{m.name}</p>
                      <p className="truncate text-sm text-white/70">{m.role}</p>
                    </div>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-purple">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section pt-0" id="office">
        <div className="container">
          <SectionHeading eyebrow="Office" title="Our home in Uttara" />
          <Stagger className="grid auto-rows-[220px] gap-4 md:grid-cols-4 md:auto-rows-[260px]">
            {OFFICE.map((src, i) => (
              <StaggerItem key={src} className={`relative overflow-hidden rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2" : i === 3 ? "md:col-span-2" : ""}`}>
                <Image src={src} alt={`JarvX IT office photo ${i + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 hover:scale-105" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FinalCta t={t} />
    </>
  );
}
