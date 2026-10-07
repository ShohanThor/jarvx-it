import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { services, products, projects, clients, stats, testimonials, team, faqs, jobs, posts } from "./data";

const db = new PrismaClient();
const j = (v: unknown) => JSON.stringify(v);
const logoPath = (name: string) => `/images/clients/${name.toLowerCase().replace(/\s+/g, "-")}.webp`;

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 8) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (8+ chars) in .env before seeding");
  }
  await db.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 12) },
  });

  for (const [order, s] of services.entries()) {
    const { bn, features, process, ...rest } = s;
    const data = { ...rest, features: j(features), process: j(process), i18n: j({ bn }), order };
    await db.service.upsert({ where: { slug: s.slug }, update: data, create: data });
  }

  for (const [order, p] of products.entries()) {
    const { features, plans, ...rest } = p;
    const data = {
      ...rest,
      features: j(features),
      plans: j(plans),
      screenshots: j([1, 2, 3].map((n) => `/images/products/${p.slug}/${n}.webp`)),
      order,
    };
    await db.product.upsert({ where: { slug: p.slug }, update: data, create: data });
  }

  for (const [order, p] of projects.entries()) {
    const { tech, results, serviceSlugs, ...rest } = p;
    const data = {
      ...rest,
      tech: j(tech),
      results: j(results),
      serviceSlugs: j(serviceSlugs),
      cover: `/images/projects/${p.slug}/cover.webp`,
      gallery: j([1, 2, 3].map((n) => `/images/projects/${p.slug}/${n}.webp`)),
      order,
    };
    await db.project.upsert({ where: { slug: p.slug }, update: data, create: data });
  }

  for (const [order, s] of stats.entries()) {
    const { bn, ...rest } = s;
    const data = { ...rest, i18n: j({ bn }), order };
    await db.stat.upsert({ where: { key: s.key }, update: data, create: data });
  }

  for (const [order, p] of posts.entries()) {
    const { tags, ...rest } = p;
    const publishedAt = new Date(Date.now() - order * 9 * 86400000);
    const data = { ...rest, tags: j(tags), cover: `/images/blog/${p.slug}.webp`, publishedAt };
    await db.post.upsert({ where: { slug: p.slug }, update: data, create: data });
  }

  for (const jb of jobs) {
    const { responsibilities, requirements, ...rest } = jb;
    const data = {
      ...rest,
      responsibilities: j(responsibilities),
      requirements: j(requirements),
      validThrough: new Date(Date.now() + 60 * 86400000),
    };
    await db.job.upsert({ where: { slug: jb.slug }, update: data, create: data });
  }

  // Simple collections without a natural unique key: replace on every seed
  await db.$transaction([
    db.clientLogo.deleteMany(),
    db.clientLogo.createMany({ data: clients.map((name, order) => ({ name, logo: logoPath(name), order })) }),
    db.testimonial.deleteMany(),
    db.testimonial.createMany({
      data: testimonials.map((t, order) => ({
        ...t,
        photo: `/images/testimonials/${order + 1}.webp`,
        companyLogo: logoPath(clients.find((c) => c.startsWith(t.company.split(" ")[0])) ?? t.company),
        order,
      })),
    }),
    db.teamMember.deleteMany(),
    db.teamMember.createMany({
      data: team.map((m, order) => ({ ...m, photo: `/images/team/${order + 1}.webp`, linkedin: "https://www.linkedin.com/company/jarvxit", order })),
    }),
    db.faq.deleteMany(),
    db.faq.createMany({ data: faqs.map(({ bn, ...f }, order) => ({ ...f, i18n: j({ bn }), order })) }),
  ]);

  console.log("Seed complete. Admin:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
