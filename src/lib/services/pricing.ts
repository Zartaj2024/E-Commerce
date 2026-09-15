const SHIPPING_COST = 200;
const FREE_SHIPPING_THRESHOLD = 5000;

export interface PricingInput {
  price: number;
  quantity: number;
}

export function calculateSubtotal(items: PricingInput[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function calculateTotal(subtotal: number, shipping: number): number {
  return subtotal + shipping;
}

export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}
