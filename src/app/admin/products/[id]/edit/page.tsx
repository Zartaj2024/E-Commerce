"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProductForEdit,
  updateProductAction,
  saveProductVariants,
  saveProductImages,
  deleteProductImage,
  deleteProductVariant,
  uploadProductImage,
} from "@/actions/admin";

interface ProductImage {
  id?: string;
  url: string;
  alt_text: string;
  sort_order: number;
}

interface ProductVariant {
  id?: string;
  fabric: string;
  color: string;
  size: string;
  price_modifier: number;
  stock_quantity: number;
  sku: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productId, setProductId] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [slugEdited, setSlugEdited] = useState(false);

  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
      getProductForEdit(id).then((res) => {
        if (res.success && res.product) {
          const p = res.product;
          setName(p.name);
          setSlug(p.slug);
          setDescription(p.description ?? "");
          setCategory(p.category);
          setBasePrice(p.base_price);
          setIsActive(p.is_active);
          setImages(
            (p.product_images ?? []).map((img) => ({
              id: img.id,
              url: img.url,
              alt_text: img.alt_text,
              sort_order: img.sort_order,
            }))
          );
          setVariants(
            (p.product_variants ?? []).map((v) => ({
              id: v.id,
              fabric: v.fabric ?? "",
              color: v.color ?? "",
              size: v.size ?? "",
              price_modifier: v.price_modifier,
              stock_quantity: v.stock_quantity,
              sku: v.sku ?? "",
            }))
          );
        } else {
          setError(res.error ?? "Failed to load product");
        }
        setLoading(false);
      });
    });
  }, [params]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(generateSlug(val));
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setSlugEdited(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadProductImage(formData);
    if (result.success && result.url) {
      setImages([
        ...images,
        { url: result.url, alt_text: file.name.replace(/\.[^.]+$/, ""), sort_order: images.length },
      ]);
    } else {
      setError(result.error ?? "Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const img = images[index];
    if (img.id) {
      deleteProductImage(img.id);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageAltChange = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], alt_text: val };
    setImages(updated);
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    updated.forEach((img, i) => (img.sort_order = i));
    setImages(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { fabric: "", color: "", size: "", price_modifier: 0, stock_quantity: 0, sku: "" },
    ]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const v = variants[index];
    if (v.id) {
      deleteProductVariant(v.id);
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const productResult = await updateProductAction(productId, {
      name,
      slug,
      description: description || undefined,
      category,
      base_price: basePrice,
      is_active: isActive,
    });

    if (!productResult.success) {
      setError(productResult.error ?? "Failed to save product");
      setSaving(false);
      return;
    }

    await saveProductVariants(
      productId,
      variants.map((v) => ({
        ...v,
        fabric: v.fabric || undefined,
        color: v.color || undefined,
        size: v.size || undefined,
        sku: v.sku || undefined,
      }))
    );

    await saveProductImages(
      productId,
      images.map((img, i) => ({
        ...img,
        sort_order: i,
      }))
    );

    setSuccess("Product saved successfully");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mahogany border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/products")}
            className="mb-2 font-body text-sm text-mahogany hover:underline"
          >
            ← Back to products
          </button>
          <h1 className="font-display text-2xl text-ink">Edit product</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-mahogany px-6 py-2.5 font-body text-sm text-kora transition-colors hover:bg-mahogany/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-mahogany/10 px-4 py-3 font-body text-sm text-mahogany">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-peacock/10 px-4 py-3 font-body text-sm text-peacock">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-charcoal/20 bg-white p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Product info</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-body text-xs text-charcoal">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-body text-xs text-charcoal">
                    Base price (PKR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={[
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    isActive ? "bg-peacock" : "bg-charcoal/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                      isActive ? "translate-x-4" : "translate-x-0.5",
                    ].join(" ")}
                  />
                </button>
                <span className="font-body text-sm text-charcoal">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-lg border border-charcoal/20 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Variants</h2>
              <button
                onClick={addVariant}
                className="rounded-lg border border-charcoal/20 px-3 py-1.5 font-body text-xs text-charcoal hover:bg-kora"
              >
                + Add variant
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="font-body text-sm text-charcoal">
                No variants. Add one for different fabrics, colors, or sizes.
              </p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, i) => (
                  <div
                    key={variant.id ?? i}
                    className="rounded-lg border border-charcoal/10 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-body text-xs text-charcoal">
                        Variant {i + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveVariant(i)}
                        className="font-body text-xs text-mahogany hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block font-body text-xs text-charcoal">
                          Fabric
                        </label>
                        <input
                          type="text"
                          value={variant.fabric}
                          onChange={(e) =>
                            updateVariant(i, "fabric", e.target.value)
                          }
                          className="w-full rounded border border-charcoal/20 bg-kora px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-mahogany"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-xs text-charcoal">
                          Color
                        </label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) =>
                            updateVariant(i, "color", e.target.value)
                          }
                          className="w-full rounded border border-charcoal/20 bg-kora px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-mahogany"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-xs text-charcoal">
                          Size
                        </label>
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(e) =>
                            updateVariant(i, "size", e.target.value)
                          }
                          className="w-full rounded border border-charcoal/20 bg-kora px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-mahogany"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-xs text-charcoal">
                          Price modifier
                        </label>
                        <input
                          type="number"
                          value={variant.price_modifier}
                          onChange={(e) =>
                            updateVariant(
                              i,
                              "price_modifier",
                              Number(e.target.value)
                            )
                          }
                          className="w-full rounded border border-charcoal/20 bg-kora px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-mahogany"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-xs text-charcoal">
                          Stock
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={variant.stock_quantity}
                          onChange={(e) =>
                            updateVariant(
                              i,
                              "stock_quantity",
                              Number(e.target.value)
                            )
                          }
                          className="w-full rounded border border-charcoal/20 bg-kora px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-mahogany"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-body text-xs text-charcoal">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariant(i, "sku", e.target.value)
                          }
                          className="w-full rounded border border-charcoal/20 bg-kora px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-mahogany"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-charcoal/20 bg-white p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Images</h2>

            <div className="mb-4">
              <label className="mb-2 block">
                <span className="cursor-pointer rounded-lg border border-dashed border-charcoal/30 px-4 py-3 text-center font-body text-xs text-charcoal hover:bg-kora">
                  {uploading ? "Uploading..." : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {images.length === 0 ? (
              <p className="font-body text-sm text-charcoal">No images yet.</p>
            ) : (
              <div className="space-y-3">
                {images.map((img, i) => (
                  <div
                    key={img.id ?? i}
                    className="flex items-start gap-2 rounded-lg border border-charcoal/10 p-2"
                  >
                    <img
                      src={img.url}
                      alt={img.alt_text}
                      className="h-16 w-16 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={img.alt_text}
                        onChange={(e) => handleImageAltChange(i, e.target.value)}
                        placeholder="Alt text"
                        className="mb-1 w-full rounded border border-charcoal/20 bg-kora px-2 py-1 font-body text-xs text-ink outline-none focus:border-mahogany"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleMoveImage(i, -1)}
                          disabled={i === 0}
                          className="font-body text-xs text-charcoal hover:underline disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => handleMoveImage(i, 1)}
                          disabled={i === images.length - 1}
                          className="font-body text-xs text-charcoal hover:underline disabled:opacity-30"
                        >
                          →
                        </button>
                        <button
                          onClick={() => handleRemoveImage(i)}
                          className="ml-auto font-body text-xs text-mahogany hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
