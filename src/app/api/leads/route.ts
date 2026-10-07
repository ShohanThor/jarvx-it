import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail } from "@/lib/utils";
import { isValidSlot } from "@/lib/booking";

const SOURCES = ["inquiry", "estimator", "booking", "contact", "service", "product"];

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientIp()}`, 8, 10 * 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  // Honeypot: bots fill the hidden "website" field
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  if (!name || !isEmail(email)) return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 });

  let meetingAt: Date | null = null;
  if (typeof body.meetingAt === "string") {
    const d = new Date(body.meetingAt);
    if (!isNaN(d.getTime()) && d.getTime() > Date.now()) meetingAt = d;
  }

  const source = SOURCES.includes(String(body.source)) ? String(body.source) : "contact";
  if (source === "booking") {
    if (!meetingAt || !isValidSlot(meetingAt)) return NextResponse.json({ error: "Please choose an available time slot." }, { status: 400 });
    const clash = await db.lead.findFirst({ where: { source: "booking", meetingAt, status: { not: "lost" } } });
    if (clash) return NextResponse.json({ error: "That slot was just booked. Please pick another time." }, { status: 409 });
  }
  const details = body.details && typeof body.details === "object" ? JSON.stringify(body.details).slice(0, 5000) : "{}";

  await db.lead.create({
    data: {
      source,
      name,
      email,
      phone: clean(body.phone, 40),
      company: clean(body.company, 160),
      service: clean(body.service, 160),
      budget: clean(body.budget, 80),
      timeline: clean(body.timeline, 80),
      message: clean(body.message, 5000),
      details,
      meetingAt,
    },
  });
  return NextResponse.json({ ok: true });
}
