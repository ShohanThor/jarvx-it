/**
 * Declarative CMS config: every content type the admin can manage.
 * The generic list/edit pages and server actions are driven entirely by this file —
 * add a field here (and to prisma/schema.prisma) to make it editable.
 */

export type FieldType = "text" | "slug" | "textarea" | "markdown" | "number" | "boolean" | "list" | "json" | "image" | "images" | "select" | "date";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  rows?: number;
  /** Default JSON/text for new records */
  placeholder?: string;
};

export type Resource = {
  key: string;
  label: string;
  singular: string;
  model: string; // prisma delegate name
  titleField: string;
  listFields: string[];
  orderBy: Record<string, "asc" | "desc">;
  fields: Field[];
  publicPath?: (row: Record<string, unknown>) => string;
};

const I18N_HELP = 'Optional translations, e.g. {"bn": {"title": "…", "shortDesc": "…"}}';

export const resources: Resource[] = [
  {
    key: "services",
    label: "Services",
    singular: "Service",
    model: "service",
    titleField: "title",
    listFields: ["title", "slug", "order", "published"],
    orderBy: { order: "asc" },
    publicPath: (r) => `/services/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "shortDesc", label: "Short description", type: "textarea", required: true, rows: 2 },
      { name: "description", label: "Full description", type: "textarea", required: true, rows: 5 },
      { name: "icon", label: "3D icon", type: "select", options: ["code", "users", "shield", "devices", "cloud", "brain"] },
      { name: "features", label: "Features", type: "list", help: "One per line" },
      { name: "process", label: "Process steps", type: "json", help: 'JSON array: [{"title": "...", "desc": "..."}]', placeholder: "[]" },
      { name: "i18n", label: "Translations", type: "json", help: I18N_HELP, placeholder: "{}" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "products",
    label: "Products",
    singular: "Product",
    model: "product",
    titleField: "name",
    listFields: ["name", "category", "monthlyPrice", "yearlyPrice", "published"],
    orderBy: { order: "asc" },
    publicPath: (r) => `/products/${r.slug}`,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      { name: "features", label: "Features", type: "list", help: "One per line" },
      { name: "screenshots", label: "Screenshots", type: "images" },
      { name: "videoUrl", label: "Demo video embed URL", type: "text", help: "e.g. https://www.youtube.com/embed/VIDEO_ID" },
      { name: "monthlyPrice", label: "Starting monthly price (USD)", type: "number", required: true },
      { name: "yearlyPrice", label: "Starting yearly price (USD)", type: "number", required: true },
      { name: "plans", label: "Pricing plans", type: "json", help: 'JSON: [{"name":"Starter","monthly":49,"yearly":490,"features":["..."]}]', placeholder: "[]" },
      { name: "i18n", label: "Translations", type: "json", help: 'e.g. {"bn": {"tagline": "…"}}', placeholder: "{}" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "projects",
    label: "Portfolio",
    singular: "Case study",
    model: "project",
    titleField: "title",
    listFields: ["title", "client", "category", "featured", "published"],
    orderBy: { order: "asc" },
    publicPath: (r) => `/portfolio/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "client", label: "Client", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["Ecommerce", "Healthcare", "SaaS", "Mobile", "Web"], required: true },
      { name: "year", label: "Year", type: "number" },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 2 },
      { name: "problem", label: "Problem", type: "textarea", required: true, rows: 4 },
      { name: "solution", label: "Solution", type: "textarea", required: true, rows: 4 },
      { name: "tech", label: "Tech used", type: "list", help: "One per line" },
      { name: "results", label: "Results", type: "json", help: 'JSON: [{"label":"Orders","value":"45k"}]', placeholder: "[]" },
      { name: "cover", label: "Cover image", type: "image", required: true },
      { name: "gallery", label: "Gallery", type: "images" },
      { name: "serviceSlugs", label: "Related service slugs", type: "list", help: "One per line, e.g. web-mobile-apps" },
      { name: "featured", label: "Show in home showcase", type: "boolean" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "posts",
    label: "Blog",
    singular: "Post",
    model: "post",
    titleField: "title",
    listFields: ["title", "category", "publishedAt", "featured", "published"],
    orderBy: { publishedAt: "desc" },
    publicPath: (r) => `/blog/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
      { name: "content", label: "Content (Markdown)", type: "markdown", required: true, rows: 18 },
      { name: "cover", label: "Cover image", type: "image", required: true },
      { name: "tags", label: "Tags", type: "list", help: "One per line" },
      { name: "author", label: "Author", type: "text" },
      { name: "publishedAt", label: "Publish date", type: "date" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    model: "testimonial",
    titleField: "name",
    listFields: ["name", "company", "rating", "published"],
    orderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "photo", label: "Photo", type: "image" },
      { name: "companyLogo", label: "Company logo", type: "image" },
      { name: "quote", label: "Quote", type: "textarea", required: true, rows: 4 },
      { name: "rating", label: "Rating (1–5)", type: "number" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "clients",
    label: "Client logos",
    singular: "Client logo",
    model: "clientLogo",
    titleField: "name",
    listFields: ["name", "order"],
    orderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image" },
      { name: "url", label: "Website", type: "text" },
      { name: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "stats",
    label: "Stats",
    singular: "Stat",
    model: "stat",
    titleField: "label",
    listFields: ["label", "value", "suffix", "order"],
    orderBy: { order: "asc" },
    fields: [
      { name: "key", label: "Key", type: "slug", required: true },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Value", type: "number", required: true },
      { name: "suffix", label: "Suffix", type: "text", help: 'e.g. "+" or "%"' },
      { name: "i18n", label: "Translations", type: "json", help: '{"bn": {"label": "…"}}', placeholder: "{}" },
      { name: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "team",
    label: "Team",
    singular: "Team member",
    model: "teamMember",
    titleField: "name",
    listFields: ["name", "role", "order"],
    orderBy: { order: "asc" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "photo", label: "Photo", type: "image" },
      { name: "linkedin", label: "LinkedIn URL", type: "text" },
      { name: "order", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "faqs",
    label: "FAQ",
    singular: "FAQ",
    model: "faq",
    titleField: "question",
    listFields: ["question", "order", "published"],
    orderBy: { order: "asc" },
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 4 },
      { name: "i18n", label: "Translations", type: "json", help: '{"bn": {"question": "…", "answer": "…"}}', placeholder: "{}" },
      { name: "order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "jobs",
    label: "Jobs",
    singular: "Job post",
    model: "job",
    titleField: "title",
    listFields: ["title", "department", "type", "published"],
    orderBy: { postedAt: "desc" },
    publicPath: (r) => `/careers/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "type", label: "Employment type", type: "select", options: ["Full-time", "Part-time", "Contract", "Internship"] },
      { name: "experience", label: "Experience", type: "text" },
      { name: "salary", label: "Salary", type: "text" },
      { name: "summary", label: "Summary", type: "textarea", required: true, rows: 2 },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 5 },
      { name: "responsibilities", label: "Responsibilities", type: "list", help: "One per line" },
      { name: "requirements", label: "Requirements", type: "list", help: "One per line" },
      { name: "validThrough", label: "Apply before", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
];

export const getResource = (key: string) => resources.find((r) => r.key === key);

export const LEAD_STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export const APPLICATION_STATUSES = ["new", "reviewing", "interview", "offer", "hired", "rejected"] as const;
