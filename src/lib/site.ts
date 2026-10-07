export const site = {
  name: "JarvX IT",
  legalName: "JarvX IT",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  description:
    "JarvX IT is a custom software company in Dhaka, Bangladesh delivering software development, web & mobile apps, QA, DevOps, resource augmentation and AI solutions for businesses worldwide.",
  phone: "+8801332775533",
  phoneDisplay: "+880 1332-775533",
  email: "info@jarvxit.com",
  address: {
    street: "11 No Sector, Road 14, Uttara",
    city: "Dhaka",
    postalCode: "1230",
    country: "Bangladesh",
    full: "11 No Sector, Road 14, Uttara, Dhaka 1230, Bangladesh",
  },
  geo: { lat: 23.8759, lng: 90.3795 },
  social: {
    linkedin: "https://www.linkedin.com/company/jarvxit",
    facebook: "https://www.facebook.com/jarvxit",
    github: "https://github.com/jarvxit",
  },
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "8801332775533",
  messenger: process.env.NEXT_PUBLIC_MESSENGER_PAGE || "jarvxit",
  usdToBdt: 122,
};

export const nav = [
  { href: "/services", key: "services" },
  { href: "/products", key: "products" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" },
  { href: "/careers", key: "careers" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;
