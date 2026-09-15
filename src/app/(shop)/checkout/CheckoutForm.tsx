"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { createOrder } from "@/actions/checkout";
import { getAddresses, addAddress } from "@/actions/addresses";
import { AddressSchema } from "@/lib/validation/addressSchema";
import { formatPrice, calculateSubtotal, calculateShipping, calculateTotal } from "@/lib/services/pricing";
import type { Address } from "@/lib/domain/address";

type PaymentMethod = "stripe" | "bank_transfer" | "cod";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const subtotal = getTotal();
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, shipping);

  useEffect(() => {
    getAddresses().then((res) => {
      if (res.success && res.addresses.length > 0) {
        setAddresses(res.addresses);
        const defaultAddr = res.addresses.find((a) => a.is_default);
        setSelectedAddressId(defaultAddr?.id ?? res.addresses[0].id);
      } else {
        setShowNewAddress(true);
      }
    });
  }, []);

  const handleSaveNewAddress = async () => {
    const parsed = AddressSchema.safeParse(newAddress);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key) fieldErrors[key] = issue.message;
      });
      setAddressErrors(fieldErrors);
      return false;
    }

    setAddressErrors({});
    const result = await addAddress(parsed.data);
    if (result.success && result.address) {
      setAddresses((prev) => [result.address!, ...prev]);
      setSelectedAddressId(result.address.id);
      setShowNewAddress(false);
      setNewAddress({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
      });
      return true;
    } else {
      setError(result.error);
      return false;
    }
  };

  const handleSubmit = async () => {
    setError(null);

    let finalAddressId = selectedAddressId;

    if (showNewAddress) {
      const saved = await handleSaveNewAddress();
      if (!saved) return;
      // After saving, use the newly selected address
      finalAddressId = selectedAddressId;
    }

    if (!finalAddressId) {
      setError("Please select or add a shipping address");
      return;
    }

    setLoading(true);
    const result = await createOrder(
      { addressId: finalAddressId, paymentMethod },
      items
    );
    setLoading(false);

    if (result.success) {
      clearCart();
      router.push(`/order-confirmation/${result.orderId}`);
    } else {
      setError(result.error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-charcoal">Your cart is empty.</p>
        <a href="/products" className="mt-2 inline-block font-body text-sm text-peacock hover:underline">
          Browse products
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {/* Address section */}
        <div>
          <h2 className="font-heading text-xl text-ink">Shipping address</h2>

          {addresses.length > 0 && !showNewAddress && (
            <div className="mt-4 space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer gap-3 rounded border p-4 transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-peacock bg-peacock/5"
                      : "border-charcoal/20 hover:border-charcoal/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 accent-peacock"
                  />
                  <div className="font-body text-sm text-ink">
                    <p className="font-medium">{addr.full_name}</p>
                    <p>{addr.address_line1}</p>
                    {addr.address_line2 && <p>{addr.address_line2}</p>}
                    <p>
                      {addr.city}
                      {addr.postal_code ? `, ${addr.postal_code}` : ""}
                    </p>
                    <p className="text-charcoal">{addr.phone}</p>
                  </div>
                </label>
              ))}

              <button
                type="button"
                onClick={() => setShowNewAddress(true)}
                className="mt-2 font-body text-sm text-peacock hover:underline"
              >
                + Add a new address
              </button>
            </div>
          )}

          {showNewAddress && (
            <div className="mt-4 space-y-4 rounded border border-charcoal/20 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-body text-xs text-charcoal">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                  />
                  {addressErrors.fullName && (
                    <p className="mt-1 font-body text-xs text-mahogany">
                      {addressErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-body text-xs text-charcoal">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                  />
                  {addressErrors.phone && (
                    <p className="mt-1 font-body text-xs text-mahogany">
                      {addressErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Address line 1
                </label>
                <input
                  type="text"
                  value={newAddress.addressLine1}
                  onChange={(e) =>
                    setNewAddress((p) => ({
                      ...p,
                      addressLine1: e.target.value,
                    }))
                  }
                  className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                />
                {addressErrors.addressLine1 && (
                  <p className="mt-1 font-body text-xs text-mahogany">
                    {addressErrors.addressLine1}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Address line 2 (optional)
                </label>
                <input
                  type="text"
                  value={newAddress.addressLine2}
                  onChange={(e) =>
                    setNewAddress((p) => ({
                      ...p,
                      addressLine2: e.target.value,
                    }))
                  }
                  className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-body text-xs text-charcoal">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, city: e.target.value }))
                    }
                    className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                  />
                  {addressErrors.city && (
                    <p className="mt-1 font-body text-xs text-mahogany">
                      {addressErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-body text-xs text-charcoal">
                    Postal code (optional)
                  </label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        postalCode: e.target.value,
                      }))
                    }
                    className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowNewAddress(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNewAddress}>Save address</Button>
              </div>
            </div>
          )}
        </div>

        {/* Payment method */}
        <div>
          <h2 className="font-heading text-xl text-ink">Payment method</h2>

          <div className="mt-4 space-y-2">
            {[
              {
                id: "stripe" as PaymentMethod,
                label: "Credit / Debit Card",
                description: "Pay securely via Stripe",
              },
              {
                id: "bank_transfer" as PaymentMethod,
                label: "Bank Transfer",
                description: "Transfer to our bank account. Order confirmed after verification.",
              },
              {
                id: "cod" as PaymentMethod,
                label: "Cash on Delivery",
                description: "Pay when your order arrives",
              },
            ].map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer gap-3 rounded border p-4 transition-colors ${
                  paymentMethod === method.id
                    ? "border-peacock bg-peacock/5"
                    : "border-charcoal/20 hover:border-charcoal/40"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="mt-1 accent-peacock"
                />
                <div>
                  <p className="font-body text-sm text-ink">{method.label}</p>
                  <p className="font-body text-xs text-charcoal">
                    {method.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded border border-mahogany/30 bg-mahogany/5 p-3">
            <p className="font-body text-sm text-mahogany">{error}</p>
          </div>
        )}
      </div>

      {/* Order summary sidebar */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded border border-charcoal/20 p-6">
          <h2 className="font-heading text-lg text-ink">Order summary</h2>

          <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex justify-between font-body text-sm text-charcoal"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-charcoal/20 pt-4 space-y-2">
            <div className="flex justify-between font-body text-sm text-charcoal">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-charcoal">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-charcoal/20 pt-2 font-body text-base text-ink">
              <span className="font-medium">Total</span>
              <span className="font-heading text-mahogany">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <Button
            fullWidth
            className="mt-6"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Placing order..." : "Place order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
