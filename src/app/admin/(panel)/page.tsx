import Link from "next/link";
import { ArrowRight, Inbox, Mail, UserSquare2, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function Dashboard() {
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const [newLeads, leadsWeek, apps, subs, posts, recent, bookings] = await Promise.all([
    db.lead.count({ where: { status: "new" } }),
    db.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    db.application.count({ where: { status: "new" } }),
    db.subscriber.count(),
    db.post.count({ where: { published: true } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.lead.findMany({ where: { source: "booking", meetingAt: { gte: new Date() } }, orderBy: { meetingAt: "asc" }, take: 5 }),
  ]);
  const cards = [
    { label: "New leads", value: newLeads, sub: `${leadsWeek} this week`, href: "/admin/leads", Icon: Inbox },
    { label: "New applications", value: apps, sub: "awaiting review", href: "/admin/applications", Icon: UserSquare2 },
    { label: "Subscribers", value: subs, sub: "newsletter", href: "/admin/subscribers", Icon: Mail },
    { label: "Published posts", value: posts, sub: "blog", href: "/admin/posts", Icon: FileText },
  ];
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, sub, href, Icon }) => (
          <Link key={label} href={href} className="gradient-border glass group rounded-3xl p-6">
            <Icon className="h-6 w-6 text-purple" />
            <p className="mt-4 font-display text-4xl font-bold">{value}</p>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted">{sub}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="glass rounded-4xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent leads</h2>
            <Link href="/admin/leads" className="flex items-center gap-1 text-sm font-semibold text-purple">All <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ul className="divide-y divide-line/10">
            {recent.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{l.name} <span className="text-muted">· {l.email}</span></p>
                  <p className="truncate text-muted">{l.service || l.message || "—"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="rounded-full bg-purple/10 px-2 py-0.5 text-xs font-semibold text-purple">{l.source}</span>
                  <p className="mt-1 text-xs text-muted">{formatDate(l.createdAt)}</p>
                </div>
              </li>
            ))}
            {!recent.length && <li className="py-6 text-center text-muted">No leads yet.</li>}
          </ul>
        </section>
        <section className="glass rounded-4xl p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">Upcoming meetings</h2>
          <ul className="space-y-3">
            {bookings.map((b) => (
              <li key={b.id} className="rounded-2xl bg-purple/5 p-3 text-sm">
                <p className="font-medium">{b.name}</p>
                <p className="text-muted">{b.meetingAt?.toLocaleString("en-GB", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short" })} (Dhaka)</p>
              </li>
            ))}
            {!bookings.length && <li className="text-sm text-muted">No upcoming meetings.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
