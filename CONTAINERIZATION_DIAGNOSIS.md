          gf# Containerization Diagnosis Report: Suti & Thread

## ROOT CAUSE ANALYSIS

### Primary Issue: TypeScript Build Failure (Build Stage Fails)

**Error Location:** `npm run build` during Docker multi-stage build
```
[builder 6/6] RUN npm run build → FAILED
Error: Type 'string | undefined' is not assignable to type 'string'
```

**Files Affected:**
- `src/lib/supabase/client.ts` (line 13)
- `src/lib/supabase/server.ts` (line 16)

---

## DETAILED CAUSE BREAKDOWN

### Cause #1: Runtime Credentials Check Executes at Build Time ❌

**The Problem:**
In your Supabase client files, you check for missing credentials at **module initialization time**:

```typescript
// src/lib/supabase/client.ts (LINE 3-5)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials...");
}

// Then immediately use them (TypeScript sees as potentially undefined)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);  // ← supabaseUrl and supabaseKey might be undefined!
}
```

**Why It Fails:**
TypeScript cannot guarantee these variables will be strings because:
1. `process.env.NEXT_PUBLIC_SUPABASE_URL` returns `string | undefined`
2. The runtime check `if (!supabaseUrl)` happens **after** assignment
3. TypeScript doesn't track that the throw ensures they're defined
4. When passing to `createBrowserClient()`, TypeScript sees the type as `string | undefined`, not `string`

**When It Fails:**
- ✅ Works locally (process.env vars are set during dev)
- ❌ Fails in Docker build (no `.env.production` in image, all env vars are undefined)
- TypeScript sees undefined and rejects it

---

### Cause #2: Missing Environment Variables at Build Time ❌

**The Problem:**
Docker build runs with NO environment variables from `.env.production` because:
1. `.env.production` is not copied into the Docker image (for security)
2. `npm run build` runs inside the container with clean environment
3. `process.env.NEXT_PUBLIC_SUPABASE_URL` is literally `undefined`

**Timeline:**
```
docker build starts
  → Dockerfile: RUN npm install (copies files)
  → Dockerfile: COPY . . (copies source including .env.production? NO!)
  → Dockerfile: RUN npm run build
       → Next.js loads src/lib/supabase/client.ts
           → const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL  // undefined
           → if (!supabaseUrl) throw Error...  // FAILS
```

**Why `.env.production` is NOT in the image:**
- ✅ Security best practice (secrets shouldn't be in images)
- ❌ But it means build-time checks fail

---

### Cause #3: TypeScript Type System vs Runtime Checks ❌

**The Problem:**
Even though you throw an error, TypeScript's type checker doesn't understand it:

```typescript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;  // type: string | undefined
if (!url) {
  throw new Error("Missing URL");  // TypeScript ignores this!
}

// TypeScript still thinks url could be undefined here
return createBrowserClient(url, key);  // ERROR: Argument of type 'string | undefined'
```

**Why TypeScript Doesn't Understand:**
- TypeScript's type narrowing doesn't track runtime throws
- It requires explicit type guards: `as string`, type predicates, or asserts
- The validator comment doesn't help TypeScript

---

## SOLUTIONS

### ✅ Solution #1: Use TypeScript `as const` Assertion (Recommended for Build)

**File: `src/lib/supabase/server.ts`**

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase credentials at runtime. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Called from a Server Component — ignore
        }
      },
    },
  });
}
```

**File: `src/lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase credentials at runtime. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
```

**Why This Works:**
- `as string` tells TypeScript: "Trust me, this is a string at runtime"
- During Docker build: `undefined` gets coerced to `"undefined"` string (not ideal but passes build)
- At runtime: If env vars are not set, the `if` check throws immediately with clear error
- Separate error handling from type assertion

---

### ✅ Solution #2: Lazy Initialization (Best Practice)

**File: `src/lib/supabase/server.ts`**

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set at runtime."
    );
  }

  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Called from a Server Component — ignore
        }
      },
    },
  });
}
```

**File: `src/lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set at runtime."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
```

**Why This Works:**
- Variables declared **inside** the function
- TypeScript evaluates narrowing **within that scope**
- Build succeeds (these functions never run during build)
- Runtime check happens when functions are actually called
- Clear separation: build passes, runtime validation happens later

---

### ✅ Solution #3: Provide Build-Time Dummy Values (Quick Fix)

**File: `.env` (at project root, for build only)**

```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key_for_build
SUPABASE_SERVICE_ROLE_KEY=placeholder_for_build
STRIPE_SECRET_KEY=sk_placeholder_for_build
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_build
RESEND_API_KEY=re_placeholder_for_build
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@localhost.com
```

**Why This Works:**
- `.env` is loaded by default during `npm run build`
- Provides valid (dummy) values so TypeScript sees `string`, not `undefined`
- Build succeeds
- **Important:** These dummy values get baked into the image
- At runtime, override with real values via `.env.production`

**Security Risk:** If dummy values are baked in and not overridden, app uses wrong credentials

---

## SUMMARY TABLE

| Cause | Location | Problem | Impact | Fix |
|-------|----------|---------|--------|-----|
| **Module-level env checks** | `src/lib/supabase/client.ts`, `server.ts` lines 3-8 | TypeScript sees `string \| undefined` type | Build fails TypeScript validation | Move checks inside functions (lazy init) |
| **Missing env vars at build** | Docker build environment | `.env.production` not in image, all env undefined | Build fails with TypeScript errors | Use `as string` or provide build-time `.env` |
| **Type narrowing not tracked** | TypeScript compiler | Runtime `throw` doesn't narrow types for compiler | Type errors even though runtime would be safe | Use type assertions (`as string`) or lazy init |

---

## RECOMMENDED FIX (Combined Approach)

Apply **Solution #2 (Lazy Initialization)** + **Solution #1 (Type Assertions)**:

1. Move credential checks inside functions (lazy)
2. Use `as string` type assertions for safety
3. Keep `.env.production` outside image (security)
4. Real env vars injected at runtime

This way:
- ✅ Docker build succeeds (functions never run)
- ✅ TypeScript type checker passes (assertions provided)
- ✅ Security maintained (no secrets in image)
- ✅ Runtime validation works (checks fire when functions called)

---

## IMPLEMENTATION STEPS

1. Update `src/lib/supabase/server.ts` → lazy initialization
2. Update `src/lib/supabase/client.ts` → lazy initialization
3. Delete `.env` if it exists (or add to `.gitignore`)
4. Keep `.env.production` with real values (git-ignored)
5. Run: `docker compose build app`
6. Verify: `docker logs suti-thread-prod`
