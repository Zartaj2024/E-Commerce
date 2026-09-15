import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { fileName, fileSize, fileType } = body;

  if (!fileName || !fileSize || !fileType) {
    return NextResponse.json({ error: "Missing file metadata" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, or WebP images accepted" },
      { status: 400 }
    );
  }

  if (fileSize > MAX_SIZE) {
    return NextResponse.json(
      { error: "File must be under 5MB" },
      { status: 400 }
    );
  }

  const ext = fileName.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("custom-order-references")
    .createSignedUploadUrl(path);

  if (error) {
    console.error("[upload-url] createSignedUploadUrl error:", error.message);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    path: data.path,
    token: data.token,
  });
}
