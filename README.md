# JarvX IT — Website & CMS

A premium, 3D- and motion-rich marketing site for **JarvX IT** (Dhaka, Bangladesh), with a built-in admin panel so all content is editable without code.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Three.js + React Three Fiber + Drei · GSAP + ScrollTrigger · Framer Motion · Lenis · Prisma + PostgreSQL · Vercel Blob · Claude API (chat assistant)

---

## Quick start (local)

```bash
npm install
npm run db:local   # starts a local Postgres (Prisma dev server) in the background
cp .env.example .env   # then fill AUTH_SECRET and ADMIN_PASSWORD
npm run setup      # creates tables, seeds content + the admin user
npm run dev        # http://localhost:3000
```

| URL | What |
|---|---|
| `/` | Website |
| `/admin` | CMS (sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`; change the password under **Settings**) |

## Deploy to Vercel

1. **Import** the GitHub repo at [vercel.com/new](https://vercel.com/new) (pick it from the list, don't paste the URL).
2. **Storage tab** of the project → connect **Prisma Postgres** (sets `DATABASE_URL`) and a **Blob** store (sets `BLOB_READ_WRITE_TOKEN`).
3. **Settings → Environment Variables** — add:

   | Name | Value |
   |---|---|
   | `AUTH_SECRET` | 64 random hex chars (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `ADMIN_EMAIL` | your admin email |
   | `ADMIN_PASSWORD` | a strong password (10+ chars) |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (or your domain), no trailing slash |
   | `ANTHROPIC_API_KEY` | optional — enables the Claude chat assistant |

4. **Deploy** (or Redeploy after adding variables). The `vercel-build` script creates the tables, seeds content + the admin account **only into an empty database** (redeploys never overwrite admin edits), then builds.

> If Vercel's Prisma integration names the direct connection string something other than `DATABASE_URL` (e.g. `POSTGRES_URL`), add a `DATABASE_URL` variable with that value.

## What's inside

### Pages
Home · Services (+ detail per service) · Products (+ detail with pricing toggle, demo video, plans) · Portfolio (filterable, + case studies) · About · Careers (+ job detail with CV upload) · Blog (categories, search, featured, reading time, related) · Contact (multi-step inquiry, booking calendar, Google Map) · Privacy · Terms · 404.

### 3D & motion
| Feature | Where |
|---|---|
| Intro loader — JX strokes draw, gradient fills, mark flies into the navbar | `components/motion/IntroLoader.tsx` (once per session) |
| Hero — JX logo as glossy glowing tubes, mouse parallax, particles, code symbols | `components/three/HeroScene.tsx` (lazy, loads after idle) |
| Mesh-gradient background | `components/motion/MeshGradient.tsx` (pure CSS) |
| Custom cursor (dot + trailing ring, labels like “Drag”/“View”) | `components/motion/CustomCursor.tsx` |
| Magnetic buttons + shine sweep | `components/ui/Button.tsx` |
| Scroll reveals (fade/slide/stagger/clip), word-by-word headings | `components/motion/Reveal.tsx`, `SplitWords.tsx` |
| SEO-safe counters (real numbers in HTML, animate from 0 in view) | `components/motion/Counter.tsx` |
| 3D tilt cards with glowing gradient border, per-service animated 3D icons | `components/ui/TiltCard.tsx`, `components/three/ServiceIcon*.tsx` |
| Pinned horizontal showcase with 3D perspective cards | `components/sections/home/Showcase.tsx` |
| Interactive 3D tech-logo sphere | `components/three/TechSphere*.tsx` |
| Self-drawing glowing process timeline | `components/sections/home/ProcessTimeline.tsx` |
| 3D testimonial ring carousel | `components/sections/home/Testimonials.tsx` |
| Purple gradient page-transition wipe | `components/motion/PageTransition.tsx` |

**Performance:** every WebGL scene is code-split and mounted only near the viewport, paused off-screen, and uses fewer particles/lower DPR on mobile. With `prefers-reduced-motion`, smooth scroll, cursor, transitions, the loader and 3D animation are disabled (static fallbacks are shown).

### Interactive features
- **Cost estimator** (BDT + USD) with lead capture — pricing model in `src/lib/estimator.ts`.
- **AI chat assistant** — `src/app/api/chat/route.ts`. Uses Claude (`claude-opus-5-5` by default, override with `ANTHROPIC_MODEL`) with a system prompt built live from the CMS (services, products, plans, FAQ). Server-side refusal fallback is enabled. Without `ANTHROPIC_API_KEY` it falls back to a keyword FAQ bot.
- **WhatsApp & Messenger** buttons — `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_MESSENGER_PAGE`.
- **English / Bangla** toggle — UI strings in `src/lib/i18n/dictionaries.ts`; CMS records support translations via their `i18n` JSON field (e.g. `{"bn": {"title": "…"}}`), seeded for services, stats and FAQ.
- **Meeting booking** — Sun–Thu slots in Dhaka time, double-booking prevented.

### Admin panel (`/admin`)
Secure login (bcrypt + signed HttpOnly JWT cookie, middleware guard, login rate limiting). Manage services, products & pricing plans, portfolio case studies, blog posts (Markdown), testimonials, client logos, stats, team, FAQ, job posts; review **job applications** (CV download) and **leads** with status tracking (new → contacted → qualified → proposal → won/lost) and notes; newsletter subscribers; CSV export. Image uploads are converted to WebP automatically.

Content types are declared in **`src/lib/admin/resources.ts`** — add a field there (and in `prisma/schema.prisma`) to make it editable.

### SEO
Server-rendered pages · unique title/description per page · canonical + `og:url` · dynamic OG image per page (`/api/og`) · `sitemap.xml` from the DB · `robots.txt` · JSON-LD for Organization, SoftwareApplication/Product (+ offers), JobPosting, BlogPosting, FAQPage, Service and breadcrumbs · `next/image` (AVIF/WebP, lazy) · self-hosted fonts (Space Grotesk, Inter, Hind Siliguri).

---

## Before going live

1. **Replace placeholder content.** Client names, testimonials, team members, stats, case-study numbers and all images are placeholders (`prisma/data.ts`, generated by `scripts/generate-images.ts`). Edit them in the admin.
2. **Legal pages** (`/privacy`, `/terms`) are starting templates — have them reviewed.
3. **Storage:** with `BLOB_READ_WRITE_TOKEN` set, admin images go to Vercel Blob (public) and CVs to Vercel Blob (private; served only through the admin download route). Without it, files go to `./storage` on disk (`src/lib/storage.ts`).
4. **Rate limiting** is in-memory, so on serverless it is per-instance only. Use Upstash Redis for strict limits.
5. **Email notifications** for new leads/applications aren't wired up — add your provider (Resend, SES, …) in `src/app/api/leads/route.ts` and `src/app/api/apply/route.ts`.

## Scripts
| Command | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:local` | start the local Postgres server |
| `npm run setup` | create tables + seed |
| `npm run db:seed` | re-seed content (upserts; admin user is only created if missing) |
| `npm run images` | regenerate placeholder WebP images |
| `npm run typecheck` / `lint` | checks |
