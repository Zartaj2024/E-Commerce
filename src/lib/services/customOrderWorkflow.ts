import type { CustomOrderStatus } from "@/lib/domain/customOrder";

const VALID_CUSTOM_TRANSITIONS: Record<CustomOrderStatus, CustomOrderStatus[]> = {
  pending_review: ["quoted", "declined"],
  quoted: ["converted", "declined"],
  declined: [],
  converted: [],
};

export function canCustomTransitionTo(
  from: CustomOrderStatus,
  to: CustomOrderStatus
): boolean {
  return VALID_CUSTOM_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateCustomTransition(
  currentStatus: CustomOrderStatus,
  newStatus: CustomOrderStatus
): { valid: boolean; error?: string } {
  if (currentStatus === newStatus) {
    return { valid: false, error: "Custom order is already in this status" };
  }

  if (!canCustomTransitionTo(currentStatus, newStatus)) {
    return {
      valid: false,
      error: `Cannot move from "${currentStatus}" to "${newStatus}"`,
    };
  }

  return { valid: true };
}
