"use client";

import { useEffect, useState } from "react";
import { getAddresses, addAddress } from "@/actions/addresses";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string | null;
  is_default: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    getAddresses().then(({ addresses }) => {
      setAddresses(addresses as Address[]);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const result = await addAddress({
      ...form,
      addressLine2: form.addressLine2 || undefined,
      postalCode: form.postalCode || undefined,
      isDefault: addresses.length === 0,
    });

    if (result.success) {
      setAddresses([...addresses, result.address as Address]);
      setForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
      });
      setShowForm(false);
    } else {
      setError(result.error ?? "Failed to save address");
    }
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
        <h1 className="font-display text-2xl text-ink">Addresses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-mahogany px-4 py-2 font-body text-sm text-kora transition-colors hover:bg-mahogany/90"
        >
          {showForm ? "Cancel" : "Add address"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg border border-charcoal/20 bg-white p-6"
        >
          <h2 className="mb-4 font-display text-lg text-ink">New address</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-mahogany/10 px-4 py-3 font-body text-sm text-mahogany">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs text-charcoal">
                Full name *
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs text-charcoal">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-body text-xs text-charcoal">
                Address line 1 *
              </label>
              <input
                type="text"
                required
                value={form.addressLine1}
                onChange={(e) =>
                  setForm({ ...form, addressLine1: e.target.value })
                }
                className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-body text-xs text-charcoal">
                Address line 2
              </label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={(e) =>
                  setForm({ ...form, addressLine2: e.target.value })
                }
                className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs text-charcoal">
                City *
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs text-charcoal">
                Postal code
              </label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
                className="w-full rounded-lg border border-charcoal/20 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-mahogany"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-lg bg-peacock px-6 py-2 font-body text-sm text-kora transition-colors hover:bg-peacock/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save address"}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-charcoal/20 bg-white p-8 text-center">
          <p className="font-body text-charcoal">
            No saved addresses. Add one to use during checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between rounded-lg border border-charcoal/20 bg-white p-4"
            >
              <div className="font-body text-sm text-charcoal">
                <p className="font-medium text-ink">{addr.full_name}</p>
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>
                  {addr.city}
                  {addr.postal_code && `, ${addr.postal_code}`}
                </p>
                <p className="mt-1">{addr.phone}</p>
              </div>
              {addr.is_default && (
                <span className="shrink-0 rounded-full bg-peacock/10 px-2 py-0.5 font-body text-xs text-peacock">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
