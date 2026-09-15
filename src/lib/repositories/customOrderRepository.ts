import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CustomOrderRequest } from "@/lib/domain/customOrder";

export async function insertCustomOrder(
  userId: string,
  input: {
    reference_image_url: string;
    image_alt_text: string;
    fabric: string;
    thread_colors: string[];
    size_placement: string;
    notes?: string;
  }
): Promise<CustomOrderRequest> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("custom_order_requests")
    .insert({
      user_id: userId,
      reference_image_url: input.reference_image_url,
      image_alt_text: input.image_alt_text,
      fabric: input.fabric,
      thread_colors: input.thread_colors,
      size_placement: input.size_placement,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[customOrderRepository] insertCustomOrder error:", error.message);
    throw new Error("Failed to submit custom order");
  }

  return data as CustomOrderRequest;
}

export async function getMyCustomOrders(
  userId: string
): Promise<CustomOrderRequest[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("custom_order_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[customOrderRepository] getMyCustomOrders error:", error.message);
    throw new Error("Failed to fetch custom orders");
  }

  return (data as CustomOrderRequest[]) ?? [];
}
