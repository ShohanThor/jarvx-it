/**
 * Generates branded placeholder WebP images for the seeded content.
 * Replace them anytime by uploading real images from the admin panel.
 * Run: npm run images
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { projects, products, team, testimonials, posts, clients } from "../prisma/data";

const OUT = path.join(process.cwd(), "public", "images");
const PALETTES = [
  ["#3B2FA0", "#7C3AED"],
  ["#0D2B7E", "#7C3AED"],
  ["#1E1B4B", "#9F67FF"],
  ["#0D2B7E", "#3B82F6"],
  ["#3B2FA0", "#EC4899"],
  ["#111827", "#7C3AED"],
  ["#0F766E", "#3B2FA0"],
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function rand(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function bg(w: number, h: number, [a, b]: string[], id: string) {
  return `
  <defs>
    <linearGradient id="g${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="r${id}" cx=".8" cy=".1" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#070B1F"/>
  <rect width="${w}" height="${h}" fill="url(#g${id})" opacity=".9"/>
  <rect width="${w}" height="${h}" fill="url(#r${id})"/>
  <path d="M${w * 0.06} ${h * 0.9} Q ${w * 0.4} ${h * 0.5} ${w * 1.05} ${h * 0.75}" stroke="#fff" stroke-opacity=".08" stroke-width="${h * 0.08}" fill="none" stroke-linecap="round"/>`;
}

/** Browser window with a fake dashboard / storefront UI */
function browserMock(x: number, y: number, w: number, h: number, seed: number, variant: number) {
  const r = rand(seed);
  let ui = "";
  const ix = x + 24, iy = y + 64, iw = w - 48, ih = h - 88;
  if (variant % 3 === 0) {
    // dashboard: sidebar + kpis + chart
    ui += `<rect x="${ix}" y="${iy}" width="${iw * 0.18}" height="${ih}" rx="14" fill="#fff" fill-opacity=".06"/>`;
    for (let i = 0; i < 6; i++) ui += `<rect x="${ix + 18}" y="${iy + 24 + i * 40}" width="${iw * 0.18 - 36}" height="14" rx="7" fill="#fff" fill-opacity="${i === 1 ? 0.5 : 0.15}"/>`;
    const kx = ix + iw * 0.21, kw = (iw * 0.79 - 36) / 4;
    for (let i = 0; i < 4; i++) {
      ui += `<rect x="${kx + i * (kw + 12)}" y="${iy}" width="${kw}" height="${ih * 0.22}" rx="14" fill="#fff" fill-opacity=".08"/>`;
      ui += `<rect x="${kx + i * (kw + 12) + 16}" y="${iy + 18}" width="${kw * 0.4}" height="10" rx="5" fill="#fff" fill-opacity=".3"/>`;
      ui += `<rect x="${kx + i * (kw + 12) + 16}" y="${iy + 40}" width="${kw * 0.6}" height="22" rx="8" fill="#fff" fill-opacity=".75"/>`;
    }
    const cy = iy + ih * 0.27, ch = ih * 0.73, cw = iw * 0.79 - 12;
    ui += `<rect x="${kx}" y="${cy}" width="${cw * 0.64}" height="${ch}" rx="14" fill="#fff" fill-opacity=".06"/>`;
    let d = `M${kx + 20} ${cy + ch - 30}`;
    for (let i = 1; i <= 10; i++) d += ` L${kx + 20 + (i * (cw * 0.64 - 40)) / 10} ${cy + 30 + r() * (ch - 70)}`;
    ui += `<path d="${d}" stroke="#C4B5FD" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    ui += `<rect x="${kx + cw * 0.66}" y="${cy}" width="${cw * 0.34}" height="${ch}" rx="14" fill="#fff" fill-opacity=".06"/>`;
    ui += `<circle cx="${kx + cw * 0.83}" cy="${cy + ch * 0.45}" r="${Math.min(cw * 0.11, ch * 0.3)}" stroke="#fff" stroke-opacity=".7" stroke-width="18" fill="none" stroke-dasharray="${180 + r() * 120} 400"/>`;
  } else if (variant % 3 === 1) {
    // storefront: hero + product grid
    ui += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih * 0.38}" rx="16" fill="#fff" fill-opacity=".1"/>`;
    ui += `<rect x="${ix + 32}" y="${iy + 36}" width="${iw * 0.35}" height="26" rx="10" fill="#fff" fill-opacity=".85"/>`;
    ui += `<rect x="${ix + 32}" y="${iy + 76}" width="${iw * 0.25}" height="14" rx="7" fill="#fff" fill-opacity=".35"/>`;
    ui += `<rect x="${ix + 32}" y="${iy + 110}" width="120" height="36" rx="18" fill="#fff"/>`;
    const gw = (iw - 36) / 4;
    for (let i = 0; i < 4; i++) {
      const gx = ix + i * (gw + 12), gy = iy + ih * 0.43;
      ui += `<rect x="${gx}" y="${gy}" width="${gw}" height="${ih * 0.57}" rx="16" fill="#fff" fill-opacity=".08"/>`;
      ui += `<rect x="${gx + 12}" y="${gy + 12}" width="${gw - 24}" height="${ih * 0.32}" rx="12" fill="#fff" fill-opacity="${0.15 + r() * 0.2}"/>`;
      ui += `<rect x="${gx + 12}" y="${gy + ih * 0.38}" width="${gw * 0.6}" height="12" rx="6" fill="#fff" fill-opacity=".6"/>`;
      ui += `<rect x="${gx + 12}" y="${gy + ih * 0.44}" width="${gw * 0.3}" height="12" rx="6" fill="#C4B5FD"/>`;
    }
  } else {
    // content list + phone
    for (let i = 0; i < 5; i++) {
      const ry = iy + i * (ih / 5);
      ui += `<rect x="${ix}" y="${ry}" width="${iw * 0.6}" height="${ih / 5 - 14}" rx="14" fill="#fff" fill-opacity=".07"/>`;
      ui += `<circle cx="${ix + 34}" cy="${ry + (ih / 5 - 14) / 2}" r="16" fill="#fff" fill-opacity=".5"/>`;
      ui += `<rect x="${ix + 62}" y="${ry + 18}" width="${iw * 0.3 * (0.6 + r() * 0.4)}" height="12" rx="6" fill="#fff" fill-opacity=".6"/>`;
      ui += `<rect x="${ix + 62}" y="${ry + 38}" width="${iw * 0.2}" height="10" rx="5" fill="#fff" fill-opacity=".25"/>`;
    }
    const px = ix + iw * 0.68, pw = iw * 0.26, ph = ih;
    ui += `<rect x="${px}" y="${iy}" width="${pw}" height="${ph}" rx="28" fill="#070B1F" fill-opacity=".55" stroke="#fff" stroke-opacity=".3" stroke-width="3"/>`;
    ui += `<rect x="${px + 14}" y="${iy + 30}" width="${pw - 28}" height="${ph * 0.35}" rx="16" fill="#fff" fill-opacity=".18"/>`;
    for (let i = 0; i < 3; i++) ui += `<rect x="${px + 14}" y="${iy + ph * 0.45 + i * 34}" width="${(pw - 28) * (0.9 - i * 0.2)}" height="14" rx="7" fill="#fff" fill-opacity=".45"/>`;
    ui += `<rect x="${px + 14}" y="${iy + ph - 64}" width="${pw - 28}" height="40" rx="20" fill="#fff"/>`;
  }
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#070B1F" fill-opacity=".35" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>
    <circle cx="${x + 26}" cy="${y + 26}" r="7" fill="#FF6B6B" fill-opacity=".8"/>
    <circle cx="${x + 48}" cy="${y + 26}" r="7" fill="#FFD166" fill-opacity=".8"/>
    <circle cx="${x + 70}" cy="${y + 26}" r="7" fill="#06D6A0" fill-opacity=".8"/>
    <rect x="${x + w * 0.3}" y="${y + 16}" width="${w * 0.4}" height="20" rx="10" fill="#fff" fill-opacity=".1"/>
    ${ui}
  </g>`;
}

async function write(file: string, svg: string) {
  const out = path.join(OUT, file);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(out);
}

function screen(w: number, h: number, seed: number, variant: number, label?: string) {
  const pal = PALETTES[seed % PALETTES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${bg(w, h, pal, String(seed))}
    ${browserMock(w * 0.07, h * (label ? 0.2 : 0.08), w * 0.86, h * (label ? 0.74 : 0.84), seed, variant)}
    ${label ? `<text x="${w * 0.07}" y="${h * 0.13}" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="${h * 0.06}" fill="#fff">${esc(label)}</text>` : ""}
  </svg>`;
}

function portrait(size: number, seed: number, name: string) {
  const pal = PALETTES[seed % PALETTES.length];
  const initials = name.replace(/^Dr\.\s*/, "").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    ${bg(100, 100, pal, "p" + seed)}
    <circle cx="50" cy="40" r="17" fill="#fff" fill-opacity=".22"/>
    <path d="M18 100 Q 20 64 50 62 Q 80 64 82 100Z" fill="#fff" fill-opacity=".18"/>
    <text x="50" y="47" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="18" fill="#fff">${esc(initials)}</text>
  </svg>`;
}

function logo(name: string, seed: number) {
  const w = 360, h = 120;
  const shapes = [
    `<circle cx="40" cy="60" r="22" fill="none" stroke="#5E6B78" stroke-width="9"/>`,
    `<rect x="18" y="38" width="44" height="44" rx="12" fill="none" stroke="#5E6B78" stroke-width="9"/>`,
    `<path d="M18 80 L40 36 L62 80" fill="none" stroke="#5E6B78" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M18 60 Q40 20 62 60 T 62 60" fill="none" stroke="#5E6B78" stroke-width="9" stroke-linecap="round"/>`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${shapes[seed % shapes.length]}
    <text x="80" y="74" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="36" fill="#5E6B78">${esc(name)}</text>
  </svg>`;
}

async function main() {
  const tasks: Promise<unknown>[] = [];
  projects.forEach((p, i) => {
    tasks.push(write(`projects/${p.slug}/cover.webp`, screen(1600, 1000, i, i, p.title)));
    for (let g = 1; g <= 3; g++) tasks.push(write(`projects/${p.slug}/${g}.webp`, screen(1600, 1000, i + g * 3, i + g)));
  });
  products.forEach((p, i) => {
    for (let g = 1; g <= 3; g++) tasks.push(write(`products/${p.slug}/${g}.webp`, screen(1600, 1000, i * 2 + g, g - 1, g === 1 ? p.name : undefined)));
  });
  team.forEach((m, i) => tasks.push(write(`team/${i + 1}.webp`, portrait(600, i, m.name))));
  testimonials.forEach((t, i) => tasks.push(write(`testimonials/${i + 1}.webp`, portrait(240, i + 3, t.name))));
  posts.forEach((p, i) => tasks.push(write(`blog/${p.slug}.webp`, screen(1200, 630, i + 2, i + 1, p.category))));
  for (let i = 1; i <= 4; i++) tasks.push(write(`office/${i}.webp`, screen(1200, 800, i + 4, i, ["Workspace", "Meeting room", "Lounge", "Team day"][i - 1])));
  clients.forEach((c, i) => tasks.push(write(`clients/${c.toLowerCase().replace(/\s+/g, "-")}.webp`, logo(c, i))));
  await Promise.all(tasks);
  console.log(`Generated ${tasks.length} images in public/images`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
