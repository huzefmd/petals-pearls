import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/shop-data";
import { WhatsAppFab } from "./WhatsAppFab";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/custom-bouquet", label: "Custom Bouquet" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function Wordmark() {
  return (
    <Link to="/" className="flex flex-col leading-none">
      <span className="font-serif text-xl tracking-wide text-primary sm:text-2xl">
        Petals <span className="text-rose">&</span> Pearls
      </span>
      <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
        Flowers meet chocolate
      </span>
    </Link>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <Wordmark />
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/shop">Shop Bouquets</Link>
            </Button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-2 text-foreground lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/50 py-3 text-sm tracking-wide last:border-none"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Handmade bouquets where fresh flowers meet handpicked chocolates — arranged one gift at a
              time.
            </p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary">Say hello</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-rose" /> +91 63649 43266
              </li>
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-rose" /> {settings.email}
                </li>
              )}
              {settings?.service_area && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-rose" /> {settings.service_area}
                </li>
              )}
              {settings?.instagram_url && (
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-primary"
                  >
                    <Instagram className="size-4 text-rose" /> Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Petals & Pearls · Handmade with love
        </div>
      </footer>

      <WhatsAppFab />
    </div>
  );
}
