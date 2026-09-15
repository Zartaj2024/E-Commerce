"use server";

import { createClient } from "@/lib/supabase/server";
import {
  insertCustomOrder as insertCustomOrderRepo,
  getMyCustomOrders as getMyCustomOrdersRepo,
} from "@/lib/repositories/customOrderRepository";
import { CustomOrderSchema } from "@/lib/validation/customOrderSchema";
import { sendCustomOrderAdminNotification } from "@/lib/services/email";
import type { CustomOrderInput } from "@/lib/validation/customOrderSchema";

export async function submitCustomOrder(input: CustomOrderInput) {
  const parsed = CustomOrderSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return {
      success: false as const,
      error: firstError,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "You must be logged in to submit a custom order",
    };
  }

  try {
    const order = await insertCustomOrderRepo(user.id, {
      reference_image_url: parsed.data.referenceImageUrl,
      image_alt_text: parsed.data.imageAltText,
      fabric: parsed.data.fabric,
      thread_colors: parsed.data.threadColors,
      size_placement: parsed.data.sizePlacement,
      notes: parsed.data.notes || undefined,
    });

    // Notify admin about new custom order (fire-and-forget)
    const { data: customerProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (adminProfile && customerProfile) {
      // Fetch admin email from auth (we need to get it from a different approach)
      // For now, we'll use a placeholder - in production, store admin email in env
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        sendCustomOrderAdminNotification({
          adminEmail,
          customerName: customerProfile.full_name || "Customer",
          fabric: parsed.data.fabric,
          sizePlacement: parsed.data.sizePlacement,
        }).catch((err) => console.error("[customOrders] Failed to send admin notification:", err));
      }
    }

    return {
      success: true as const,
      orderId: order.id,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to submit custom order. Please try again.",
    };
  }
}

export async function getMyCustomOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "Unauthorized",
      orders: [],
    };
  }

  try {
    const orders = await getMyCustomOrdersRepo(user.id);
    return {
      success: true as const,
      orders,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch custom orders",
      orders: [],
    };
  }
}
