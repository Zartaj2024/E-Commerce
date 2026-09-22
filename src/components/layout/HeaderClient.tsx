"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence } from "motion/react";
import { logout } from "@/actions/auth";
import { useCartStore } from "@/store/cart";
import { MobileMenu } from "./MobileMenu";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    if (itemCount !== prevCount) {
      setPrevCount(itemCount);
    }
  }, [itemCount, prevCount]);

  return (
    <>
      {/* Desktop nav — floating pill */}
      <header
        className={`fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 transition-all duration-300 md:block ${
          scrolled
            ? "bg-kora/95 shadow-sm shadow-charcoal/5"
            : "bg-kora/80"
        } rounded-full border border-charcoal/10 backdrop-blur-xl px-6 py-3`}
      >
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="font-heading text-lg text-ink hover:text-mahogany transition-colors"
          >
            Suti &amp; Thread
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-body text-sm text-ink hover:text-mahogany transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              {role === "admin" && (
                <Link
                  href="/admin"
                  className="font-body text-sm text-ink hover:text-mahogany transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="font-body text-sm text-ink hover:text-mahogany transition-colors"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="font-body text-sm text-ink hover:text-mahogany transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-body text-sm text-ink hover:text-mahogany transition-colors"
            >
              Log in
            </Link>
          )}

          <Link
            href="/cart"
            className="relative font-body text-sm text-ink hover:text-mahogany transition-colors"
          >
            Cart
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={reduce ? false : { scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-mahogany font-body text-[10px] text-kora"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </nav>
      </header>

      {/* Mobile nav — top bar with hamburger */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-300 md:hidden ${
          scrolled
            ? "bg-kora/95 shadow-sm shadow-charcoal/5"
            : "bg-kora/80"
        } backdrop-blur-xl border-b border-charcoal/10`}
      >
        <Link
          href="/"
          className="font-heading text-lg text-ink"
        >
          Suti &amp; Thread
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center text-ink"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-mahogany font-body text-[10px] text-kora">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-ink"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        user={user}
        role={role}
      />
    </>
  );
}
