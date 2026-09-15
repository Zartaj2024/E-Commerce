"use server";

import { createClient } from "@/lib/supabase/server";
import { insertOrder } from "@/lib/repositories/orderRepository";
import { CheckoutSchema } from "@/lib/validation/checkoutSchema";
import { calculateSubtotal, calculateShipping, calculateTotal } from "@/lib/services/pricing";
import { sendOrderConfirmationEmail } from "@/lib/services/email";
import type { CheckoutInput } from "@/lib/validation/checkoutSchema";
import type { CartItem } from "@/store/cart";

export async function createOrder(
  input: CheckoutInput,
  cartItems: CartItem[]
) {
  const parsed = CheckoutSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return {
      success: false as const,
      error: firstError,
    };
  }

  if (cartItems.length === 0) {
    return {
      success: false as const,
      error: "Your cart is empty",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "You must be logged in to place an order",
    };
  }

  const subtotal = calculateSubtotal(
    cartItems.map((item) => ({ price: item.price, quantity: item.quantity }))
  );
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, shipping);

  const orderItems = cartItems.map((item) => ({
    item_type: "catalog" as const,
    product_variant_id: item.variantId,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
  }));

  try {
    const order = await insertOrder(user.id, {
      payment_method: parsed.data.paymentMethod,
      shipping_address_id: parsed.data.addressId,
      subtotal,
      total,
      items: orderItems,
    });

    // Send confirmation email (fire-and-forget)
    if (user.email) {
      sendOrderConfirmationEmail({
        to: user.email,
        orderId: order.id,
        total,
      }).catch((err) => console.error("[checkout] Failed to send confirmation email:", err));
    }

    return {
      success: true as const,
      orderId: order.id,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to place order. Please try again.",
    };
  }
}
