import { Suspense } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/actions/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Suti & Thread",
  description:
    "Browse our collection of hand-embroidered shawls, kurtas, home textiles, and more.",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

async function ProductFilters({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products">
        <span
          className={[
            "rounded-full border px-3 py-1.5 font-body text-xs transition-colors",
            !activeCategory
              ? "border-mahogany bg-mahogany text-kora"
              : "border-charcoal/30 bg-transparent text-ink hover:border-mahogany",
          ].join(" ")}
        >
          All
        </span>
      </Link>
      {categories.map((cat) => (
        <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
          <span
            className={[
              "rounded-full border px-3 py-1.5 font-body text-xs transition-colors",
              activeCategory === cat
                ? "border-mahogany bg-mahogany text-kora"
                : "border-charcoal/30 bg-transparent text-ink hover:border-mahogany",
            ].join(" ")}
          >
            {cat}
          </span>
        </Link>
      ))}
    </div>
  );
}

async function ProductsContent({ category, page }: { category?: string; page: number }) {
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({ category, page, pageSize: 12 }),
    getCategories(),
  ]);

  return (
    <div className="px-6 py-8 md:px-8 md:py-12">
      <h1 className="font-heading text-3xl text-ink md:text-4xl">Products</h1>

      <div className="mt-6">
        <ProductFilters
          categories={categoriesResult.categories}
          activeCategory={category}
        />
      </div>

      <div className="mt-8">
        <ProductGrid products={productsResult.products} />
      </div>

      {productsResult.total > 12 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/products?${category ? `category=${category}&` : ""}page=${page - 1}`}
            >
              <Button variant="secondary">Previous</Button>
            </Link>
          )}
          {page * 12 < productsResult.total && (
            <Link
              href={`/products?${category ? `category=${category}&` : ""}page=${page + 1}`}
            >
              <Button variant="secondary">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category;
  const page = Number(params.page) || 1;

  return (
    <Suspense fallback={<div className="px-6 py-8 md:px-8 md:py-12">Loading...</div>}>
      <ProductsContent category={category} page={page} />
    </Suspense>
  );
}
