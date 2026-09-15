"use client";

import Link from "next/link";
import { logout } from "@/actions/auth";
import { useCartStore } from "@/store/cart";

interface HeaderClientProps {
  user: { email: string } | null;
  role: string | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/custom-order", label: "Custom order" },
  { href: "/about", label: "About" },
];

export function HeaderClient({ user, role }: HeaderClientProps) {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="flex items-center justify-between border-b border-charcoal/20 px-6 py-4 md:px-8 md:py-5">
      <Link
        href="/"
        className="font-heading text-xl text-ink hover:text-mahogany transition-colors"
      >
        Suti &amp; Thread
      </Link>

      <nav className="flex gap-5 font-body text-sm text-ink md:gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-mahogany transition-colors"
          >
            {link.label}
          </Link>
        ))}

        {user ? (
          <>
            {role === "admin" && (
              <Link href="/admin" className="hover:text-mahogany transition-colors">
                Admin
              </Link>
            )}
            <Link href="/account" className="hover:text-mahogany transition-colors">
              Account
            </Link>
            <button
              onClick={() => logout()}
              className="hover:text-mahogany transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:text-mahogany transition-colors">
            Log in
          </Link>
        )}

        <Link href="/cart" className="relative hover:text-mahogany transition-colors">
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-mahogany font-body text-[10px] text-kora">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
