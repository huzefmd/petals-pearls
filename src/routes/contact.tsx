import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Instagram, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/lib/shop-data";
import { whatsappLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Petals & Pearls — WhatsApp, Instagram & Enquiries" },
      {
        name: "description",
        content: "Message Petals & Pearls on WhatsApp or send an enquiry about custom bouquets and delivery.",
      },
      { property: "og:title", content: "Contact Petals & Pearls" },
      { property: "og:description", content: "We reply fastest on WhatsApp." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Please add your name and a message.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      message: form.message,
    });
    setSaving(false);
    if (error) {
      toast.error("Sorry, that didn't send. Please try WhatsApp instead.");
      return;
    }
    toast.success("Thank you! We'll be in touch soon.");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <header className="text-center">
          <span className="gold-rule" />
          <h1 className="mt-4 font-serif text-4xl text-primary">Get in Touch</h1>
          <p className="mt-2 text-sm text-muted-foreground">We reply fastest on WhatsApp.</p>
        </header>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <a
              href={whatsappLink(settings?.whatsapp_number, "Hello Petals & Pearls! 🌸")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-5 transition-colors hover:border-rose"
            >
              <MessageCircle className="size-5 text-rose" />
              <span>
                <span className="block text-sm font-medium">WhatsApp</span>
                <span className="text-sm text-muted-foreground">+91 63649 43266</span>
              </span>
            </a>
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-5 transition-colors hover:border-rose"
              >
                <Instagram className="size-5 text-rose" />
                <span>
                  <span className="block text-sm font-medium">Instagram</span>
                  <span className="text-sm text-muted-foreground">@_.petalsandpearls._</span>
                </span>
              </a>
            )}
            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-5">
              <Mail className="size-5 text-rose" />
              <span>
                <span className="block text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground">{settings?.email}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-5">
              <MapPin className="size-5 text-rose" />
              <span>
                <span className="block text-sm font-medium">Service area</span>
                <span className="text-sm text-muted-foreground">{settings?.service_area}</span>
              </span>
            </div>
            {settings?.business_hours && (
              <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-5">
                <Clock className="size-5 text-rose" />
                <span>
                  <span className="block text-sm font-medium">Hours</span>
                  <span className="text-sm text-muted-foreground">{settings.business_hours}</span>
                </span>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4 rounded-xl border border-border/70 bg-card p-6">
            <h2 className="font-serif text-2xl text-primary">Send an enquiry</h2>
            <Input placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            <Input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <Input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
            <Textarea
              rows={5}
              placeholder="Tell us what you're planning…"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
            />
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
