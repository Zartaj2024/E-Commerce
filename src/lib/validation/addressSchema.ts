import { z } from "zod";

export const AddressSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  addressLine1: z
    .string()
    .min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(1, "City is required"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;
