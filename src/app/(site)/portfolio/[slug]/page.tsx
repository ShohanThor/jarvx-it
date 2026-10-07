import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProject, getProjects, getServices } from "@/lib/content";
import { getDict } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProject(params.slug);
  if (!p) return {};
  return buildMetadata({ title: `${p.title} — Case Study`, description: p.summary, path: `/portfolio/${p.slug}`, type: "article" });
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const t = getDict();
  const p = await getProject(params.slug);
  if (!p) notFound();
  const [all, services] = await Promise.all([getProjects(), getServices()]);
  const idx = all.findIndex((x) => x.slug === p.slug);
  const next = all[(idx + 1) % all.length];
  const usedServices = services.filter((s) => p.serviceSlugs.includes(s.slug));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: p.title,
            description: p.summary,
            image: `${site.url}${p.cover}`,
            creator: { "@id": `${site.url}/#organization` },
            dateCreated: String(p.year),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: p.title, path: `/portfolio/${p.slug}` },
          ]),
        ]}
      />
      <section className="relative pb-12 pt-36 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-purple/25 blur-[120px]" />
        <div className="container relative">
          <Link href="/portfolio" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-purple">
            <ArrowLeft className="h-4 w-4" /> {t.nav.portfolio}
          </Link>
          <span className="eyebrow">{p.category}</span>
          <SplitWords as="h1" text={p.title} animateOnMount className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] md:text-7xl" />
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-xl text-muted">{p.summary}</p>
          </Reveal>
          <Reveal delay={0.4}>
            <dl className="mt-10 grid gap-6 border-y border-line/10 py-6 sm:grid-cols-4">
              {[
                ["Client", p.client],
                ["Industry", p.category],
                ["Year", String(p.year)],
                ["Services", usedServices.map((s) => s.title).join(", ") || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">{k}</dt>
                  <dd className="mt-1.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          <Reveal variant="clip" className="relative aspect-[16/9] overflow-hidden rounded-4xl">
            <Image src={p.cover} alt={p.title} fill priority sizes="(min-width: 1320px) 1280px, 100vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-purple dark:text-purple-300">The problem</h2>
            <p className="mt-4 text-xl leading-relaxed text-fg/90">{p.problem}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-purple dark:text-purple-300">Our solution</h2>
            <p className="mt-4 text-xl leading-relaxed text-fg/90">{p.solution}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <Stagger className="gradient-border glass grid grid-cols-2 gap-8 rounded-4xl p-8 md:grid-cols-4 md:p-12">
            {p.results.map((r) => (
              <StaggerItem key={r.label} className="text-center">
                <p className="font-display text-4xl font-bold text-gradient md:text-5xl">{r.value}</p>
                <p className="mt-2 text-sm text-muted">{r.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="mb-6 font-display text-3xl font-bold">Tech we used</h2>
          </Reveal>
          <Stagger className="flex flex-wrap gap-3" stagger={0.04}>
            {p.tech.map((x) => (
              <StaggerItem key={x} variant="scale">
                <span className="glass inline-block rounded-full px-5 py-2.5 font-medium">{x}</span>
              </StaggerItem>
            ))}
          </Stagger>

          {p.gallery.length > 0 && (
            <Stagger className="mt-16 grid gap-6 md:grid-cols-2">
              {p.gallery.map((g, i) => (
                <StaggerItem key={g} className={`glass relative overflow-hidden rounded-4xl ${i === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-[16/10]"}`}>
                  <Image src={g} alt={`${p.title} screenshot ${i + 1}`} fill sizes={i === 0 ? "100vw" : "50vw"} className="object-cover transition duration-700 hover:scale-105" />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      {next && next.slug !== p.slug && (
        <section className="py-12">
          <div className="container">
            <Link href={`/portfolio/${next.slug}`} className="gradient-border glass group flex items-center justify-between gap-6 rounded-4xl p-8 md:p-12" data-cursor="Next">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted">Next project</p>
                <p className="mt-2 font-display text-3xl font-bold md:text-5xl">{next.title}</p>
              </div>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:translate-x-2">
                <ArrowRight className="h-6 w-6" />
              </span>
            </Link>
          </div>
        </section>
      )}
      <FinalCta t={t} />
    </>
  );
}
