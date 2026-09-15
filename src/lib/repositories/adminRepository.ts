import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/domain/order";
import type { Product } from "@/lib/domain/product";
import type { CustomOrderRequest } from "@/lib/domain/customOrder";

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingCustomOrders: number;
  activeProducts: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [ordersResult, customResult, productsResult] = await Promise.all([
    supabase.from("orders").select("total", { count: "exact" }),
    supabase
      .from("custom_order_requests")
      .select("id", { count: "exact" })
      .eq("status", "pending_review"),
    supabase
      .from("products")
      .select("id", { count: "exact" })
      .eq("is_active", true),
  ]);

  const totalOrders = ordersResult.count ?? 0;
  const totalRevenue =
    ordersResult.data?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;
  const pendingCustomOrders = customResult.count ?? 0;
  const activeProducts = productsResult.count ?? 0;

  return { totalOrders, totalRevenue, pendingCustomOrders, activeProducts };
}

export async function getAllOrders(status?: string): Promise<Order[]> {
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[adminRepository] getAllOrders error:", error.message);
    throw new Error("Failed to fetch orders");
  }

  return (data as unknown as Order[]) ?? [];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(stock_quantity)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[adminRepository] getAllProducts error:", error.message);
    throw new Error("Failed to fetch products");
  }

  return (data as unknown as Product[]) ?? [];
}

export async function getAllCustomOrders(
  status?: string
): Promise<CustomOrderRequest[]> {
  const supabase = await createClient();

  let query = supabase
    .from("custom_order_requests")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[adminRepository] getAllCustomOrders error:", error.message);
    throw new Error("Failed to fetch custom orders");
  }

  return (data as unknown as CustomOrderRequest[]) ?? [];
}
