"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, toggleProductActive } from "@/actions/admin";
import type { Product } from "@/lib/domain/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((res) => {
      if (res.success) setProducts(res.products);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (productId: string, currentActive: boolean) => {
    const result = await toggleProductActive(productId, !currentActive);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_active: !currentActive } : p
        )
      );
    }
  };

  if (loading) {
    return <p className="font-body text-charcoal">Loading products...</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Products</h1>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-charcoal/20 text-left text-xs text-charcoal">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4 text-right">Price</th>
              <th className="pb-3 pr-4 text-right">Stock</th>
              <th className="pb-3 pr-4 text-right">Active</th>
              <th className="pb-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock =
                product.product_variants?.reduce(
                  (sum, v) => sum + (v.stock_quantity ?? 0),
                  0
                ) ?? 0;

              return (
                <tr
                  key={product.id}
                  className="border-b border-charcoal/10 text-ink"
                >
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4 text-charcoal">{product.category}</td>
                  <td className="py-3 pr-4 text-right">
                    Rs. {product.base_price.toLocaleString("en-PK")}
                  </td>
                  <td className="py-3 pr-4 text-right">{totalStock}</td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => handleToggle(product.id, product.is_active)}
                      className={[
                        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                        product.is_active ? "bg-peacock" : "bg-charcoal/30",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                          product.is_active ? "translate-x-4" : "translate-x-0.5",
                        ].join(" ")}
                      />
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-body text-xs text-mahogany hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
