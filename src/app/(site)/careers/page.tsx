import Link from "next/link";
import { ArrowUpRight, Briefcase, Clock, GraduationCap, HeartPulse, Laptop, MapPin, Plane, Sparkles, Users } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { getJobs } from "@/lib/content";
import { getDict } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Careers",
  description: "Join JarvX IT in Uttara, Dhaka. Open positions for backend, full stack and integration engineers with great benefits.",
  path: "/careers",
});

const BENEFITS = [
  { Icon: Laptop, title: "Hybrid & flexible", text: "Work from our Uttara office or home, with flexible hours." },
  { Icon: HeartPulse, title: "Health coverage", text: "Medical insurance for you and your family." },
  { Icon: GraduationCap, title: "Learning budget", text: "Courses, certifications and conference tickets." },
  { Icon: Plane, title: "Paid time off", text: "Generous annual leave plus festival bonuses." },
  { Icon: Sparkles, title: "Latest tech", text: "Modern stacks, AI tools and top-spec machines." },
  { Icon: Users, title: "Great team", text: "Friendly, senior engineers who love to mentor." },
];

export default async function CareersPage() {
  const t = getDict();
  const jobs = await getJobs();
  return (
    <>
      <PageHeader eyebrow={t.nav.careers} title="Build the *future* with us" text="We're always looking for curious, kind and talented people who love to build." />

      <section className="section pt-8">
        <div className="container">
          <SectionHeading eyebrow="Benefits" title="Why you'll love working here" />
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ Icon, title, text }) => (
              <StaggerItem key={title} className="glass rounded-3xl p-7">
                <Icon className="h-7 w-7 text-purple" />
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section" id="positions">
        <div className="container max-w-5xl">
          <SectionHeading eyebrow="Open positions" title={`${jobs.length} roles open now`} />
          <Stagger className="space-y-4">
            {jobs.map((j) => (
              <StaggerItem key={j.slug}>
                <Link href={`/careers/${j.slug}`} className="gradient-border glass group flex flex-col gap-4 rounded-3xl p-6 transition md:flex-row md:items-center md:justify-between md:p-8">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{j.title}</h3>
                    <p className="mt-1 text-muted">{j.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                      <li className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-purple" /> {j.department}</li>
                      <li className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-purple" /> {j.location}</li>
                      <li className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-purple" /> {j.type}</li>
                    </ul>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-purple dark:text-purple-300">
                    {t.common.apply} <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
