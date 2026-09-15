import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const headerValue = serializeCookieHeader(name, value, options);
            supabaseResponse.headers.append("Set-Cookie", headerValue);
          });
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    }
  );

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very
  // hard to debug issues with users being randomly logged out.
  //
  // This refreshes the session token. If the JWT is expired, it
  // uses the refresh token to get a new one and writes the new
  // cookie via setAll.
  await supabase.auth.getClaims();

  // Cache-Control: prevent CDN from leaking session cookies
  supabaseResponse.headers.set("Cache-Control", "private, no-store");

  return supabaseResponse;
}

export function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/account") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin")
  );
}

export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/login") || pathname.startsWith("/register");
}
