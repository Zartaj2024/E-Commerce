import { Metadata } from "next";
import { CustomOrderForm } from "@/components/custom-order/CustomOrderForm";

export const metadata: Metadata = {
  title: "Custom Order — Suti & Thread",
  description:
    "Submit a custom embroidery order. Choose your fabric, thread colors, and placement.",
};

export default function CustomOrderPage() {
  return (
    <section className="px-6 py-16 md:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-3xl text-ink md:text-4xl">
          Custom embroidery
        </h1>
        <p className="mt-3 font-body text-base text-charcoal">
          Upload your reference design, pick your fabric and thread, and
          we&apos;ll bring it to life.
        </p>
      </div>

      <CustomOrderForm />
    </section>
  );
}
