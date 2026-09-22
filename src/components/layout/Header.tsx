import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let role: string | null = null;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      role = profile?.role ?? null;
    }

    return <HeaderClient user={user ? { email: user.email ?? "" } : null} role={role} />;
  } catch (error) {
    // During build or if Supabase is unavailable, render without user info
    // This prevents build failures when env vars aren't set
    console.error("[Header] Error fetching user:", error instanceof Error ? error.message : error);
    return <HeaderClient user={null} role={null} />;
  }
}
