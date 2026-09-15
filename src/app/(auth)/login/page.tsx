import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Log in — Suti & Thread",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-center font-heading text-3xl text-ink">Log in</h1>
      <p className="mt-2 text-center font-body text-sm text-charcoal">
        Welcome back to Suti &amp; Thread
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <p className="mt-6 text-center font-body text-sm text-charcoal">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-peacock hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
