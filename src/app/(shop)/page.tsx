import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getProducts } from "@/actions/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { RevealSection } from "@/components/ui/RevealSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Suti & Thread — Hand-embroidered pieces and custom commissions",
  description:
    "Hand-embroidered products and custom embroidery commissions. Choose your fabric, thread, and story.",
};

export default async function Home() {
  const result = await getProducts({ page: 1, pageSize: 6 });
  const products = result.success ? result.products : [];

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[100dvh] px-6 pt-24 pb-16 md:px-8 lg:flex lg:items-center lg:gap-12 lg:px-16">
        <div className="flex flex-1 flex-col justify-center lg:max-w-xl">
          <RevealSection>
            <span className="mb-4 inline-block rounded-full border border-mahogany/20 px-3 py-1 font-body text-[10px] uppercase tracking-[0.2em] text-mahogany">
              Hand-embroidered
            </span>
          </RevealSection>

          <RevealSection delay={0.1}>
            <h1 className="font-heading text-4xl leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl">
              Thread, held to the light.
            </h1>
          </RevealSection>

          <RevealSection delay={0.2}>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-charcoal">
              Hand-embroidered pieces, and custom work made to your fabric,
              thread, and story. Every stitch carries intention.
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <div className="mt-8 flex gap-4">
              <Link href="/products">
                <Button>Shop the collection</Button>
              </Link>
              <Link href="/custom-order">
                <Button variant="secondary">Custom order</Button>
              </Link>
            </div>
          </RevealSection>
        </div>

        <RevealSection delay={0.2} direction="right" className="mt-12 lg:mt-0 lg:flex-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-2xl shadow-xl shadow-charcoal/10">
            {products.length > 0 && products[0].product_images?.[0] ? (
              <Image
                src={products[0].product_images[0].url}
                alt={products[0].product_images[0].alt_text || products[0].name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-charcoal/5 font-body text-charcoal">
                Loading...
              </div>
            )}
          </div>
        </RevealSection>
      </section>

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="px-6 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <RevealSection>
              <h2 className="font-heading text-2xl text-ink md:text-3xl">
                Selected pieces
              </h2>
            </RevealSection>

            <div className="mt-10">
              <ProductGrid products={products} />
            </div>

            <RevealSection delay={0.2}>
              <div className="mt-12 text-center">
                <Link href="/products">
                  <Button variant="secondary">View all products</Button>
                </Link>
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      {/* Brand Statement Section */}
      <section className="px-6 py-32 md:px-8">
        <RevealSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl leading-tight text-ink md:text-5xl md:leading-tight">
              Every stitch carries intention.
            </h2>
            <p className="mx-auto mt-6 max-w-lg font-body text-base leading-relaxed text-charcoal">
              In a world of mass production, we believe there is profound value
              in things made slowly. No machines, no shortcuts — just needle,
              thread, and the steady hand of an artisan.
            </p>
          </div>
        </RevealSection>
      </section>

      {/* Custom Order CTA Section */}
      <section className="px-6 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <RevealSection>
              <div>
                <h2 className="font-heading text-2xl text-ink md:text-3xl">
                  Made for you
                </h2>
                <p className="mt-4 max-w-md font-body text-base leading-relaxed text-charcoal">
                  Have a design in mind? Our custom order process lets you
                  collaborate directly with our artisans. Upload a reference
                  image, pick your fabric, choose thread colors, and we&apos;ll
                  bring it to life.
                </p>
                <div className="mt-8">
                  <Link href="/custom-order">
                    <Button>Begin your commission</Button>
                  </Link>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.15} direction="right">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-mahogany/30 bg-mahogany/5 p-8">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 text-6xl">✦</div>
                  <p className="font-heading text-lg text-ink">
                    Your vision, our craft
                  </p>
                  <p className="mt-2 max-w-xs font-body text-sm text-charcoal">
                    Fabric, thread colors, sizing — every detail is yours to
                    choose
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
}
