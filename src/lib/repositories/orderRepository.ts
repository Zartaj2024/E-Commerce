import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Order, OrderWithDetails } from "@/lib/domain/order";

export async function insertOrder(
  userId: string,
  input: {
    payment_method: string;
    shipping_address_id: string;
    subtotal: number;
    total: number;
    items: {
      item_type: "catalog" | "custom";
      product_variant_id?: string;
      custom_order_request_id?: string;
      quantity: number;
      unit_price: number;
      line_total: number;
    }[];
  }
): Promise<Order> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      payment_method: input.payment_method,
      shipping_address_id: input.shipping_address_id,
      subtotal: input.subtotal,
      total: input.total,
    })
    .select()
    .single();

  if (orderError) {
    console.error("[orderRepository] insertOrder error:", orderError.message);
    throw new Error("Failed to create order");
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    item_type: item.item_type,
    product_variant_id: item.product_variant_id ?? null,
    custom_order_request_id: item.custom_order_request_id ?? null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.line_total,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("[orderRepository] insertOrderItems error:", itemsError.message);
    throw new Error("Failed to create order items");
  }

  return order as Order;
}

export async function getOrderById(
  orderId: string,
  userId: string
): Promise<OrderWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*),
      addresses(full_name, phone, address_line1, address_line2, city, postal_code)
    `)
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("[orderRepository] getOrderById error:", error.message);
    throw new Error("Failed to fetch order");
  }

  return data as OrderWithDetails;
}

export async function getMyOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[orderRepository] getMyOrders error:", error.message);
    throw new Error("Failed to fetch orders");
  }

  return (data as Order[]) ?? [];
}
