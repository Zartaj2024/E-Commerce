"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface ImageUploadProps {
  onUploadComplete: (url: string, altText: string) => void;
  currentImage: string | null;
}

export function ImageUpload({ onUploadComplete, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.type)) {
        setError("Only JPG, PNG, or WebP images accepted");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File must be under 5MB");
        return;
      }

      setUploading(true);

      try {
        const res = await fetch("/api/custom-order/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to get upload URL");
        }

        const { path, token } = await res.json();

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from("custom-order-references")
          .uploadToSignedUrl(path, token, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("custom-order-references")
          .getPublicUrl(path);

        setPreview(publicUrl);
        onUploadComplete(publicUrl, file.name.replace(/\.[^/.]+$/, ""));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      <label className="block font-body text-xs text-charcoal">
        Reference image
      </label>

      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Reference"
            className="w-full max-h-64 object-contain rounded border border-charcoal/20"
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onUploadComplete("", "");
            }}
            className="absolute top-2 right-2 rounded bg-ink/80 px-2 py-1 font-body text-xs text-kora hover:bg-ink transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={[
            "flex flex-col items-center justify-center rounded border-2 border-dashed p-8 transition-colors",
            dragActive
              ? "border-peacock bg-peacock/5"
              : "border-charcoal/30 hover:border-charcoal/50",
          ].join(" ")}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="hidden"
            id="reference-image"
          />
          <label
            htmlFor="reference-image"
            className="cursor-pointer text-center"
          >
            <p className="font-body text-sm text-ink">
              {uploading ? "Uploading..." : "Drag & drop or click to upload"}
            </p>
            <p className="mt-1 font-body text-xs text-charcoal">
              JPG, PNG, or WebP — max 5MB
            </p>
          </label>
        </div>
      )}

      {error && (
        <p className="font-body text-xs text-mahogany">{error}</p>
      )}
    </div>
  );
}
