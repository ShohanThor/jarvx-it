import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail } from "@/lib/utils";

export async function POST(req: Request) {
  if (!rateLimit(`nl:${clientIp()}`, 5, 10 * 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = clean(body?.email, 200).toLowerCase();
  if (!isEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  await db.subscriber.upsert({ where: { email }, update: {}, create: { email } });
  return NextResponse.json({ ok: true });
}
