import Link from "next/link";
import { CalendarClock, Download } from "lucide-react";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/AdminUI";
import { deleteLead, updateLead } from "@/lib/admin/actions";
import { LEAD_STATUSES } from "@/lib/admin/resources";
import { db } from "@/lib/db";
import { cn, parseJson } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  new: "bg-red-500/15 text-red-500",
  contacted: "bg-amber-500/15 text-amber-500",
  qualified: "bg-sky-500/15 text-sky-500",
  proposal: "bg-purple/15 text-purple",
  won: "bg-emerald-500/15 text-emerald-500",
  lost: "bg-line/15 text-muted",
};
const SOURCES = ["inquiry", "estimator", "booking", "service", "product", "contact"];

export default async function LeadsPage({ searchParams }: { searchParams: { status?: string; source?: string } }) {
  const where = {
    ...(searchParams.status ? { status: searchParams.status } : {}),
    ...(searchParams.source ? { source: searchParams.source } : {}),
  };
  const [leads, grouped] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    db.lead.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (s: string) => grouped.find((g) => g.status === s)?._count ?? 0;
  const href = (k: string, v?: string) => {
    const p = new URLSearchParams({ ...(searchParams.status ? { status: searchParams.status } : {}), ...(searchParams.source ? { source: searchParams.source } : {}) });
    if (v) p.set(k, v);
    else p.delete(k);
    const s = p.toString();
    return `/admin/leads${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Leads</h1>
        <a href="/api/admin/export?type=leads" className="inline-flex h-10 items-center gap-2 rounded-full border border-line/15 px-4 text-sm font-semibold hover:border-purple/50">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={href("status")} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", !searchParams.status ? "bg-brand text-white" : "glass")}>All</Link>
        {LEAD_STATUSES.map((s) => (
          <Link key={s} href={href("status", s)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold capitalize", searchParams.status === s ? "bg-brand text-white" : "glass")}>
            {s} <span className="opacity-60">{count(s)}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="py-1 text-muted">Source:</span>
        <Link href={href("source")} className={cn("rounded-full px-3 py-1 font-semibold", !searchParams.source ? "bg-purple/20 text-purple" : "text-muted hover:text-fg")}>any</Link>
        {SOURCES.map((s) => (
          <Link key={s} href={href("source", s)} className={cn("rounded-full px-3 py-1 font-semibold", searchParams.source === s ? "bg-purple/20 text-purple" : "text-muted hover:text-fg")}>{s}</Link>
        ))}
      </div>

      <div className="space-y-3">
        {leads.map((l) => {
          const details = parseJson<Record<string, unknown>>(l.details, {});
          return (
            <details key={l.id} className="glass group rounded-3xl">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", STATUS_COLOR[l.status])}>{l.status}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.name} <span className="font-normal text-muted">· {l.email}{l.phone && ` · ${l.phone}`}</span></p>
                  <p className="truncate text-sm text-muted">{[l.service, l.budget, l.timeline].filter(Boolean).join(" · ") || l.message || "—"}</p>
                </div>
                {l.meetingAt && (
                  <span className="flex items-center gap-1.5 rounded-full bg-purple/10 px-3 py-1 text-xs font-semibold text-purple">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {l.meetingAt.toLocaleString("en-GB", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short" })}
                  </span>
                )}
                <span className="rounded-full bg-line/10 px-2.5 py-1 text-xs font-medium">{l.source}</span>
                <span className="text-xs text-muted">{l.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
              </summary>
              <div className="grid gap-6 border-t border-line/10 p-5 md:grid-cols-2">
                <dl className="space-y-2 text-sm">
                  {[
                    ["Company", l.company],
                    ["Service", l.service],
                    ["Budget", l.budget],
                    ["Timeline", l.timeline],
                    ["Message", l.message],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
                        <dd className="whitespace-pre-wrap">{v}</dd>
                      </div>
                    ))}
                  {Object.keys(details).length > 0 && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Details</dt>
                      <dd><pre className="mt-1 overflow-x-auto rounded-xl bg-ink/5 p-3 text-xs dark:bg-white/5">{JSON.stringify(details, null, 2)}</pre></dd>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <a href={`mailto:${l.email}`} className="text-sm font-semibold text-purple">Email</a>
                    {l.phone && <a href={`tel:${l.phone}`} className="text-sm font-semibold text-purple">Call</a>}
                    {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" className="text-sm font-semibold text-purple">WhatsApp</a>}
                  </div>
                </dl>
                <div className="space-y-3">
                  <form action={updateLead.bind(null, l.id)} className="space-y-3">
                    <label className="label" htmlFor={`st-${l.id}`}>Status</label>
                    <select id={`st-${l.id}`} name="status" defaultValue={l.status} className="input capitalize">
                      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <label className="label" htmlFor={`nt-${l.id}`}>Internal notes</label>
                    <textarea id={`nt-${l.id}`} name="notes" defaultValue={l.notes} rows={3} className="input" />
                    <SubmitButton>Update</SubmitButton>
                  </form>
                  <form action={deleteLead.bind(null, l.id)}>
                    <ConfirmSubmit message={`Delete lead from ${l.name}?`} />
                  </form>
                </div>
              </div>
            </details>
          );
        })}
        {!leads.length && <p className="glass rounded-3xl p-10 text-center text-muted">No leads match these filters.</p>}
      </div>
    </div>
  );
}
