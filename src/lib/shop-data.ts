import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Valentine's",
  "Proposal",
  "Graduation",
  "Friendship",
  "Thank You",
  "Just Because",
] as const;

export const FLOWER_OPTIONS = [
  "Red roses",
  "Blush roses",
  "White roses",
  "Lilies",
  "Carnations",
  "Baby's breath",
  "Orchids",
  "Sunflowers",
];

export const CHOCOLATE_OPTIONS = [
  "Ferrero Rocher",
  "Dairy Milk",
  "Kit Kat",
  "Dark chocolate truffles",
  "Handmade pralines",
  "Assorted mini bars",
];

export const COLOR_OPTIONS = [
  "Blush pink",
  "Dusty rose",
  "Deep red",
  "Ivory & white",
  "Champagne gold",
  "Pastel mix",
];

export const SIZES = ["Small", "Medium", "Large"] as const;

export const ORDER_STATUSES = [
  "New",
  "Contacted",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
] as const;

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  occasions: string[];
  images: string[];
  badge: string | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  instagram_url: string | null;
  email: string | null;
  service_area: string | null;
  business_name: string;
  tagline: string;
  about_text: string | null;
  business_hours: string | null;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useReviews(approvedOnly = true) {
  return useQuery({
    queryKey: ["reviews", approvedOnly],
    queryFn: async () => {
      let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (approvedOnly) q = q.eq("is_approved", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}
