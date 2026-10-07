import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getSession } from "@/lib/auth";
import { MEDIA_DIR } from "@/lib/storage";

export const runtime = "nodejs";

const MAX = 10 * 1024 * 1024;

/** Admin image upload: re-encodes any raster image to WebP (max 2400px) and stores it in the media folder */
export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const fd = await req.formData().catch(() => null);
  const file = fd?.get("file");
  if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Image must be under 10 MB" }, { status: 400 });
  if (!/^image\/(png|jpe?g|webp|avif|gif)$/.test(file.type)) return NextResponse.json({ error: "Use PNG, JPG, WebP, AVIF or GIF" }, { status: 400 });

  try {
    const out = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    const name = `${randomUUID()}.webp`;
    await fs.writeFile(path.join(MEDIA_DIR, name), out);
    return NextResponse.json({ url: `/media/${name}` });
  } catch {
    return NextResponse.json({ error: "Could not process image" }, { status: 400 });
  }
}
