"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getAdminStats as getAdminStatsRepo,
  getAllOrders as getAllOrdersRepo,
  getAllProducts as getAllProductsRepo,
  getAllCustomOrders as getAllCustomOrdersRepo,
} from "@/lib/repositories/adminRepository";
import { validateTransition } from "@/lib/services/orderWorkflow";
import { validateCustomTransition } from "@/lib/services/customOrderWorkflow";
import {
  sendOrderStatusEmail,
  sendCustomOrderQuoteEmail,
  sendCustomOrderDeclinedEmail,
} from "@/lib/services/email";
import type { OrderStatus } from "@/lib/domain/order";

export async function getAdminStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  try {
    const stats = await getAdminStatsRepo();
    return { success: true as const, stats };
  } catch {
    return { success: false as const, error: "Failed to fetch stats" };
  }
}

export async function getAllOrders(status?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized", orders: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden", orders: [] };
  }

  try {
    const orders = await getAllOrdersRepo(status);
    return { success: true as const, orders };
  } catch {
    return { success: false as const, error: "Failed to fetch orders", orders: [] };
  }
}

export async function getAllProducts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized", products: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden", products: [] };
  }

  try {
    const products = await getAllProductsRepo();
    return { success: true as const, products };
  } catch {
    return { success: false as const, error: "Failed to fetch products", products: [] };
  }
}

export async function getAllCustomOrders(status?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized", orders: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden", orders: [] };
  }

  try {
    const orders = await getAllCustomOrdersRepo(status);
    return { success: true as const, orders };
  } catch {
    return { success: false as const, error: "Failed to fetch custom orders", orders: [] };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  // Fetch current order to validate transition
  const { data: currentOrder } = await supabase
    .from("orders")
    .select("status, user_id, profiles(email)")
    .eq("id", orderId)
    .single();

  if (!currentOrder) {
    return { success: false as const, error: "Order not found" };
  }

  const validation = validateTransition(currentOrder.status, status);
  if (!validation.valid) {
    return { success: false as const, error: validation.error };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    console.error("[admin] updateOrderStatus error:", error.message);
    return { success: false as const, error: "Failed to update order status" };
  }

  // Send email notification (fire-and-forget)
  const customerEmail = (currentOrder.profiles as { email?: string } | null)
    ?.email;
  if (customerEmail) {
    const statusLabels: Record<string, string> = {
      in_production: "In production",
      quality_check: "Quality check",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    sendOrderStatusEmail({
      to: customerEmail,
      orderId,
      status,
      statusLabel: statusLabels[status] ?? status,
    }).catch((err) => console.error("[admin] Failed to send status email:", err));
  }

  return { success: true as const };
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) {
    console.error("[admin] toggleProductActive error:", error.message);
    return { success: false as const, error: "Failed to update product" };
  }

  return { success: true as const };
}

export async function quoteCustomOrder(
  requestId: string,
  price: number,
  adminNotes?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  // Fetch current custom order to validate transition
  const { data: currentOrder } = await supabase
    .from("custom_order_requests")
    .select("status, user_id, profiles(email)")
    .eq("id", requestId)
    .single();

  if (!currentOrder) {
    return { success: false as const, error: "Custom order not found" };
  }

  const validation = validateCustomTransition(currentOrder.status, "quoted");
  if (!validation.valid) {
    return { success: false as const, error: validation.error };
  }

  const { error } = await supabase
    .from("custom_order_requests")
    .update({
      status: "quoted",
      quoted_price: price,
      admin_notes: adminNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    console.error("[admin] quoteCustomOrder error:", error.message);
    return { success: false as const, error: "Failed to quote custom order" };
  }

  // Send email notification (fire-and-forget)
  const customerEmail = (currentOrder.profiles as { email?: string } | null)
    ?.email;
  if (customerEmail) {
    sendCustomOrderQuoteEmail({
      to: customerEmail,
      requestId,
      price,
      adminNotes,
    }).catch((err) => console.error("[admin] Failed to send quote email:", err));
  }

  return { success: true as const };
}

export async function declineCustomOrder(requestId: string, reason?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  // Fetch current custom order to validate transition
  const { data: currentOrder } = await supabase
    .from("custom_order_requests")
    .select("status, user_id, profiles(email)")
    .eq("id", requestId)
    .single();

  if (!currentOrder) {
    return { success: false as const, error: "Custom order not found" };
  }

  const validation = validateCustomTransition(currentOrder.status, "declined");
  if (!validation.valid) {
    return { success: false as const, error: validation.error };
  }

  const { error } = await supabase
    .from("custom_order_requests")
    .update({
      status: "declined",
      admin_notes: reason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    console.error("[admin] declineCustomOrder error:", error.message);
    return { success: false as const, error: "Failed to decline custom order" };
  }

  // Send email notification (fire-and-forget)
  const customerEmail = (currentOrder.profiles as { email?: string } | null)
    ?.email;
  if (customerEmail) {
    sendCustomOrderDeclinedEmail({
      to: customerEmail,
      requestId,
      reason,
    }).catch((err) => console.error("[admin] Failed to send decline email:", err));
  }

  return { success: true as const };
}

export async function getProductForEdit(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized", product: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden", product: null };
  }

  const { getProductById } = await import("@/lib/repositories/productRepository");
  const product = await getProductById(productId);
  if (!product) {
    return { success: false as const, error: "Product not found", product: null };
  }

  return { success: true as const, product };
}

export async function updateProductAction(
  productId: string,
  input: {
    name: string;
    slug: string;
    description?: string;
    category: string;
    base_price: number;
    is_active: boolean;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  const { updateProduct: updateProductRepo } = await import(
    "@/lib/repositories/productRepository"
  );

  try {
    const product = await updateProductRepo(productId, input);
    return { success: true as const, product };
  } catch {
    return { success: false as const, error: "Failed to update product" };
  }
}

export async function saveProductVariants(
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
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  const { upsertVariants } = await import(
    "@/lib/repositories/productRepository"
  );

  try {
    await upsertVariants(productId, variants);
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to save variants" };
  }
}

export async function saveProductImages(
  productId: string,
  images: {
    id?: string;
    url: string;
    alt_text: string;
    sort_order: number;
  }[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  const { upsertImages } = await import(
    "@/lib/repositories/productRepository"
  );

  try {
    await upsertImages(productId, images);
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to save images" };
  }
}

export async function deleteProductImage(imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  const { deleteImage } = await import(
    "@/lib/repositories/productRepository"
  );

  try {
    await deleteImage(imageId);
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to delete image" };
  }
}

export async function deleteProductVariant(variantId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden" };
  }

  const { deleteVariant } = await import(
    "@/lib/repositories/productRepository"
  );

  try {
    await deleteVariant(variantId);
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to delete variant" };
  }
}

export async function uploadProductImage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false as const, error: "Unauthorized", url: "" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false as const, error: "Forbidden", url: "" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false as const, error: "No file provided", url: "" };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error("[admin] uploadProductImage error:", error.message);
    return { success: false as const, error: "Upload failed", url: "" };
  }

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);

  return { success: true as const, url: urlData.publicUrl };
}
