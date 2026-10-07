import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { del, get, put } from "@vercel/blob";

/**
 * File storage. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production on Vercel),
 * otherwise the local disk (development / self-hosted servers).
 */
const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Local folders (outside /public: files added after `next build` aren't served from /public) */
export const CV_DIR = path.join(process.cwd(), "storage", "cvs");
export const MEDIA_DIR = path.join(process.cwd(), "storage", "media");

/** Store a public WebP image; returns the URL to use in content */
export async function saveImage(buf: Buffer): Promise<string> {
  const name = `${randomUUID()}.webp`;
  if (blobEnabled()) {
    const blob = await put(`media/${name}`, buf, { access: "public", contentType: "image/webp" });
    return blob.url;
  }
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  await fs.writeFile(path.join(MEDIA_DIR, name), buf);
  return `/media/${name}`;
}

/**
 * Store a CV. On Vercel Blob it is stored privately; if the store only allows public blobs it falls
 * back to an unguessable random path. Either way it is only ever handed out via the admin download route.
 */
export async function saveCv(buf: Buffer, ext: string, contentType: string): Promise<string> {
  const name = `${randomUUID()}${ext}`;
  if (blobEnabled()) {
    try {
      return (await put(`cvs/${name}`, buf, { access: "private", contentType })).url;
    } catch {
      return (await put(`cvs/${name}`, buf, { access: "public", contentType, addRandomSuffix: true })).url;
    }
  }
  await fs.mkdir(CV_DIR, { recursive: true });
  await fs.writeFile(path.join(CV_DIR, name), buf);
  return name;
}

export async function readCv(cvPath: string): Promise<ReadableStream<Uint8Array> | Buffer | null> {
  if (/^https?:\/\//.test(cvPath)) {
    for (const access of ["private", "public"] as const) {
      try {
        const res = await get(cvPath, { access });
        if (res?.stream) return res.stream;
      } catch {}
    }
    return null;
  }
  try {
    return await fs.readFile(path.join(CV_DIR, path.basename(cvPath)));
  } catch {
    return null;
  }
}

export async function deleteCv(cvPath: string) {
  if (!cvPath) return;
  if (/^https?:\/\//.test(cvPath)) await del(cvPath).catch(() => {});
  else await fs.rm(path.join(CV_DIR, path.basename(cvPath)), { force: true });
}
