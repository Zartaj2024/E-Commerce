"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    async (
      _prev: Awaited<ReturnType<typeof register>> | null,
      formData: FormData
    ) => {
      return register(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="mb-1 block font-body text-xs text-charcoal"
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
          placeholder="Your full name"
        />
      </div>

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
          autoComplete="new-password"
          className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block font-body text-xs text-charcoal"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors focus:border-peacock"
          placeholder="Re-enter your password"
        />
      </div>

      {state?.error && (
        <p className="font-body text-sm text-mahogany">{state.error}</p>
      )}

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
