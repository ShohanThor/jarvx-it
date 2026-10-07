import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ServiceIcon } from "@/components/three/ServiceIcon";
import { ProjectCard } from "@/components/sections/portfolio/ProjectCard";
import { QuickInquiry } from "@/components/widgets/QuickInquiry";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProjects, getService } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = await getService(params.slug);
  if (!s) return {};
  return buildMetadata({ title: s.title, description: s.shortDesc, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const t = getDict();
  const s = await getService(params.slug, getLang());
  if (!s) notFound();
  const related = (await getProjects()).filter((p) => p.serviceSlugs.includes(s.slug)).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.description,
            provider: { "@id": `${site.url}/#organization` },
            areaServed: "Worldwide",
            url: `${site.url}/services/${s.slug}`,
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.title, path: `/services/${s.slug}` },
          ]),
        ]}
      />
      <PageHeader eyebrow={t.nav.services} title={s.title} text={s.shortDesc}>
        <div className="mt-10 flex justify-center">
          <ServiceIcon kind={s.icon} size="h-32 w-32" />
        </div>
      </PageHeader>

      <section className="pb-20">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="text-xl leading-relaxed text-fg/85">{s.description}</p>
          </Reveal>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {s.features.map((f) => (
              <StaggerItem key={f} className="glass flex gap-3 rounded-2xl p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-purple" />
                <span className="font-medium">{f}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {s.process.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow={t.sections.processEyebrow} title={t.sections.processTitle} />
            <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {s.process.map((p, i) => (
                <StaggerItem key={p.title} className="gradient-border glass relative rounded-3xl p-7">
                  <span className="font-display text-5xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow={t.sections.showcaseEyebrow} title={t.sections.showcaseTitle} />
            <Stagger className="grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProjectCard p={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="section" id="inquiry">
        <div className="container max-w-3xl">
          <SectionHeading title={t.sections.ctaTitle} text={t.sections.ctaText} />
          <Reveal>
            <QuickInquiry source="service" subject={s.title} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
