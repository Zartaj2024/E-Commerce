import { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Suti & Thread",
  description: "Complete your order",
};

export default function CheckoutPage() {
  return (
    <section className="px-6 py-12 md:px-8">
      <h1 className="font-heading text-3xl text-ink">Checkout</h1>
      <CheckoutForm />
    </section>
  );
}
