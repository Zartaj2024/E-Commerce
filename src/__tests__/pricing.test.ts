import { describe, it, expect } from "vitest";
import {
  calculateSubtotal,
  calculateShipping,
  calculateTotal,
  formatPrice,
} from "@/lib/services/pricing";

describe("pricing service", () => {
  describe("calculateSubtotal", () => {
    it("calculates subtotal for multiple items", () => {
      const items = [
        { price: 1000, quantity: 2 },
        { price: 500, quantity: 1 },
      ];
      expect(calculateSubtotal(items)).toBe(2500);
    });

    it("returns 0 for empty cart", () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it("handles single item", () => {
      expect(calculateSubtotal([{ price: 1500, quantity: 1 }])).toBe(1500);
    });
  });

  describe("calculateShipping", () => {
    it("charges shipping below threshold", () => {
      expect(calculateShipping(4000)).toBe(200);
    });

    it("free shipping at threshold", () => {
      expect(calculateShipping(5000)).toBe(0);
    });

    it("free shipping above threshold", () => {
      expect(calculateShipping(10000)).toBe(0);
    });
  });

  describe("calculateTotal", () => {
    it("adds subtotal and shipping", () => {
      expect(calculateTotal(3000, 200)).toBe(3200);
    });

    it("works with free shipping", () => {
      expect(calculateTotal(5000, 0)).toBe(5000);
    });
  });

  describe("formatPrice", () => {
    it("formats PKR price", () => {
      expect(formatPrice(1500)).toBe("Rs. 1,500");
    });

    it("formats zero", () => {
      expect(formatPrice(0)).toBe("Rs. 0");
    });
  });
});
