import fs from "node:fs/promises";
import path from "node:path";
import { MEDIA_DIR } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * Serves admin-uploaded images. (Files written to /public after `next build` are not served
 * in production, so uploads live in /storage/media and are streamed from here.)
 */
export async function GET(_: Request, { params }: { params: { name: string } }) {
  const name = path.basename(params.name);
  if (!/^[\w-]+\.webp$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(MEDIA_DIR, name));
    return new Response(buf, { headers: { "content-type": "image/webp", "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
