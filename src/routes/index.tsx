import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Gift, HandHeart, Instagram, Star, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import {
  useCategories,
  useGallery,
  useProducts,
  useReviews,
  useSiteSettings,
  OCCASIONS,
} from "@/lib/shop-data";
import { whatsappLink } from "@/lib/whatsapp";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-bouquet.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Petals & Pearls — Flowers Meet Chocolate | Handmade Gift Bouquets" },
      {
        name: "description",
        content:
          "Handmade flower and chocolate bouquets for birthdays, anniversaries and every sweet occasion. Order on WhatsApp.",
      },
      { property: "og:title", content: "Petals & Pearls — Flowers Meet Chocolate" },
      {
        property: "og:description",
        content: "Beautiful blooms, delicious surprises, thoughtfully arranged.",
      },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: HandHeart, title: "Handcrafted", text: "Every bouquet is arranged by hand, never mass produced." },
  { icon: Sparkles, title: "Sweet & Beautiful", text: "Fresh blooms paired with chocolates you actually love." },
  { icon: Gift, title: "Personalized", text: "Your colours, your chocolates, your handwritten note." },
  { icon: Heart, title: "Made With Love", text: "Small-batch gifting from our studio to your moment." },
];

function HomePage() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: gallery = [] } = useGallery();
  const { data: reviews = [] } = useReviews();
  const { data: settings } = useSiteSettings();

  const heroImages = [heroImage, product1, product2, product3];
  const bestSellers = products.filter((p) => p.is_best_seller).slice(0, 6);
  const orderLink = whatsappLink(
    settings?.whatsapp_number,
    "Hello Petals & Pearls! 🌸 I'd like to order a bouquet.",
  );


  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/30">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-rose">Handmade gifting</span>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-primary sm:text-5xl md:text-6xl">
              Flowers Meet <span className="script-accent">Chocolate</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Beautiful blooms, delicious surprises, thoughtfully arranged.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">Shop Bouquets</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/custom-bouquet">Create Your Bouquet</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Fresh flowers · Handpicked chocolates · Same-day WhatsApp orders
            </p>
          </div>
          <div className="relative">
            <div
              ref={emblaRef}
              className="overflow-hidden rounded-[2rem] border border-border/70"
            >
              <div className="flex">
                {heroImages.map((src, index) => (
                  <div key={index} className="relative min-w-0 flex-[0_0_100%] aspect-[1408/1200]">
                    <img
                      src={src}
                      alt={`Petals & Pearls bouquet ${index + 1}`}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section title="Featured Categories" subtitle="Find the gift that fits the moment">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.slug } as never}
              className="group overflow-hidden rounded-lg border border-border/70 bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.image_url ?? "/images/product-1.jpg"}
                  alt={c.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Best sellers */}
      <Section title="Best Sellers" subtitle="Loved again and again">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/shop">
              View all bouquets <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Why */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Heading title="Why Petals & Pearls" subtitle="Small studio, big attention to detail" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-lg border border-border/70 bg-card p-6 text-center">
                <f.icon className="mx-auto size-7 text-rose" />
                <h3 className="mt-4 font-serif text-lg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <Section title="Shop by Occasion" subtitle="Every reason deserves flowers and chocolate">
        <div className="flex flex-wrap justify-center gap-3">
          {OCCASIONS.map((o) => (
            <Link
              key={o}
              to="/shop"
              search={{ occasion: o } as never}
              className="rounded-full border border-border bg-card px-5 py-2 text-sm tracking-wide transition-colors hover:border-rose hover:text-primary"
            >
              {o}
            </Link>
          ))}
        </div>
      </Section>

      {/* Custom CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 rounded-2xl border border-border/70 bg-accent/40 p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-serif text-3xl text-primary">Dream it, we'll arrange it</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pick your flowers, your chocolates, your colours and your budget. We'll design a one-of-a-kind
              bouquet just for your moment.
            </p>
            <Button asChild className="mt-6">
              <Link to="/custom-bouquet">Create Your Bouquet</Link>
            </Button>
          </div>
          <img
            src="/images/product-6.jpg"
            alt="Custom pearl and rose bouquet"
            loading="lazy"
            className="rounded-xl object-cover"
          />
        </div>
      </section>

      {/* Gallery preview */}
      <Section title="From Our Studio" subtitle="A peek at recent arrangements">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.slice(0, 8).map((g: { id: string; image_url: string; title: string | null }) => (
            <img
              key={g.id}
              src={g.image_url}
              alt={g.title ?? "Petals & Pearls arrangement"}
              loading="lazy"
              className="aspect-square rounded-lg object-cover"
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/gallery">View Full Gallery</Link>
          </Button>
        </div>
      </Section>

      {/* Instagram */}
      <section className="mx-auto max-w-6xl px-4 pb-4 text-center sm:px-6">
        <a
          href={settings?.instagram_url ?? "https://www.instagram.com/_.petalsandpearls._"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary"
        >
          <Instagram className="size-4" /> Follow @_.petalsandpearls._
        </a>
      </section>

      {/* Reviews */}
      <Section title="Kind Words" subtitle="From people who gifted with us">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map(
            (r: {
              id: string;
              customer_name: string;
              location: string | null;
              rating: number;
              message: string;
            }) => (
              <div key={r.id} className="rounded-lg border border-border/70 bg-card p-6">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">“{r.message}”</p>
                <p className="mt-4 text-sm font-medium">
                  {r.customer_name}
                  {r.location ? <span className="text-muted-foreground"> · {r.location}</span> : null}
                </p>
              </div>
            ),
          )}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="mt-16 bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-3xl sm:text-4xl">Ready to make someone's day?</h2>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Message us on WhatsApp and we'll help you pick the perfect bouquet.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-7">
            <a href={orderLink} target="_blank" rel="noreferrer">
              Order on WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <span className="gold-rule" />
      <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Heading title={title} subtitle={subtitle} />
      <div className="mt-10">{children}</div>
    </section>
  );
}
