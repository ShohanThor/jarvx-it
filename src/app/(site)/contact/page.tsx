import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactWizard } from "@/components/widgets/ContactWizard";
import { BookingCalendar } from "@/components/widgets/BookingCalendar";
import { getProducts, getServices } from "@/lib/content";
import { getDict } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `Start your project with JarvX IT. Call ${site.phoneDisplay}, book a free discovery call or visit our office in Uttara, Dhaka.`,
  path: "/contact",
});

export default async function ContactPage({ searchParams }: { searchParams: { product?: string; type?: string; plan?: string; service?: string } }) {
  const t = getDict();
  const [services, products] = await Promise.all([getServices(), getProducts()]);
  const product = products.find((p) => p.slug === searchParams.product);
  const initialService = product ? `Product: ${product.name}` : (services.find((s) => s.slug === searchParams.service)?.title ?? "");
  const initialMessage = product
    ? `I'd like to ${searchParams.type === "trial" ? "start a free trial of" : "book a demo of"} ${product.name}${searchParams.plan ? ` (${searchParams.plan} plan)` : ""}.`
    : "";

  const info = [
    { Icon: Phone, label: "Phone", value: site.phoneDisplay, href: `tel:${site.phone}` },
    { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { Icon: MapPin, label: "Office", value: site.address.full },
    { Icon: Clock, label: "Hours", value: "Sun – Thu, 10:00 – 19:00 (GMT+6)" },
  ];

  return (
    <>
      <PageHeader eyebrow={t.nav.contact} title="Let's build something *great*" text={t.sections.ctaText} />

      <section className="pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ContactWizard services={services.map((s) => s.title)} products={products.map((p) => p.name)} initialService={initialService} initialMessage={initialMessage} />
          </Reveal>
          <Reveal delay={0.1} className="space-y-4">
            {info.map(({ Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-widest text-muted">{label}</span>
                    <span className="mt-0.5 block font-medium">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} className="glass flex items-center gap-4 rounded-3xl p-5 transition hover:border-purple/50">
                  {body}
                </a>
              ) : (
                <div key={label} className="glass flex items-center gap-4 rounded-3xl p-5">
                  {body}
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="section pt-8" id="book">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Book a meeting" title="Schedule a free discovery call" />
          <Reveal>
            <BookingCalendar />
          </Reveal>
        </div>
      </section>

      <section className="pb-24" id="map">
        <div className="container">
          <Reveal variant="clip" className="gradient-border glass overflow-hidden rounded-4xl">
            <iframe
              title="JarvX IT office location on Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`}
              className="h-[420px] w-full grayscale-[30%] dark:invert-[90%] dark:hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
