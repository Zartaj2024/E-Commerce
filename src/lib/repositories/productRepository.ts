import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Product,
  ProductWithDetails,
  ProductFilters,
  PaginatedProducts,
} from "@/lib/domain/product";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  const supabase = await createClient();
  const { category, page = 1, pageSize = 12 } = filters;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("[productRepository] getProducts error:", error.message);
    throw new Error("Failed to fetch products");
  }

  return {
    products: (data as Product[]) ?? [],
    total: count ?? 0,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images(*),
      product_variants(*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("[productRepository] getProductBySlug error:", error.message);
    throw new Error("Failed to fetch product");
  }

  const product = data as ProductWithDetails;

  if (product.product_images) {
    product.product_images.sort((a, b) => a.sort_order - b.sort_order);
  }

  return product;
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true);

  if (error) {
    console.error("[productRepository] getCategories error:", error.message);
    throw new Error("Failed to fetch categories");
  }

  interface CategoryRow {
    category: string;
  }
  const rows = (data ?? []) as CategoryRow[];
  const categories = [...new Set(rows.map((row) => row.category))].sort();
  return categories;
}

export async function getProductById(
  productId: string
): Promise<ProductWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images(*),
      product_variants(*)
    `)
    .eq("id", productId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("[productRepository] getProductById error:", error.message);
    throw new Error("Failed to fetch product");
  }

  const product = data as ProductWithDetails;
  if (product.product_images) {
    product.product_images.sort((a, b) => a.sort_order - b.sort_order);
  }
  return product;
}

export async function updateProduct(
  productId: string,
  input: {
    name: string;
    slug: string;
    description?: string;
    category: string;
    base_price: number;
    is_active: boolean;
  }
): Promise<Product> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      category: input.category,
      base_price: input.base_price,
      is_active: input.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    console.error("[productRepository] updateProduct error:", error.message);
    throw new Error("Failed to update product");
  }

  return data as Product;
}

export async function upsertVariants(
  productId: string,
  variants: {
    id?: string;
    fabric?: string;
    color?: string;
    size?: string;
    price_modifier: number;
    stock_quantity: number;
    sku?: string;
  }[]
): Promise<void> {
  const supabase = await createClient();

  // Delete existing variants not in the list
  const existingIds = variants.filter((v) => v.id).map((v) => v.id!);
  if (existingIds.length > 0) {
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId)
      .not("id", "in", `(${existingIds.join(",")})`);
  } else {
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId);
  }

  // Upsert each variant
  for (const variant of variants) {
    const row = {
      product_id: productId,
      fabric: variant.fabric || null,
      color: variant.color || null,
      size: variant.size || null,
      price_modifier: variant.price_modifier,
      stock_quantity: variant.stock_quantity,
      sku: variant.sku || null,
    };

    if (variant.id) {
      await supabase
        .from("product_variants")
        .update(row)
        .eq("id", variant.id);
    } else {
      await supabase.from("product_variants").insert(row);
    }
  }
}

export async function upsertImages(
  productId: string,
  images: {
    id?: string;
    url: string;
    alt_text: string;
    sort_order: number;
  }[]
): Promise<void> {
  const supabase = await createClient();

  // Delete existing images not in the list
  const existingIds = images.filter((i) => i.id).map((i) => i.id!);
  if (existingIds.length > 0) {
    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId)
      .not("id", "in", `(${existingIds.join(",")})`);
  } else {
    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);
  }

  // Upsert each image
  for (const image of images) {
    const row = {
      product_id: productId,
      url: image.url,
      alt_text: image.alt_text,
      sort_order: image.sort_order,
    };

    if (image.id) {
      await supabase.from("product_images").update(row).eq("id", image.id);
    } else {
      await supabase.from("product_images").insert(row);
    }
  }
}

export async function deleteImage(imageId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("[productRepository] deleteImage error:", error.message);
    throw new Error("Failed to delete image");
  }
}

export async function deleteVariant(variantId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId);

  if (error) {
    console.error("[productRepository] deleteVariant error:", error.message);
    throw new Error("Failed to delete variant");
  }
}
