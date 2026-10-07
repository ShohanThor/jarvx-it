import fs from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { CV_DIR } from "@/lib/storage";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Admin-only CV download */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });
  const app = await db.application.findUnique({ where: { id: params.id } });
  if (!app?.cvPath) return new Response("Not found", { status: 404 });
  const file = path.basename(app.cvPath);
  try {
    const buf = await fs.readFile(path.join(CV_DIR, file));
    const ext = path.extname(file);
    const downloadName = (app.cvName || `cv${ext}`).replace(/[^\w.\- ]/g, "_");
    return new Response(buf, {
      headers: {
        "content-type": TYPES[ext] ?? "application/octet-stream",
        "content-disposition": `attachment; filename="${downloadName}"`,
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
