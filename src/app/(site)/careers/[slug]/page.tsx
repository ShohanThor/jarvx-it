import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, CheckCircle2, Clock, GraduationCap, MapPin, Wallet } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { ApplyForm } from "@/components/widgets/ApplyForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { getJob } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, jobSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const j = await getJob(params.slug);
  if (!j) return {};
  return buildMetadata({ title: `${j.title} — Careers`, description: j.summary, path: `/careers/${j.slug}` });
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const j = await getJob(params.slug);
  if (!j) notFound();
  const meta = [
    { Icon: Briefcase, v: j.department },
    { Icon: MapPin, v: j.location },
    { Icon: Clock, v: j.type },
    { Icon: GraduationCap, v: j.experience },
    { Icon: Wallet, v: j.salary },
  ].filter((m) => m.v);

  return (
    <>
      <JsonLd
        data={[
          jobSchema(j),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: j.title, path: `/careers/${j.slug}` },
          ]),
        ]}
      />
      <section className="relative pb-10 pt-36 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-purple/25 blur-[120px]" />
        <div className="container relative max-w-5xl">
          <Link href="/careers#positions" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-purple">
            <ArrowLeft className="h-4 w-4" /> All positions
          </Link>
          <SplitWords as="h1" text={j.title} animateOnMount className="font-display text-4xl font-bold leading-[1.05] md:text-6xl" />
          <Reveal delay={0.3}>
            <ul className="mt-6 flex flex-wrap gap-3">
              {meta.map(({ Icon, v }) => (
                <li key={v} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                  <Icon className="h-4 w-4 text-purple" /> {v}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid max-w-5xl gap-12 lg:max-w-6xl lg:grid-cols-[1fr_1.05fr]">
          <Reveal className="space-y-10">
            <p className="text-lg leading-relaxed text-fg/85">{j.description}</p>
            {[
              ["Responsibilities", j.responsibilities],
              ["Requirements", j.requirements],
            ].map(([title, list]) => (
              <div key={title as string}>
                <h2 className="font-display text-2xl font-semibold">{title as string}</h2>
                <ul className="mt-4 space-y-3">
                  {(list as string[]).map((r) => (
                    <li key={r} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-purple" />
                      <span className="text-fg/85">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
          <div className="lg:sticky lg:top-28 lg:self-start" id="apply">
            <ApplyForm jobId={j.id} jobTitle={j.title} />
          </div>
        </div>
      </section>
    </>
  );
}
