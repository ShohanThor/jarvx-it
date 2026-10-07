import { PageHeader } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({ title: "Terms of Service", description: `Terms governing the use of the ${site.name} website and services.`, path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" text={`Last updated: ${new Date().getFullYear()}`} />
      <section className="pb-24">
        <div className="container prose-brand max-w-3xl">
          <p>These terms govern your use of {site.url}.</p>
          <h2>Use of the website</h2>
          <p>You may browse and use this website for lawful purposes. Content, trademarks and designs on this site belong to {site.name} unless stated otherwise.</p>
          <h2>Estimates and pricing</h2>
          <p>
            Prices shown by the project cost estimator and AI assistant are indicative only and do not constitute an offer. Final pricing is defined in a signed proposal or agreement.
          </p>
          <h2>Products and subscriptions</h2>
          <p>Subscriptions to our ready-made products are governed by the specific agreement or order form provided at sign-up.</p>
          <h2>Limitation of liability</h2>
          <p>The website is provided &quot;as is&quot;. To the extent permitted by law, {site.name} is not liable for indirect or consequential losses arising from its use.</p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of Bangladesh, and disputes are subject to the courts of Dhaka.</p>
          <h2>Contact</h2>
          <p>
            Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a> or call {site.phoneDisplay}.
          </p>
        </div>
      </section>
    </>
  );
}
