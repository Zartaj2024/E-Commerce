import { z } from "zod";
import {
  FABRIC_OPTIONS,
  THREAD_COLORS,
  SIZE_PLACEMENT_OPTIONS,
} from "@/lib/domain/customOrder";

const fabricValues = FABRIC_OPTIONS as readonly string[];
const threadColorValues = THREAD_COLORS.map((c) => c.name) as readonly string[];
const sizePlacementValues = SIZE_PLACEMENT_OPTIONS as readonly string[];

export const CustomOrderSchema = z.object({
  referenceImageUrl: z
    .string()
    .min(1, "Reference image is required"),
  imageAltText: z
    .string()
    .min(1, "Please describe the reference image")
    .max(200, "Description must be under 200 characters"),
  fabric: z.enum(fabricValues as [string, ...string[]], {
    error: () => ({ message: "Please select a fabric" }),
  }),
  threadColors: z
    .array(z.enum(threadColorValues as [string, ...string[]]))
    .min(1, "Select at least one thread color")
    .max(6, "Maximum 6 thread colors"),
  sizePlacement: z.enum(sizePlacementValues as [string, ...string[]], {
    error: () => ({ message: "Please select a size/placement" }),
  }),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional()
    .or(z.literal("")),
});

export type CustomOrderInput = z.infer<typeof CustomOrderSchema>;

export const CustomOrderImageSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().max(5 * 1024 * 1024, "File must be under 5MB"),
  fileType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    error: () => ({ message: "Only JPG, PNG, or WebP images accepted" }),
  }),
});

export type CustomOrderImageInput = z.infer<typeof CustomOrderImageSchema>;
