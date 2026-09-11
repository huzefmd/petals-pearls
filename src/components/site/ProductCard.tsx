import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/shop-data";
import { formatINR, whatsappLink, buildProductOrderMessage } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/shop-data";

export function ProductCard({ product }: { product: Product }) {
  const { data: settings } = useSiteSettings();
  const image = product.images?.[0] ?? "/images/product-1.jpg";

  return (
    <article className="group overflow-hidden rounded-lg border border-border/70 bg-card transition-shadow hover:shadow-[0_14px_40px_-24px_var(--wine)]">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden"
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-primary-foreground">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          {product.occasions?.[0] ?? "Gifting"}
        </p>
        <h3 className="font-serif text-lg leading-tight">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-medium text-primary">{formatINR(Number(product.price))}</span>
          <div className="flex items-center gap-3">
            <a
              href={whatsappLink(
                settings?.whatsapp_number,
                buildProductOrderMessage({ productName: product.name, price: Number(product.price) }),
              )}
              target="_blank"
              rel="noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
              className="text-rose transition-colors hover:text-primary"
            >
              <MessageCircle className="size-5" />
            </a>
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="text-xs uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
