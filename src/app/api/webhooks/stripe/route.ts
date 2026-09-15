import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook secret (placeholder — configure STRIPE_WEBHOOK_SECRET)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ received: true });
  }

  // In production, verify the signature with stripe.webhooks.constructEvent()
  // For now, parse the event directly
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data?.object;
      const orderId = session?.metadata?.order_id;

      if (orderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        console.log(`[stripe-webhook] Order ${orderId} marked as paid`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data?.object;
      const orderId = paymentIntent?.metadata?.order_id;

      if (orderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        console.log(`[stripe-webhook] Order ${orderId} payment failed`);
      }
      break;
    }

    default:
      console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
