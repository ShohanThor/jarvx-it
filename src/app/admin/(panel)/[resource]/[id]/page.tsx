import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { RecordForm } from "@/components/admin/AdminUI";
import { getResource, type Field } from "@/lib/admin/resources";
import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";

/** Convert a stored DB value into the string shown in the form field */
function toFormValue(f: Field, v: unknown): string | boolean {
  if (f.type === "boolean") return v === undefined ? true : Boolean(v);
  if (v === null || v === undefined) return f.type === "json" ? (f.placeholder ?? "") : "";
  if (f.type === "list" || f.type === "images") return parseJson<string[]>(String(v), []).join("\n");
  if (f.type === "json") return JSON.stringify(parseJson(String(v), null), null, 2);
  if (f.type === "date" && v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

export default async function EditRecord({ params }: { params: { resource: string; id: string } }) {
  const res = getResource(params.resource);
  if (!res) notFound();
  const isNew = params.id === "new";
  const model = (db as unknown as Record<string, { findUnique: (a: unknown) => Promise<Record<string, unknown> | null> }>)[res.model];
  const row = isNew ? {} : await model.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  const values = Object.fromEntries(res.fields.map((f) => [f.name, toFormValue(f, row[f.name])]));

  return (
    <div className="max-w-5xl space-y-6">
      <Link href={`/admin/${res.key}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-purple">
        <ArrowLeft className="h-4 w-4" /> {res.label}
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{isNew ? `New ${res.singular.toLowerCase()}` : String(row[res.titleField] ?? res.singular)}</h1>
        {!isNew && res.publicPath && (
          <a href={res.publicPath(row)} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-purple">
            View on site <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      <RecordForm resourceKey={res.key} id={isNew ? null : params.id} fields={res.fields} values={values} />
    </div>
  );
}
