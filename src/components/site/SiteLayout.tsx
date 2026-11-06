import { useState, type ReactNode, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Instagram, Mail, MapPin, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/shop-data";
import { WhatsAppFab } from "./WhatsAppFab";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem('demo_admin_session');
    localStorage.removeItem('petals-pearls-cart'); // Wipe the cart storage
    setUser(null);
    navigate({ to: '/' });
  }

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
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="relative p-2 text-foreground hover:text-primary transition-colors" title="My Profile">
                  <User className="size-6" />
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs h-8">
                  <LogOut className="size-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link to="/login">Login</Link>
              </Button>
            )}
            <Link to="/checkout" className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="size-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full px-0 text-[10px] font-bold">
                  {cartCount}
                </Badge>
              )}
            </Link>
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
