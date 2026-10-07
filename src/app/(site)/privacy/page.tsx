import { PageHeader } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({ title: "Privacy Policy", description: `How ${site.name} collects, uses and protects your personal information.`, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" text={`Last updated: ${new Date().getFullYear()}`} />
      <section className="pb-24">
        <div className="container prose-brand max-w-3xl">
          <p>
            This policy explains how {site.name} (&quot;we&quot;, &quot;us&quot;) handles personal information collected through {site.url}.
          </p>
          <h2>Information we collect</h2>
          <ul>
            <li>Details you submit through our forms: name, email, phone, company, project details and meeting requests.</li>
            <li>Job applications, including your CV and links you provide.</li>
            <li>Messages you send to our AI chat assistant, which are processed to generate a reply.</li>
            <li>Basic technical data such as browser type and pages visited.</li>
          </ul>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to inquiries, prepare proposals and schedule meetings.</li>
            <li>To evaluate job applications.</li>
            <li>To send our newsletter if you subscribe (you can unsubscribe at any time).</li>
          </ul>
          <h2>Sharing</h2>
          <p>We do not sell your data. We share it only with service providers that help us operate the website (hosting, email and AI providers), under appropriate safeguards.</p>
          <h2>Retention & your rights</h2>
          <p>
            We keep data only as long as needed for the purposes above. You can request access, correction or deletion at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
          <h2>Contact</h2>
          <p>
            {site.name}, {site.address.full}. Phone: {site.phoneDisplay}.
          </p>
        </div>
      </section>
    </>
  );
}
