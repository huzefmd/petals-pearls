import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Gift, HandHeart } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/shop-data";
import aboutImage from "@/assets/about-craft.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Petals & Pearls Handmade Gifting" },
      {
        name: "description",
        content:
          "Petals & Pearls is a small handmade gifting studio pairing fresh flowers with handpicked chocolates.",
      },
      { property: "og:title", content: "Our Story — Petals & Pearls" },
      { property: "og:description", content: "A small studio where flowers meet chocolate." },
    ],
  }),
  component: AboutPage,
});

const POINTS = [
  { icon: HandHeart, title: "Hand-arranged", text: "No factory lines — each bouquet is built by hand." },
  { icon: Sparkles, title: "Premium ingredients", text: "Fresh seasonal blooms and chocolates we'd gift ourselves." },
  { icon: Gift, title: "Made for you", text: "Colours, chocolates and notes chosen by you." },
  { icon: Heart, title: "Genuine care", text: "We treat every order like it's for our own family." },
];

function AboutPage() {
  const { data: settings } = useSiteSettings();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <header className="text-center">
          <span className="gold-rule" />
          <h1 className="mt-4 font-serif text-4xl text-primary">Our Story</h1>
        </header>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <img
            src={aboutImage}
            alt="Hands arranging a flower and chocolate bouquet"
            className="rounded-2xl border border-border/70 object-cover"
          />
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {settings?.about_text ??
                "Petals & Pearls began with a simple idea: the two things people love most in a gift are flowers and chocolate — so why choose?"}
            </p>
            <p>
              Every arrangement is made to order in small batches, wrapped with care and delivered to make
              someone's day noticeably better. From birthdays and anniversaries to proposals and quiet
              thank-yous, we build the gift around your story.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title} className="rounded-lg border border-border/70 bg-card p-6 text-center">
              <p.icon className="mx-auto size-7 text-rose" />
              <h2 className="mt-4 font-serif text-lg">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-accent/40 p-10 text-center">
          <h2 className="font-serif text-3xl text-primary">Let's make something beautiful</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/custom-bouquet">Create Your Bouquet</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
