import { PageHeader } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/sections/products/ProductCard";
import { BillingProvider, PricingToggle } from "@/components/sections/products/PricingToggle";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { getProducts } from "@/lib/content";
import { getDict, getLang } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Products",
  description: "Ready-made software from JarvX IT: ecommerce, hospital management, HR & payroll and fleet tracking platforms with monthly and yearly plans.",
  path: "/products",
});

export default async function ProductsPage() {
  const t = getDict();
  const products = await getProducts(getLang());
  return (
    <>
      <PageHeader eyebrow={t.sections.productsEyebrow} title={t.sections.productsTitle} text={t.sections.productsText} />
      <section className="pb-24">
        <div className="container">
          <BillingProvider>
            <Reveal>
              <PricingToggle className="mb-12" />
            </Reveal>
            <Stagger className="grid gap-8 md:grid-cols-2">
              {products.map((p) => (
                <StaggerItem key={p.slug} className="h-full">
                  <ProductCard p={p} t={t} />
                </StaggerItem>
              ))}
            </Stagger>
          </BillingProvider>
        </div>
      </section>
      <FinalCta t={t} />
    </>
  );
}
