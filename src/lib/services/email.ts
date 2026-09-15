import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Suti & Thread <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface EmailResult {
  success: boolean;
  error?: string;
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("[email] sendEmail error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[email] sendEmail exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: string;
  total: number;
}): Promise<EmailResult> {
  const orderNumber = params.orderId.slice(0, 8).toUpperCase();
  const totalFormatted = `Rs. ${params.total.toLocaleString("en-PK")}`;

  return sendEmail({
    to: params.to,
    subject: `Order confirmed — ${orderNumber}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #2B211C; margin-bottom: 8px;">Order confirmed</h1>
        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          Thank you for your order. We've received it and will start working on it soon.
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #4A4038;">Order number</p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #2B211C;">${orderNumber}</p>
          <p style="margin: 16px 0 0 0; font-size: 14px; color: #4A4038;">Total: <strong style="color: #7A2331;">${totalFormatted}</strong></p>
        </div>

        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          You can track your order status in your account.
        </p>

        <a href="${SITE_URL}/account/orders" style="display: inline-block; background-color: #7A2331; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-top: 16px;">
          View my orders
        </a>

        <p style="margin-top: 32px; color: #999; font-size: 12px;">
          — Suti & Thread
        </p>
      </div>
    `,
  });
}

export async function sendOrderStatusEmail(params: {
  to: string;
  orderId: string;
  status: string;
  statusLabel: string;
}): Promise<EmailResult> {
  const orderNumber = params.orderId.slice(0, 8).toUpperCase();

  const statusMessages: Record<string, string> = {
    in_production:
      "We've started working on your order. It's being carefully handcrafted.",
    quality_check:
      "Your order is undergoing quality inspection before shipping.",
    shipped: "Great news! Your order has been shipped and is on its way to you.",
    delivered:
      "Your order has been delivered. We hope you love your new piece!",
    cancelled:
      "Your order has been cancelled. If you have any questions, please contact us.",
  };

  const message =
    statusMessages[params.status] ||
    `Your order status has been updated to ${params.statusLabel}.`;

  return sendEmail({
    to: params.to,
    subject: `Order ${params.statusLabel} — ${orderNumber}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #2B211C; margin-bottom: 8px;">Order update</h1>
        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          ${message}
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #4A4038;">Order number</p>
          <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 600; color: #2B211C;">${orderNumber}</p>
          <p style="margin: 16px 0 0 0; font-size: 14px; color: #4A4038;">Status: <strong style="color: #0F5C57;">${params.statusLabel}</strong></p>
        </div>

        <a href="${SITE_URL}/account/orders" style="display: inline-block; background-color: #7A2331; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-top: 16px;">
          Track your order
        </a>

        <p style="margin-top: 32px; color: #999; font-size: 12px;">
          — Suti & Thread
        </p>
      </div>
    `,
  });
}

export async function sendCustomOrderQuoteEmail(params: {
  to: string;
  requestId: string;
  price: number;
  adminNotes?: string;
}): Promise<EmailResult> {
  const priceFormatted = `Rs. ${params.price.toLocaleString("en-PK")}`;

  return sendEmail({
    to: params.to,
    subject: `Your custom order has been quoted`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #2B211C; margin-bottom: 8px;">Your quote is ready</h1>
        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          We've reviewed your custom embroidery request and here's our quote.
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #4A4038;">Quoted price</p>
          <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 600; color: #7A2331;">${priceFormatted}</p>
          ${params.adminNotes ? `<p style="margin: 16px 0 0 0; font-size: 14px; color: #4A4038; font-style: italic;">"${params.adminNotes}"</p>` : ""}
        </div>

        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          To accept this quote, add the custom order to your cart and complete checkout.
        </p>

        <a href="${SITE_URL}/account" style="display: inline-block; background-color: #7A2331; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-top: 16px;">
          View my custom orders
        </a>

        <p style="margin-top: 32px; color: #999; font-size: 12px;">
          — Suti & Thread
        </p>
      </div>
    `,
  });
}

export async function sendCustomOrderDeclinedEmail(params: {
  to: string;
  requestId: string;
  reason?: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: params.to,
    subject: `Update on your custom order request`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #2B211C; margin-bottom: 8px;">Custom order update</h1>
        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          Unfortunately, we're unable to take on this particular custom order at this time.
        </p>

        ${params.reason ? `<p style="color: #4A4038; font-size: 14px; line-height: 1.6; margin-top: 16px;">Reason: ${params.reason}</p>` : ""}

        <p style="color: #4A4038; font-size: 14px; line-height: 1.6; margin-top: 16px;">
          Feel free to submit a new request with a different design. We're always happy to help bring your embroidery ideas to life.
        </p>

        <a href="${SITE_URL}/custom-order" style="display: inline-block; background-color: #7A2331; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-top: 16px;">
          Submit a new request
        </a>

        <p style="margin-top: 32px; color: #999; font-size: 12px;">
          — Suti & Thread
        </p>
      </div>
    `,
  });
}

export async function sendCustomOrderAdminNotification(params: {
  adminEmail: string;
  customerName: string;
  fabric: string;
  sizePlacement: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: params.adminEmail,
    subject: `New custom order request from ${params.customerName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; color: #2B211C; margin-bottom: 8px;">New custom order</h1>
        <p style="color: #4A4038; font-size: 14px; line-height: 1.6;">
          A new custom embroidery request has been submitted.
        </p>

        <div style="border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #4A4038;">Customer</p>
          <p style="margin: 4px 0 12px 0; font-size: 16px; font-weight: 600; color: #2B211C;">${params.customerName}</p>
          <p style="margin: 0; font-size: 14px; color: #4A4038;">Fabric</p>
          <p style="margin: 4px 0 12px 0; font-size: 14px; color: #2B211C;">${params.fabric}</p>
          <p style="margin: 0; font-size: 14px; color: #4A4038;">Placement</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #2B211C;">${params.sizePlacement}</p>
        </div>

        <a href="${SITE_URL}/admin/custom-orders" style="display: inline-block; background-color: #7A2331; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-top: 16px;">
          Review request
        </a>

        <p style="margin-top: 32px; color: #999; font-size: 12px;">
          — Suti & Thread
        </p>
      </div>
    `,
  });
}
