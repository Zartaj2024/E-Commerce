import { z } from "zod";

export const AdminProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  base_price: z.coerce.number().min(0, "Price must be positive"),
  is_active: z.boolean().default(true),
});

export type AdminProductInput = z.infer<typeof AdminProductSchema>;

export const AdminVariantSchema = z.object({
  id: z.string().uuid().optional(),
  fabric: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  price_modifier: z.coerce.number().default(0),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional(),
});

export type AdminVariantInput = z.infer<typeof AdminVariantSchema>;

export const AdminImageSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url("Invalid image URL"),
  alt_text: z.string().min(1, "Alt text is required"),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type AdminImageInput = z.infer<typeof AdminImageSchema>;
