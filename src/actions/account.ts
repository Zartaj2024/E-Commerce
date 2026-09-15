"use server";

import { createClient } from "@/lib/supabase/server";
import { getMyOrders, getOrderById } from "@/lib/repositories/orderRepository";
import { getMyCustomOrders } from "@/lib/repositories/customOrderRepository";

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "Unauthorized", profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .eq("id", user.id)
    .single();

  return {
    success: true as const,
    profile: {
      id: user.id,
      email: user.email ?? "",
      fullName: profile?.full_name ?? "",
      role: profile?.role ?? "customer",
      createdAt: profile?.created_at ?? user.created_at,
    },
  };
}

export async function getOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "Unauthorized", orders: [] };
  }

  try {
    const orders = await getMyOrders(user.id);
    return { success: true as const, orders };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch orders",
      orders: [],
    };
  }
}

export async function getOrderDetail(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "Unauthorized", order: null };
  }

  try {
    const order = await getOrderById(orderId, user.id);
    if (!order) {
      return { success: false as const, error: "Order not found", order: null };
    }
    return { success: true as const, order };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch order",
      order: null,
    };
  }
}

export async function getCustomOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "Unauthorized", orders: [] };
  }

  try {
    const orders = await getMyCustomOrders(user.id);
    return { success: true as const, orders };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch custom orders",
      orders: [],
    };
  }
}
