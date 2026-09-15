import { z } from "zod";

export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
});

export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;

export const ProductSlugSchema = z.object({
  slug: z.string().min(1, "Product slug is required"),
});

export type ProductSlugInput = z.infer<typeof ProductSlugSchema>;
