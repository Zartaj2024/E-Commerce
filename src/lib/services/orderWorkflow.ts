import type { OrderStatus } from "@/lib/domain/order";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  payment_confirmed: ["in_production", "cancelled"],
  in_production: ["quality_check", "cancelled"],
  quality_check: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function canTransitionTo(
  from: OrderStatus,
  to: OrderStatus
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getValidTransitions(status: OrderStatus): OrderStatus[] {
  return VALID_TRANSITIONS[status] ?? [];
}

export function validateTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): { valid: boolean; error?: string } {
  if (currentStatus === newStatus) {
    return { valid: false, error: "Order is already in this status" };
  }

  if (!canTransitionTo(currentStatus, newStatus)) {
    return {
      valid: false,
      error: `Cannot move from "${currentStatus}" to "${newStatus}"`,
    };
  }

  return { valid: true };
}
