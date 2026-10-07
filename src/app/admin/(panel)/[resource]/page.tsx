import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { ConfirmSubmit } from "@/components/admin/AdminUI";
import { deleteRecord } from "@/lib/admin/actions";
import { getResource } from "@/lib/admin/resources";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

type Row = Record<string, unknown> & { id: string };

function cell(v: unknown) {
  if (typeof v === "boolean") return v ? <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-500">Yes</span> : <span className="text-muted">No</span>;
  if (v instanceof Date) return formatDate(v);
  return String(v ?? "—");
}

export default async function ResourceList({ params, searchParams }: { params: { resource: string }; searchParams: { saved?: string; deleted?: string } }) {
  const res = getResource(params.resource);
  if (!res) notFound();
  const model = (db as unknown as Record<string, { findMany: (a: unknown) => Promise<Row[]> }>)[res.model];
  const rows = await model.findMany({ orderBy: res.orderBy });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{res.label}</h1>
          <p className="text-sm text-muted">{rows.length} items</p>
        </div>
        <Link href={`/admin/${res.key}/new`} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-glow">
          <Plus className="h-4 w-4" /> New {res.singular.toLowerCase()}
        </Link>
      </div>
      {(searchParams.saved || searchParams.deleted) && (
        <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500" role="status">
          {searchParams.saved ? "Saved." : "Deleted."} Changes are live on the website.
        </p>
      )}
      <div className="glass overflow-x-auto rounded-4xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line/10 text-left text-xs uppercase tracking-wider text-muted">
              {res.listFields.map((f) => (
                <th key={f} className="px-5 py-4 font-semibold">{res.fields.find((x) => x.name === f)?.label ?? f}</th>
              ))}
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/10">
            {rows.map((r) => (
              <tr key={r.id} className="transition hover:bg-purple/5">
                {res.listFields.map((f, i) => (
                  <td key={f} className="max-w-xs truncate px-5 py-3.5">
                    {i === 0 ? (
                      <Link href={`/admin/${res.key}/${r.id}`} className="font-semibold hover:text-purple">{cell(r[f])}</Link>
                    ) : (
                      cell(r[f])
                    )}
                  </td>
                ))}
                <td className="px-5 py-2">
                  <div className="flex items-center justify-end gap-1">
                    {res.publicPath && (
                      <a href={res.publicPath(r)} target="_blank" className="grid h-9 w-9 place-items-center rounded-full hover:bg-purple/10" aria-label="View on site">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link href={`/admin/${res.key}/${r.id}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-purple/10" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteRecord.bind(null, res.key, r.id)}>
                      <ConfirmSubmit label="" message={`Delete "${String(r[res.titleField])}"?`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={res.listFields.length + 1} className="px-5 py-12 text-center text-muted">Nothing here yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
