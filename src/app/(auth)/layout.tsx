import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-kora px-6">
      <Link
        href="/"
        className="mb-8 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
      >
        Suti &amp; Thread
      </Link>
      {children}
    </div>
  );
}
