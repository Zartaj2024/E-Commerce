import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Suti & Thread",
  description:
    "Hand-embroidered products and custom commissions. Every stitch tells a story.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-4xl text-ink">About us</h1>

      <div className="space-y-8 font-body text-charcoal leading-relaxed">
        <p>
          Suti & Thread is a studio dedicated to the art of hand embroidery. We
          create products that carry the warmth of human touch — each piece
          stitched with care, patience, and attention to detail.
        </p>

        <p>
          In a world of mass production, we believe there is profound value in
          things made slowly. Our embroidery is done entirely by hand, using
          techniques passed down through generations. No machines, no shortcuts
          — just needle, thread, and the steady hand of an artisan.
        </p>

        <div className="border-l-2 border-mahogany py-2 pl-6">
          <p className="font-display text-xl italic text-ink">
            &quot;The stitch is the motif. Every thread carries intention.&quot;
          </p>
        </div>

        <h2 className="font-display text-2xl text-ink">What we make</h2>

        <ul className="list-disc pl-5">
          <li>
            <strong className="text-ink">Ready-to-ship products</strong> —
            curated pieces available in our collection, each one unique.
          </li>
          <li>
            <strong className="text-ink">Custom commissions</strong> — share
            your vision, choose your fabric and thread colors, and we&apos;ll
            bring it to life. From reference image to finished piece.
          </li>
        </ul>

        <h2 className="font-display text-2xl text-ink">Our materials</h2>

        <p>
          We work with natural fabrics — cotton, linen, and muslin — and use
          high-quality embroidery threads in a wide palette of colors. Every
          material is chosen for its feel, durability, and how it holds the
          stitch over time.
        </p>

        <h2 className="font-display text-2xl text-ink">Custom orders</h2>

        <p>
          Have a design in mind? Our custom order process lets you collaborate
          directly with our artisans. Upload a reference image, pick your fabric,
          choose thread colors, select sizing and placement, and we&apos;ll
          provide a quote. From there, every piece is made to order — just for
          you.
        </p>

        <div className="rounded-lg border border-charcoal/20 bg-kora p-6 text-center">
          <p className="mb-4 font-display text-lg text-ink">
            Ready to start a custom order?
          </p>
          <a
            href="/custom-order"
            className="inline-block rounded-lg bg-mahogany px-6 py-2.5 font-body text-sm text-kora transition-colors hover:bg-mahogany/90"
          >
            Begin your commission
          </a>
        </div>
      </div>
    </div>
  );
}
