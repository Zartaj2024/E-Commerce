import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Address } from "@/lib/domain/address";

export async function getAddresses(userId: string): Promise<Address[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[addressRepository] getAddresses error:", error.message);
    throw new Error("Failed to fetch addresses");
  }

  return (data as Address[]) ?? [];
}

export async function getAddressById(
  addressId: string,
  userId: string
): Promise<Address | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("[addressRepository] getAddressById error:", error.message);
    throw new Error("Failed to fetch address");
  }

  return data as Address;
}

export async function insertAddress(
  userId: string,
  input: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code?: string;
    is_default?: boolean;
  }
): Promise<Address> {
  const supabase = await createClient();

  if (input.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      full_name: input.full_name,
      phone: input.phone,
      address_line1: input.address_line1,
      address_line2: input.address_line2 || null,
      city: input.city,
      postal_code: input.postal_code || null,
      is_default: input.is_default ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("[addressRepository] insertAddress error:", error.message);
    throw new Error("Failed to save address");
  }

  return data as Address;
}
