import { PageHeader, SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { ProcessTimeline } from "@/components/sections/home/ProcessTimeline";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getServices } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Services",
  description: "Software development, resource augmentation, QA & testing, web & mobile apps, DevOps & cloud, and AI solutions from JarvX IT, Dhaka.",
  path: "/services",
});

export default async function ServicesPage() {
  const t = getDict();
  const services = await getServices(getLang());
  return (
    <>
      <PageHeader eyebrow={t.sections.servicesEyebrow} title={t.sections.servicesTitle} text={t.sections.servicesText} />
      <section className="pb-24">
        <div className="container">
          <ServicesGrid services={services} cta={t.common.learnMore} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow={t.sections.processEyebrow} title={t.sections.processTitle} />
          <ProcessTimeline steps={t.process} />
        </div>
      </section>
      <FinalCta t={t} />
    </>
  );
}
