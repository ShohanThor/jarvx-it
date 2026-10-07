import { Gem, Handshake, Lightbulb, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/sections/home/Hero";
import { ClientMarquee } from "@/components/sections/home/ClientMarquee";
import { Stats } from "@/components/sections/home/Stats";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { Showcase } from "@/components/sections/home/Showcase";
import { ProcessTimeline } from "@/components/sections/home/ProcessTimeline";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { ProductCard } from "@/components/sections/products/ProductCard";
import { BillingProvider, PricingToggle } from "@/components/sections/products/PricingToggle";
import { TechSphere } from "@/components/three/TechSphere";
import { CostEstimator } from "@/components/widgets/CostEstimator";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { getClients, getFaqs, getProducts, getProjects, getServices, getStats, getTestimonials } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  const meta = buildMetadata({ title: "Digital Solutions That Transform Business", description: site.description, path: "/" });
  return { ...meta, title: { absolute: `${site.name} | Custom Software Company in Dhaka, Bangladesh` } };
}

const TECH = ["React", "Next.js", "TypeScript", "Node.js", "Express", "PHP", "Laravel", "Python", "Django", "Rails", "Tailwind", "Docker", "Kubernetes", "AWS", "GCP", "PostgreSQL", "MongoDB"];
const VALUE_ICONS = [Gem, ShieldCheck, Lightbulb, Handshake];

export default async function HomePage() {
  const lang = getLang();
  const t = getDict();
  const [services, products, projects, stats, clients, testimonials, faqs] = await Promise.all([
    getServices(lang),
    getProducts(lang),
    getProjects(),
    getStats(lang),
    getClients(),
    getTestimonials(),
    getFaqs(lang),
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <Hero t={t} />
      <ClientMarquee title={t.sections.clients} clients={clients} />
      <Stats stats={stats} title={t.sections.statsTitle} lang={lang} />

      <section className="section" id="services">
        <div className="container">
          <SectionHeading eyebrow={t.sections.servicesEyebrow} title={t.sections.servicesTitle} text={t.sections.servicesText} />
          <ServicesGrid services={services} cta={t.common.learnMore} />
        </div>
      </section>

      <section className="section" id="products">
        <div aria-hidden className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-indigo/25 blur-[120px]" />
        <div className="container relative">
          <SectionHeading eyebrow={t.sections.productsEyebrow} title={t.sections.productsTitle} text={t.sections.productsText} />
          <BillingProvider>
            <Reveal>
              <PricingToggle className="mb-12" />
            </Reveal>
            <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {products.map((p) => (
                <StaggerItem key={p.slug} className="h-full">
                  <ProductCard p={p} t={t} compact />
                </StaggerItem>
              ))}
            </Stagger>
          </BillingProvider>
          <Reveal className="mt-12 text-center">
            <Button href="/products" variant="secondary">
              {t.common.viewAll}
            </Button>
          </Reveal>
        </div>
      </section>

      <Showcase
        projects={projects.filter((p) => p.featured).slice(0, 7)}
        eyebrow={t.sections.showcaseEyebrow}
        title={t.sections.showcaseTitle}
        cta={t.common.viewCaseStudy}
        viewAll={t.common.viewAll}
      />

      <section className="section" id="process">
        <div className="container">
          <SectionHeading eyebrow={t.sections.processEyebrow} title={t.sections.processTitle} />
          <ProcessTimeline steps={t.process} />
        </div>
      </section>

      <section className="section overflow-hidden" id="tech">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow={t.sections.techEyebrow} title={t.sections.techTitle} text={t.sections.techText} className="mb-8" />
            <Stagger className="flex flex-wrap gap-2" stagger={0.03}>
              {TECH.map((tech) => (
                <StaggerItem key={tech} variant="scale">
                  <span className="glass inline-block rounded-full px-3.5 py-1.5 text-sm text-fg/80">{tech}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <TechSphere techs={TECH} />
        </div>
      </section>

      <section className="section" id="values">
        <div className="container">
          <SectionHeading eyebrow={t.sections.valuesEyebrow} title={t.sections.valuesTitle} />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <StaggerItem key={v.title} className="gradient-border glass group rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-2">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-glow transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{v.desc}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section overflow-hidden" id="testimonials">
          <div className="container">
            <SectionHeading eyebrow={t.sections.testimonialsEyebrow} title={t.sections.testimonialsTitle} />
            <Testimonials items={testimonials} />
          </div>
        </section>
      )}

      <section className="section scroll-mt-24" id="estimator">
        <div className="container">
          <SectionHeading eyebrow={t.sections.estimatorEyebrow} title={t.sections.estimatorTitle} />
          <Reveal>
            <CostEstimator />
          </Reveal>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container max-w-4xl">
          <SectionHeading eyebrow={t.sections.faqEyebrow} title={t.sections.faqTitle} />
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <FinalCta t={t} />
    </>
  );
}
