import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Create account — Suti & Thread",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-center font-heading text-3xl text-ink">
        Create account
      </h1>
      <p className="mt-2 text-center font-body text-sm text-charcoal">
        Join Suti &amp; Thread to shop and commission custom pieces
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center font-body text-sm text-charcoal">
        Already have an account?{" "}
        <Link href="/login" className="text-peacock hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
