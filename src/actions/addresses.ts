"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getAddresses as getAddressesRepo,
  insertAddress as insertAddressRepo,
} from "@/lib/repositories/addressRepository";
import { AddressSchema } from "@/lib/validation/addressSchema";
import type { AddressInput } from "@/lib/validation/addressSchema";

export async function getAddresses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "Unauthorized",
      addresses: [],
    };
  }

  try {
    const addresses = await getAddressesRepo(user.id);
    return {
      success: true as const,
      addresses,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to fetch addresses",
      addresses: [],
    };
  }
}

export async function addAddress(input: AddressInput) {
  const parsed = AddressSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return {
      success: false as const,
      error: firstError,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false as const,
      error: "Unauthorized",
    };
  }

  try {
    const address = await insertAddressRepo(user.id, {
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      address_line1: parsed.data.addressLine1,
      address_line2: parsed.data.addressLine2,
      city: parsed.data.city,
      postal_code: parsed.data.postalCode,
      is_default: parsed.data.isDefault,
    });

    return {
      success: true as const,
      address,
    };
  } catch {
    return {
      success: false as const,
      error: "Failed to save address",
    };
  }
}
