export const FALLBACK_WHATSAPP = "916364943266";

export function normalizeNumber(raw?: string | null) {
  const digits = (raw ?? FALLBACK_WHATSAPP).replace(/\D/g, "");
  if (!digits) return FALLBACK_WHATSAPP;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function whatsappLink(number: string | null | undefined, message: string) {
  return `https://wa.me/${normalizeNumber(number)}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(number: string | null | undefined, message: string) {
  if (typeof window !== "undefined") {
    window.open(whatsappLink(number, message), "_blank", "noopener,noreferrer");
  }
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

type OrderDetails = {
  productName: string;
  price?: number;
  size?: string;
  chocolates?: string[];
  flowers?: string[];
  giftMessage?: string;
  quantity?: number;
};

export function buildProductOrderMessage(d: OrderDetails) {
  const lines = [
    "Hello Petals & Pearls! 🌸",
    "",
    "I'd like to place an order:",
    `• Product: ${d.productName}`,
  ];
  if (d.price) lines.push(`• Price: ${formatINR(d.price)}`);
  if (d.size) lines.push(`• Size: ${d.size}`);
  if (d.quantity) lines.push(`• Quantity: ${d.quantity}`);
  if (d.flowers?.length) lines.push(`• Flowers: ${d.flowers.join(", ")}`);
  if (d.chocolates?.length) lines.push(`• Chocolates: ${d.chocolates.join(", ")}`);
  if (d.giftMessage) lines.push(`• Gift message: "${d.giftMessage}"`);
  lines.push("", "Could you please confirm availability and delivery? Thank you!");
  return lines.join("\n");
}

type CustomDetails = {
  name?: string;
  phone?: string;
  occasion?: string;
  flowers?: string[];
  chocolates?: string[];
  budget?: string;
  colors?: string[];
  giftMessage?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  notes?: string;
};

export function buildCustomOrderMessage(d: CustomDetails) {
  const lines = ["Hello Petals & Pearls! 🌸", "", "I'd like a custom bouquet:"];
  if (d.occasion) lines.push(`• Occasion: ${d.occasion}`);
  if (d.flowers?.length) lines.push(`• Flowers: ${d.flowers.join(", ")}`);
  if (d.chocolates?.length) lines.push(`• Chocolates: ${d.chocolates.join(", ")}`);
  if (d.budget) lines.push(`• Budget: ${d.budget}`);
  if (d.colors?.length) lines.push(`• Colours: ${d.colors.join(", ")}`);
  if (d.giftMessage) lines.push(`• Gift message: "${d.giftMessage}"`);
  if (d.deliveryDate) lines.push(`• Delivery date: ${d.deliveryDate}`);
  if (d.deliveryAddress) lines.push(`• Delivery to: ${d.deliveryAddress}`);
  if (d.notes) lines.push(`• Notes: ${d.notes}`);
  lines.push("");
  if (d.name) lines.push(`Name: ${d.name}`);
  if (d.phone) lines.push(`Phone: ${d.phone}`);
  lines.push("", "Looking forward to your suggestions!");
  return lines.join("\n");
}
