import { describe, it, expect } from "vitest";
import {
  canTransitionTo,
  getValidTransitions,
  validateTransition,
} from "@/lib/services/orderWorkflow";
import type { OrderStatus } from "@/lib/domain/order";

describe("orderWorkflow service", () => {
  describe("canTransitionTo", () => {
    it("allows payment_confirmed → in_production", () => {
      expect(canTransitionTo("payment_confirmed", "in_production")).toBe(true);
    });

    it("allows in_production → quality_check", () => {
      expect(canTransitionTo("in_production", "quality_check")).toBe(true);
    });

    it("allows quality_check → shipped", () => {
      expect(canTransitionTo("quality_check", "shipped")).toBe(true);
    });

    it("allows shipped → delivered", () => {
      expect(canTransitionTo("shipped", "delivered")).toBe(true);
    });

    it("allows cancellation from any active state", () => {
      expect(canTransitionTo("payment_confirmed", "cancelled")).toBe(true);
      expect(canTransitionTo("in_production", "cancelled")).toBe(true);
      expect(canTransitionTo("quality_check", "cancelled")).toBe(true);
    });

    it("blocks delivered → any", () => {
      expect(canTransitionTo("delivered", "shipped")).toBe(false);
      expect(canTransitionTo("delivered", "cancelled")).toBe(false);
    });

    it("blocks cancelled → any", () => {
      expect(canTransitionTo("cancelled", "in_production")).toBe(false);
    });

    it("blocks skipping steps", () => {
      expect(canTransitionTo("payment_confirmed", "shipped")).toBe(false);
      expect(canTransitionTo("payment_confirmed", "delivered")).toBe(false);
    });
  });

  describe("getValidTransitions", () => {
    it("returns correct transitions for payment_confirmed", () => {
      expect(getValidTransitions("payment_confirmed")).toEqual([
        "in_production",
        "cancelled",
      ]);
    });

    it("returns empty for delivered", () => {
      expect(getValidTransitions("delivered")).toEqual([]);
    });
  });

  describe("validateTransition", () => {
    it("rejects same status", () => {
      const result = validateTransition("in_production", "in_production");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("already");
    });

    it("rejects invalid transition", () => {
      const result = validateTransition("payment_confirmed", "shipped");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Cannot move");
    });

    it("accepts valid transition", () => {
      const result = validateTransition("payment_confirmed", "in_production");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
