import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { CV_DIR } from "@/lib/storage";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { clean, isEmail } from "@/lib/utils";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

function looksLikeDocument(buf: Buffer, ext: string) {
  if (ext === ".pdf") return buf.subarray(0, 4).toString() === "%PDF";
  if (ext === ".docx") return buf[0] === 0x50 && buf[1] === 0x4b; // zip
  if (ext === ".doc") return buf[0] === 0xd0 && buf[1] === 0xcf; // OLE
  return false;
}

export async function POST(req: Request) {
  if (!rateLimit(`apply:${clientIp()}`, 5, 60 * 60_000)) return NextResponse.json({ error: "Too many applications. Please try later." }, { status: 429 });

  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  if (clean(fd.get("website"))) return NextResponse.json({ ok: true });

  const jobId = clean(fd.get("jobId"), 60);
  const name = clean(fd.get("name"), 120);
  const email = clean(fd.get("email"), 200);
  const cv = fd.get("cv");
  if (!name || !isEmail(email)) return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  const job = await db.job.findFirst({ where: { id: jobId, published: true } });
  if (!job) return NextResponse.json({ error: "This position is no longer open." }, { status: 404 });
  if (!(cv instanceof File) || cv.size === 0) return NextResponse.json({ error: "Please attach your CV." }, { status: 400 });
  if (cv.size > MAX_BYTES) return NextResponse.json({ error: "CV must be smaller than 5 MB." }, { status: 400 });
  const ext = ALLOWED[cv.type] ?? path.extname(cv.name).toLowerCase();
  if (!Object.values(ALLOWED).includes(ext)) return NextResponse.json({ error: "CV must be a PDF, DOC or DOCX file." }, { status: 400 });

  const buf = Buffer.from(await cv.arrayBuffer());
  if (!looksLikeDocument(buf, ext)) return NextResponse.json({ error: "The file doesn't look like a valid document." }, { status: 400 });

  await fs.mkdir(CV_DIR, { recursive: true });
  const stored = `${randomUUID()}${ext}`;
  await fs.writeFile(path.join(CV_DIR, stored), buf);

  await db.application.create({
    data: {
      jobId: job.id,
      name,
      email,
      phone: clean(fd.get("phone"), 40),
      linkedin: clean(fd.get("linkedin"), 300),
      portfolio: clean(fd.get("portfolio"), 300),
      coverLetter: clean(fd.get("coverLetter"), 5000),
      cvPath: stored,
      cvName: clean(cv.name, 200),
    },
  });
  return NextResponse.json({ ok: true });
}
