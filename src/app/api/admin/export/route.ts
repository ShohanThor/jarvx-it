import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Escape a CSV cell; prefix formula-like values so spreadsheets don't execute them */
function csvCell(v: unknown) {
  let s = v instanceof Date ? v.toISOString() : String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const type = new URL(req.url).searchParams.get("type");
  let rows: Record<string, unknown>[] = [];
  if (type === "leads") {
    rows = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  } else if (type === "subscribers") {
    rows = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  } else return new Response("Unknown type", { status: 400 });
  const cols = rows.length ? Object.keys(rows[0]) : ["email"];
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="jarvx-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
