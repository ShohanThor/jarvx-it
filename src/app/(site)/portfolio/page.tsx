import { PageHeader } from "@/components/ui/SectionHeading";
import { PortfolioGrid } from "@/components/sections/portfolio/PortfolioGrid";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getProjects } from "@/lib/content";
import { getDict } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Portfolio & Case Studies",
  description: "Ecommerce, healthcare, SaaS, mobile and web projects built by JarvX IT — with the problems, solutions and measurable results.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const t = getDict();
  const projects = await getProjects();
  return (
    <>
      <PageHeader eyebrow={t.nav.portfolio} title={t.sections.showcaseTitle} />
      <section className="pb-24">
        <div className="container">
          <PortfolioGrid projects={projects.map(({ slug, title, client, category, summary, cover, tech }) => ({ slug, title, client, category, summary, cover, tech }))} />
        </div>
      </section>
      <FinalCta t={t} />
    </>
  );
}
