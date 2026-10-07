import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, CheckCircle2 } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { BillingProvider, Price, PricingToggle } from "@/components/sections/products/PricingToggle";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { VideoEmbed } from "@/components/widgets/VideoEmbed";
import { QuickInquiry } from "@/components/widgets/QuickInquiry";
import { getProduct } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) return {};
  return buildMetadata({ title: `${p.name} — ${p.tagline}`, description: p.description, path: `/products/${p.slug}` });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const t = getDict();
  const p = await getProduct(params.slug, getLang());
  if (!p) notFound();

  return (
    <>
      <JsonLd
        data={[
          productSchema(p),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: p.name, path: `/products/${p.slug}` },
          ]),
        ]}
      />
      <PageHeader eyebrow={p.category} title={p.name} text={p.tagline}>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={`/contact?product=${p.slug}&type=demo`} size="lg">
            {t.common.bookDemo}
          </Button>
          <Button href={`/contact?product=${p.slug}&type=trial`} size="lg" variant="secondary">
            {t.common.startTrial}
          </Button>
        </div>
      </PageHeader>

      <section className="pb-20">
        <div className="container">
          <Reveal variant="clip">
            {p.videoUrl ? (
              <VideoEmbed src={p.videoUrl} poster={p.screenshots[0]} title={`${p.name} demo`} />
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-4xl">
                <Image src={p.screenshots[0]} alt={p.name} fill priority sizes="100vw" className="object-cover" />
              </div>
            )}
          </Reveal>
          {p.screenshots.length > 1 && (
            <Stagger className="mt-6 grid gap-6 sm:grid-cols-2">
              {p.screenshots.slice(1).map((s, i) => (
                <StaggerItem key={s} className="glass relative aspect-[16/10] overflow-hidden rounded-3xl">
                  <Image src={s} alt={`${p.name} screenshot ${i + 2}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-4xl">{p.name}</h2>
            <p className="mt-5 text-lg leading-relaxed text-fg/85">{p.description}</p>
          </Reveal>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {p.features.map((f) => (
              <StaggerItem key={f} className="glass flex gap-3 rounded-2xl p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-purple" />
                <span className="font-medium">{f}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {p.plans.length > 0 && (
        <section className="section" id="pricing">
          <div className="container">
            <SectionHeading eyebrow="Pricing" title="Simple, transparent plans" />
            <BillingProvider>
              <Reveal>
                <PricingToggle className="mb-12" />
              </Reveal>
              <Stagger className="grid gap-6 lg:grid-cols-3">
                {p.plans.map((plan, i) => {
                  const featured = i === 1;
                  return (
                    <StaggerItem
                      key={plan.name}
                      className={cn("gradient-border glass relative flex flex-col rounded-4xl p-8", featured && "is-active shadow-glow lg:-translate-y-4")}
                    >
                      {featured && <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
                      <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                      <Price monthly={plan.monthly} yearly={plan.yearly} className="mt-4" />
                      <ul className="mt-6 flex-1 space-y-3">
                        {plan.features.map((f) => (
                          <li key={f} className="flex gap-2.5 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Button href={`/contact?product=${p.slug}&plan=${encodeURIComponent(plan.name)}&type=trial`} variant={featured ? "primary" : "secondary"} className="mt-8 w-full" magnetic={false}>
                        {t.common.startTrial}
                      </Button>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </BillingProvider>
          </div>
        </section>
      )}

      <section className="section" id="demo">
        <div className="container max-w-3xl">
          <SectionHeading title={t.common.bookDemo} />
          <Reveal>
            <QuickInquiry source="product" subject={p.name} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
