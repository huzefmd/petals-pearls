import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  useProduct,
  useSiteSettings,
  SIZES,
  FLOWER_OPTIONS,
  CHOCOLATE_OPTIONS,
} from "@/lib/shop-data";
import { buildProductOrderMessage, formatINR, openWhatsApp } from "@/lib/whatsapp";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "Bouquet Details — Petals & Pearls" },
      {
        name: "description",
        content: "Customise your flower and chocolate bouquet and order it directly on WhatsApp.",
      },
      { property: "og:title", content: "Bouquet Details — Petals & Pearls" },
      { property: "og:description", content: "Customise size, chocolates, flowers and gift message." },
    ],
  }),
  component: ProductPage,
});

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-rose"
      }`}
    >
      {active && <Check className="mr-1 inline size-3" />}
      {label}
    </button>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: settings } = useSiteSettings();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string>("Medium");
  const [chocolates, setChocolates] = useState<string[]>([]);
  const [flowers, setFlowers] = useState<string[]>([]);
  const [giftMessage, setGiftMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  if (isLoading) {
    return (
      <SiteLayout>
        <p className="py-24 text-center text-sm text-muted-foreground">Loading bouquet…</p>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="py-24 text-center">
          <h1 className="font-serif text-3xl text-primary">Bouquet not found</h1>
          <Button asChild className="mt-6">
            <Link to="/shop">Back to shop</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const images = product.images?.length ? product.images : ["/images/product-1.jpg"];
  const message = buildProductOrderMessage({
    productName: product.name,
    price: Number(product.price) * quantity,
    size,
    chocolates,
    flowers,
    giftMessage,
    quantity,
  });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-xl border border-border/70">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`size-20 overflow-hidden rounded-md border ${
                      i === activeImage ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.badge && (
              <span className="rounded-full bg-accent px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-primary">
                {product.badge}
              </span>
            )}
            <h1 className="mt-3 font-serif text-4xl text-primary">{product.name}</h1>
            <p className="mt-3 text-2xl text-foreground">{formatINR(Number(product.price))}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-8 space-y-6">
              <Field label="Size">
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <Chip key={s} label={s} active={size === s} onClick={() => setSize(s)} />
                  ))}
                </div>
              </Field>

              <Field label="Chocolate selection">
                <div className="flex flex-wrap gap-2">
                  {CHOCOLATE_OPTIONS.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      active={chocolates.includes(c)}
                      onClick={() => toggle(chocolates, setChocolates, c)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Flower selection">
                <div className="flex flex-wrap gap-2">
                  {FLOWER_OPTIONS.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      active={flowers.includes(f)}
                      onClick={() => toggle(flowers, setFlowers, f)}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Personal gift message">
                <Textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Happy birthday, my love…"
                  rows={3}
                />
              </Field>

              <Field label="Quantity">
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28"
                />
              </Field>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => openWhatsApp(settings?.whatsapp_number, message)}>
                <MessageCircle className="mr-2 size-4" /> Order on WhatsApp
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/custom-bouquet">Request Customization</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
