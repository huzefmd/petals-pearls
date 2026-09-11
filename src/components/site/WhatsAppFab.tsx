import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/shop-data";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  const { data: settings } = useSiteSettings();
  const href = whatsappLink(
    settings?.whatsapp_number,
    "Hello Petals & Pearls! 🌸 I'd like to know more about your bouquets.",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
