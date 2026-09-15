import { describe, it, expect } from "vitest";
import {
  canCustomTransitionTo,
  validateCustomTransition,
} from "@/lib/services/customOrderWorkflow";

describe("customOrderWorkflow service", () => {
  describe("canCustomTransitionTo", () => {
    it("allows pending_review → quoted", () => {
      expect(canCustomTransitionTo("pending_review", "quoted")).toBe(true);
    });

    it("allows pending_review → declined", () => {
      expect(canCustomTransitionTo("pending_review", "declined")).toBe(true);
    });

    it("allows quoted → converted", () => {
      expect(canCustomTransitionTo("quoted", "converted")).toBe(true);
    });

    it("allows quoted → declined", () => {
      expect(canCustomTransitionTo("quoted", "declined")).toBe(true);
    });

    it("blocks converted → any", () => {
      expect(canCustomTransitionTo("converted", "quoted")).toBe(false);
      expect(canCustomTransitionTo("converted", "declined")).toBe(false);
    });

    it("blocks declined → any", () => {
      expect(canCustomTransitionTo("declined", "quoted")).toBe(false);
    });

    it("blocks skipping steps", () => {
      expect(canCustomTransitionTo("pending_review", "converted")).toBe(false);
    });
  });

  describe("validateCustomTransition", () => {
    it("rejects same status", () => {
      const result = validateCustomTransition("quoted", "quoted");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("already");
    });

    it("rejects invalid transition", () => {
      const result = validateCustomTransition("pending_review", "converted");
      expect(result.valid).toBe(false);
    });

    it("accepts valid transition", () => {
      const result = validateCustomTransition("pending_review", "quoted");
      expect(result.valid).toBe(true);
    });
  });
});
