import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, useProducts, OCCASIONS } from "@/lib/shop-data";

type ShopSearch = { category?: string; occasion?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search['category'] === "string" ? search['category'] : undefined,
    occasion: typeof search['occasion'] === "string" ? search['occasion'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Bouquets — Petals & Pearls" },
      {
        name: "description",
        content:
          "Browse handmade flower and chocolate bouquets, chocolate arrangements and occasion gift hampers with prices in INR.",
      },
      { property: "og:title", content: "Shop Bouquets — Petals & Pearls" },
      { property: "og:description", content: "Handmade flower and chocolate gifts for every occasion." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const category = search.category ?? "all";
  const occasion = search.occasion ?? "all";

  const filtered = useMemo(() => {
    const catId = categories.find((c) => c.slug === category)?.id;
    let list = products.filter((p) => {
      if (catId && p.category_id !== catId) return false;
      if (occasion !== "all" && !p.occasions?.includes(occasion)) return false;
      if (query && !`${p.name} ${p.description ?? ""}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [products, categories, category, occasion, query, sort]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <header className="text-center">
          <span className="gold-rule" />
          <h1 className="mt-4 font-serif text-4xl text-primary">Shop Bouquets</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Handmade arrangements, ready to gift. Prices in ₹.
          </p>
        </header>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bouquets…"
              className="pl-9"
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) =>
              navigate({ search: (prev) => ({ ...prev, category: v === "all" ? undefined : v }) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={occasion}
            onValueChange={(v) =>
              navigate({ search: (prev) => ({ ...prev, occasion: v === "all" ? undefined : v }) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All occasions</SelectItem>
              {OCCASIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!isLoading && filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No bouquets match that yet — try another filter, or ask us for a custom design.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
