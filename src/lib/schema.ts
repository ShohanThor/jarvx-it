import { site } from "./site";
import type { JobT, PostT, ProductT } from "./content";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: "BD",
    },
    contactPoint: [{ "@type": "ContactPoint", telephone: site.phone, contactType: "sales", areaServed: "Worldwide", availableLanguage: ["English", "Bengali"] }],
    sameAs: Object.values(site.social),
  };
}

export function productSchema(p: ProductT) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${site.url}/products/${p.slug}#product`,
    name: p.name,
    description: p.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    image: p.screenshots.map((s) => `${site.url}${s}`),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...p.plans.map((pl) => pl.monthly), p.monthlyPrice),
      highPrice: Math.max(...p.plans.map((pl) => pl.monthly), p.monthlyPrice),
      offerCount: p.plans.length || 1,
      offers: p.plans.map((pl) => ({
        "@type": "Offer",
        name: `${p.name} ${pl.name}`,
        price: pl.monthly,
        priceCurrency: "USD",
        priceSpecification: { "@type": "UnitPriceSpecification", price: pl.monthly, priceCurrency: "USD", unitCode: "MON" },
        url: `${site.url}/products/${p.slug}`,
      })),
    },
  };
}

export function jobSchema(j: JobT) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: `<p>${j.description}</p><h3>Responsibilities</h3><ul>${j.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul><h3>Requirements</h3><ul>${j.requirements.map((r) => `<li>${r}</li>`).join("")}</ul>`,
    datePosted: j.postedAt.toISOString(),
    ...(j.validThrough ? { validThrough: j.validThrough.toISOString() } : {}),
    employmentType: j.type.toUpperCase().replace(/[\s-]/g, "_"),
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url, logo: `${site.url}/logo.png` },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        postalCode: site.address.postalCode,
        addressCountry: "BD",
      },
    },
    directApply: true,
  };
}

export function articleSchema(p: PostT) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: `${site.url}${p.cover}`,
    datePublished: p.publishedAt.toISOString(),
    dateModified: p.updatedAt.toISOString(),
    author: { "@type": "Organization", name: p.author },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/blog/${p.slug}`,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}
