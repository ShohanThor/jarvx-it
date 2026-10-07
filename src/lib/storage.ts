import path from "node:path";

/** CVs are private: stored outside /public and served only to admins via /api/admin/cv/[id] */
export const CV_DIR = path.join(process.cwd(), "storage", "cvs");
/** Admin-uploaded images (converted to WebP), served publicly by /media/[name] */
export const MEDIA_DIR = path.join(process.cwd(), "storage", "media");
