import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/lib/shop-data";
import { whatsappLink } from "@/lib/whatsapp";
import { useState } from "react";
import { Send } from "lucide-react";

export const Route = createFileRoute("/custom-bouquet")({
  head: () => ({
    meta: [
      { title: "Create Your Bouquet — Petals & Pearls" },
      {
        name: "description",
        content: "Design your dream flower and chocolate bouquet. Tell us your preferences, and we'll arrange it for you.",
      },
    ],
  }),
  component: CustomBouquetPage,
});

function CustomBouquetPage() {
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    recipient: "",
    occasion: "",
    flowers: "",
    chocolates: "",
    budget: "1000-2000",
    colors: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const details = `
🌸 *Custom Bouquet Request* 🌸
---------------------------
👤 *Recipient:* ${formData.recipient || "Not specified"}
🎉 *Occasion:* ${formData.occasion || "Not specified"}
💐 *Flowers:* ${formData.flowers || "Dealer's choice"}
🍫 *Chocolates:* ${formData.chocolates || "Dealer's choice"}
💰 *Budget:* ${formData.budget} INR
🎨 *Colors:* ${formData.colors || "Dealer's choice"}
📝 *Note:* ${formData.message || "No note"}
---------------------------
    `.trim();

    const link = whatsappLink(settings?.whatsapp_number, details);
    window.open(link, "_blank");
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <header className="text-center">
          <span className="gold-rule" />
          <h1 className="mt-4 font-serif text-4xl text-primary">Create Your Bouquet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Dream it, we'll arrange it. Tell us what you love, and we'll create a one-of-a-kind gift.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 grid gap-8 rounded-2xl border border-border/70 bg-card p-6 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Recipient's Name</label>
              <Input
                placeholder="Who is this for?"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Occasion</label>
              <Input
                placeholder="e.g. Birthday, Anniversary"
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Flower Preferences</label>
              <Input
                placeholder="e.g. Red Roses, Lilies, White carnations"
                value={formData.flowers}
                onChange={(e) => setFormData({ ...formData, flowers: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Chocolate Preferences</label>
              <Input
                placeholder="e.g. Ferrero Rocher, Dairy Milk, Dark chocolate"
                value={formData.chocolates}
                onChange={(e) => setFormData({ ...formData, chocolates: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Budget (INR)</label>
              <Select
                value={formData.budget}
                onValueChange={(v) => setFormData({ ...formData, budget: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                  <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                  <SelectItem value="2000-5000">₹2,000 - ₹5,000</SelectItem>
                  <SelectItem value="5000+">₹5,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Color Theme</label>
              <Input
                placeholder="e.g. Pastel pink, Classic Red & Gold"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Special Message / Note</label>
            <Textarea
              placeholder="Any specific message you'd like us to include on the card?"
              className="min-h-[100px]"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button size="lg" className="w-full sm:w-auto sm:mx-auto">
            <Send className="mr-2 size-4" /> Send Request via WhatsApp
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}
