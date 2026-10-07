import Link from "next/link";
import { Facebook, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/widgets/NewsletterForm";
import { getDict } from "@/lib/i18n/server";
import { getServices } from "@/lib/content";
import { nav, site } from "@/lib/site";

export async function Footer() {
  const t = getDict();
  const services = await getServices();
  const socials = [
    { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: site.social.facebook, label: "Facebook", Icon: Facebook },
    { href: site.social.github, label: "GitHub", Icon: Github },
  ];
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line/10">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-purple/20 blur-[120px]" />
      <div className="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-5">
          <Link href="/" aria-label="JarvX IT home">
            <Logo />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          <ul className="flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass grid h-10 w-10 place-items-center rounded-full text-muted transition hover:border-purple/60 hover:text-purple"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-fg">{t.footer.quickLinks}</h2>
          <ul className="space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted transition hover:text-purple">
                  {t.nav[n.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-fg">{t.nav.services}</h2>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-muted transition hover:text-purple">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-fg">{t.footer.contact}</h2>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple" />
                <address className="not-italic">{site.address.full}</address>
              </li>
              <li>
                <a href={`tel:${site.phone}`} className="flex gap-3 hover:text-purple">
                  <Phone className="h-4 w-4 shrink-0 text-purple" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-purple">
                  <Mail className="h-4 w-4 shrink-0 text-purple" /> {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-fg">{t.footer.newsletter}</h2>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-line/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-purple">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-purple">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
