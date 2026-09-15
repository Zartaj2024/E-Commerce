import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/actions/catalog";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantPickerClient } from "./VariantPickerClient";
import { Badge } from "@/components/ui/Badge";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.product) {
    return { title: "Product not found — Suti & Thread" };
  }

  const product = result.product;

  return {
    title: `${product.name} — Suti & Thread`,
    description:
      product.description ?? `Hand-embroidered ${product.name} from Suti & Thread.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.product) {
    notFound();
  }

  const product = result.product;
  const images = product.product_images ?? [];
  const variants = product.product_variants ?? [];

  return (
    <div className="px-6 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Image gallery */}
        <div className="flex-1">
          <ProductGallery images={images} />
        </div>

        {/* Details */}
        <div className="flex-1">
          <Badge variant="default">{product.category}</Badge>

          <h1 className="mt-3 font-heading text-3xl text-ink md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 font-body text-base leading-relaxed text-charcoal">
            {product.description}
          </p>

          {variants.length > 0 && (
            <div className="mt-8">
              <VariantPickerClient
                variants={variants}
                basePrice={product.base_price}
                productName={product.name}
                productSlug={product.slug}
                productImage={
                  images.length > 0 ? images[0].url : ""
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
