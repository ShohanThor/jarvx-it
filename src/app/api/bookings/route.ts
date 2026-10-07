import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Taken meeting slots for a month (?month=YYYY-MM). Returns timestamps only — no personal data. */
export async function GET(req: Request) {
  const month = new URL(req.url).searchParams.get("month") ?? "";
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return NextResponse.json({ taken: [] });
  const start = new Date(Date.UTC(+m[1], +m[2] - 1, 1) - 6 * 3600_000);
  const end = new Date(Date.UTC(+m[1], +m[2], 1) + 6 * 3600_000);
  const rows = await db.lead.findMany({
    where: { source: "booking", meetingAt: { gte: start, lt: end }, status: { not: "lost" } },
    select: { meetingAt: true },
  });
  return NextResponse.json({ taken: rows.map((r) => r.meetingAt!.toISOString()) });
}
