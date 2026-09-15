export type CustomOrderStatus =
  | "pending_review"
  | "quoted"
  | "declined"
  | "converted";

export interface CustomOrderRequest {
  id: string;
  user_id: string;
  reference_image_url: string;
  image_alt_text: string;
  fabric: string;
  thread_colors: string[];
  size_placement: string;
  notes: string | null;
  status: CustomOrderStatus;
  quoted_price: number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const FABRIC_OPTIONS = [
  "Khaddar",
  "Cotton",
  "Linen",
  "Chiffon",
  "Organza",
  "Silk",
] as const;

export type FabricOption = (typeof FABRIC_OPTIONS)[number];

export const THREAD_COLORS = [
  { name: "Ivory White", hex: "#FFFFF0" },
  { name: "Marigold", hex: "#EAA221" },
  { name: "Madder Red", hex: "#C93C3C" },
  { name: "Indigo", hex: "#3F51B5" },
  { name: "Emerald", hex: "#2E8B57" },
  { name: "Peacock Teal", hex: "#009B8D" },
  { name: "Dusty Rose", hex: "#D4A5A5" },
  { name: "Terracotta", hex: "#CC5533" },
  { name: "Mustard", hex: "#D4A017" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Plum", hex: "#8E4585" },
  { name: "Sky Blue", hex: "#87CEEB" },
] as const;

export const SIZE_PLACEMENT_OPTIONS = [
  "Dupatta (full)",
  "Shirt Front",
  "Shirt Back",
  "Sleeves",
  "Trousers Hem",
  "Border / Trim",
  "Other",
] as const;

export type SizePlacementOption = (typeof SIZE_PLACEMENT_OPTIONS)[number];
