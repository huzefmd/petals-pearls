import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useGallery } from "@/lib/shop-data";

type GalleryItem = {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
  occasion: string | null;
};

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Petals & Pearls Handmade Bouquets" },
      {
        name: "description",
        content: "A gallery of handmade flower and chocolate bouquets created for real celebrations.",
      },
      { property: "og:title", content: "Gallery — Petals & Pearls" },
      { property: "og:description", content: "Real bouquets from our studio." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data = [] } = useGallery();
  const items = data as GalleryItem[];
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const filters = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))],
    [items],
  );
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <header className="text-center">
          <span className="gold-rule" />
          <h1 className="mt-4 font-serif text-4xl text-primary">Gallery</h1>
          <p className="mt-2 text-sm text-muted-foreground">Every piece handmade in our studio.</p>
        </header>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-rose"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
          {visible.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className="block w-full overflow-hidden rounded-lg border border-border/70"
            >
              <img
                src={item.image_url}
                alt={item.title ?? "Bouquet"}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            aria-label="Close preview"
            className="absolute right-5 top-5 text-background"
            onClick={() => setActive(null)}
          >
            <X className="size-7" />
          </button>
          <figure className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img src={active.image_url} alt={active.title ?? "Bouquet"} className="max-h-[80vh] rounded-lg" />
            <figcaption className="mt-3 text-center text-sm text-background/90">
              {active.title}
              {active.occasion ? ` · ${active.occasion}` : ""}
            </figcaption>
          </figure>
        </div>
      )}
    </SiteLayout>
  );
}
