"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: Awaited<ReturnType<typeof login>> | null, formData: FormData) => {
      return login(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block font-body text-xs text-charcoal"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block font-body text-xs text-charcoal"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
          placeholder="Your password"
        />
      </div>

      {state?.error && (
        <p className="font-body text-sm text-mahogany">{state.error}</p>
      )}

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}
