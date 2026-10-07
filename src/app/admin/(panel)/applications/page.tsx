import Link from "next/link";
import { FileDown } from "lucide-react";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/AdminUI";
import { deleteApplication, updateApplication } from "@/lib/admin/actions";
import { APPLICATION_STATUSES } from "@/lib/admin/resources";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export default async function ApplicationsPage({ searchParams }: { searchParams: { job?: string; status?: string } }) {
  const [jobs, apps] = await Promise.all([
    db.job.findMany({ orderBy: { postedAt: "desc" }, include: { _count: { select: { applications: true } } } }),
    db.application.findMany({
      where: { ...(searchParams.job ? { jobId: searchParams.job } : {}), ...(searchParams.status ? { status: searchParams.status } : {}) },
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } } },
      take: 200,
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Job applications</h1>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/applications" className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", !searchParams.job ? "bg-brand text-white" : "glass")}>All jobs</Link>
        {jobs.map((j) => (
          <Link key={j.id} href={`/admin/applications?job=${j.id}`} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold", searchParams.job === j.id ? "bg-brand text-white" : "glass")}>
            {j.title} <span className="opacity-60">{j._count.applications}</span>
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {apps.map((a) => (
          <details key={a.id} className="glass rounded-3xl">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-4 p-5">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", a.status === "new" ? "bg-red-500/15 text-red-500" : "bg-purple/15 text-purple")}>{a.status}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{a.name} <span className="font-normal text-muted">· {a.email}</span></p>
                <p className="truncate text-sm text-muted">{a.job.title}</p>
              </div>
              <span className="text-xs text-muted">{a.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
            </summary>
            <div className="grid gap-6 border-t border-line/10 p-5 md:grid-cols-2">
              <div className="space-y-3 text-sm">
                {a.cvPath && (
                  <a href={`/api/admin/cv/${a.id}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 font-semibold text-white">
                    <FileDown className="h-4 w-4" /> Download CV {a.cvName && <span className="opacity-70">({a.cvName})</span>}
                  </a>
                )}
                {a.phone && <p><span className="text-muted">Phone:</span> {a.phone}</p>}
                {a.linkedin && <p><span className="text-muted">LinkedIn:</span> <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple underline">{a.linkedin}</a></p>}
                {a.portfolio && <p><span className="text-muted">Portfolio:</span> <a href={a.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple underline">{a.portfolio}</a></p>}
                {a.coverLetter && <p className="whitespace-pre-wrap rounded-2xl bg-purple/5 p-4">{a.coverLetter}</p>}
              </div>
              <div className="space-y-3">
                <form action={updateApplication.bind(null, a.id)} className="space-y-3">
                  <label className="label" htmlFor={`as-${a.id}`}>Status</label>
                  <select id={`as-${a.id}`} name="status" defaultValue={a.status} className="input capitalize">
                    {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <label className="label" htmlFor={`an-${a.id}`}>Notes</label>
                  <textarea id={`an-${a.id}`} name="notes" defaultValue={a.notes} rows={3} className="input" />
                  <SubmitButton>Update</SubmitButton>
                </form>
                <form action={deleteApplication.bind(null, a.id)}>
                  <ConfirmSubmit message={`Delete application from ${a.name} (including CV)?`} />
                </form>
              </div>
            </div>
          </details>
        ))}
        {!apps.length && <p className="glass rounded-3xl p-10 text-center text-muted">No applications yet.</p>}
      </div>
    </div>
  );
}
