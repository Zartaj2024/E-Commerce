"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { FabricPicker } from "./FabricPicker";
import { ThreadColorPicker } from "./ThreadColorPicker";
import { SizePlacementPicker } from "./SizePlacementPicker";
import { Button } from "@/components/ui/Button";
import { submitCustomOrder } from "@/actions/customOrders";
import {
  CustomOrderSchema,
  type CustomOrderInput,
} from "@/lib/validation/customOrderSchema";
import { THREAD_COLORS } from "@/lib/domain/customOrder";

const STEPS = ["Image", "Fabric & Colors", "Size & Placement", "Notes", "Review"] as const;

export function CustomOrderForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CustomOrderInput>({
    referenceImageUrl: "",
    imageAltText: "",
    fabric: "",
    threadColors: [],
    sizePlacement: "",
    notes: "",
  });

  const update = <K extends keyof CustomOrderInput>(
    key: K,
    value: CustomOrderInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 0) {
      if (!form.referenceImageUrl) stepErrors.referenceImageUrl = "Reference image is required";
      if (!form.imageAltText) stepErrors.imageAltText = "Please describe the image";
    } else if (step === 1) {
      if (!form.fabric) stepErrors.fabric = "Please select a fabric";
      if (form.threadColors.length === 0) stepErrors.threadColors = "Select at least one color";
    } else if (step === 2) {
      if (!form.sizePlacement) stepErrors.sizePlacement = "Please select a size/placement";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    const parsed = CustomOrderSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setStep(0);
      return;
    }

    setSubmitting(true);
    const result = await submitCustomOrder(parsed.data);
    setSubmitting(false);

    if (result.success) {
      router.push(`/order-confirmation/${result.orderId}`);
    } else {
      setErrors({ submit: result.error });
    }
  };

  const selectedColorNames = form.threadColors;

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full font-body text-xs transition-colors",
                i === step
                  ? "bg-peacock text-kora"
                  : i < step
                    ? "bg-peacock/20 text-peacock"
                    : "bg-charcoal/10 text-charcoal",
              ].join(" ")}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className="hidden font-body text-[10px] text-charcoal sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl text-ink">Reference image</h2>
            <p className="font-body text-sm text-charcoal">
              Upload a photo of the embroidery design you&apos;d like us to recreate.
            </p>
            <ImageUpload
              currentImage={form.referenceImageUrl || null}
              onUploadComplete={(url, alt) => {
                update("referenceImageUrl", url);
                if (!form.imageAltText) update("imageAltText", alt);
              }}
            />
            {errors.referenceImageUrl && (
              <p className="font-body text-xs text-mahogany">{errors.referenceImageUrl}</p>
            )}

            <div className="space-y-2">
              <label className="block font-body text-xs text-charcoal">
                Describe the design
              </label>
              <input
                type="text"
                value={form.imageAltText}
                onChange={(e) => update("imageAltText", e.target.value)}
                placeholder="e.g. Floral pattern with paisley motifs"
                className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
              />
              {errors.imageAltText && (
                <p className="font-body text-xs text-mahogany">{errors.imageAltText}</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl text-ink">Fabric & thread</h2>
            <FabricPicker
              value={form.fabric as any}
              onChange={(v) => update("fabric", v)}
              error={errors.fabric}
            />
            <ThreadColorPicker
              value={form.threadColors}
              onChange={(v) => update("threadColors", v)}
              error={errors.threadColors}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl text-ink">Size & placement</h2>
            <p className="font-body text-sm text-charcoal">
              Where on the garment should the embroidery be placed?
            </p>
            <SizePlacementPicker
              value={form.sizePlacement}
              onChange={(v) => update("sizePlacement", v)}
              error={errors.sizePlacement}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl text-ink">Additional notes</h2>
            <p className="font-body text-sm text-charcoal">
              Any special instructions, color preferences, or details we should know?
            </p>
            <textarea
              value={form.notes || ""}
              onChange={(e) => update("notes", e.target.value)}
              rows={5}
              placeholder="e.g. Prefer slightly muted tones, leave 2cm border allowance..."
              className="w-full resize-none border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
            />
            <p className="font-body text-xs text-charcoal">
              {(form.notes || "").length}/500 characters
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-heading text-xl text-ink">Review your order</h2>

            <div className="space-y-4 rounded border border-charcoal/20 p-4">
              {form.referenceImageUrl && (
                <div>
                  <span className="font-body text-xs text-charcoal">Reference image</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.referenceImageUrl}
                    alt={form.imageAltText}
                    className="mt-1 max-h-40 rounded object-contain"
                  />
                  <p className="mt-1 font-body text-xs text-charcoal">{form.imageAltText}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-body text-xs text-charcoal">Fabric</span>
                  <p className="font-body text-sm text-ink">{form.fabric || "—"}</p>
                </div>
                <div>
                  <span className="font-body text-xs text-charcoal">Size & placement</span>
                  <p className="font-body text-sm text-ink">{form.sizePlacement || "—"}</p>
                </div>
              </div>

              <div>
                <span className="font-body text-xs text-charcoal">Thread colors</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedColorNames.map((name) => {
                    const color = THREAD_COLORS.find((c) => c.name === name);
                    return (
                      <div key={name} className="flex items-center gap-1.5">
                        <div
                          className="h-4 w-4 rounded-full border border-charcoal/20"
                          style={{ backgroundColor: color?.hex }}
                        />
                        <span className="font-body text-xs text-ink">{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {form.notes && (
                <div>
                  <span className="font-body text-xs text-charcoal">Notes</span>
                  <p className="mt-1 font-body text-sm text-ink whitespace-pre-wrap">
                    {form.notes}
                  </p>
                </div>
              )}
            </div>

            <p className="font-body text-xs text-charcoal">
              Our team will review your request and send a quote within 2-3 business days.
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="mt-4 rounded border border-mahogany/30 bg-mahogany/5 p-3">
          <p className="font-body text-sm text-mahogany">{errors.submit}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <Button variant="secondary" onClick={prev}>
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <Button onClick={next}>Continue</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit request"}
          </Button>
        )}
      </div>
    </div>
  );
}
