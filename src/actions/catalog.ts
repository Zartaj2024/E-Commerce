"use server";

import {
  getProducts as getProductsRepo,
  getProductBySlug as getProductBySlugRepo,
  getCategories as getCategoriesRepo,
} from "@/lib/repositories/productRepository";
import {
  ProductFilterSchema,
  ProductSlugSchema,
} from "@/lib/validation/productSchema";
import type { ProductFilters } from "@/lib/domain/product";

export async function getProducts(filters: ProductFilters = {}) {
  const parsed = ProductFilterSchema.safeParse(filters);

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Invalid filters",
      products: [],
      total: 0,
    };
  }

  try {
    const result = await getProductsRepo(parsed.data);
    return {
      success: true as const,
      products: result.products,
      total: result.total,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch products",
      products: [],
      total: 0,
    };
  }
}

export async function getProductBySlug(slug: string) {
  const parsed = ProductSlugSchema.safeParse({ slug });

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Invalid product slug",
      product: null,
    };
  }

  try {
    const product = await getProductBySlugRepo(parsed.data.slug);
    return {
      success: true as const,
      product,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch product",
      product: null,
    };
  }
}

export async function getCategories() {
  try {
    const categories = await getCategoriesRepo();
    return {
      success: true as const,
      categories,
    };
  } catch {
    return {
      success: false as const,
      categories: [],
    };
  }
}
