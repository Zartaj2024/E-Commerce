"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { logout } from "@/actions/auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ href: string; label: string }>;
  user: { email: string } | null;
  role: string | null;
}

export function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  user,
  role,
}: MobileMenuProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-kora/95 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="font-heading text-xl text-ink"
              onClick={onClose}
            >
              Suti &amp; Thread
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink"
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 5l10 10M15 5l-10 10" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-start px-6 py-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduce ? 0 : i * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full"
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block border-b border-charcoal/10 py-4 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {user ? (
              <>
                {role === "admin" && (
                  <motion.div
                    initial={
                      reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduce ? 0 : navLinks.length * 0.05,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full"
                  >
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className="block border-b border-charcoal/10 py-4 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}
                <motion.div
                  initial={
                    reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce
                      ? 0
                      : (navLinks.length + (role === "admin" ? 1 : 0)) * 0.05,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full"
                >
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="block border-b border-charcoal/10 py-4 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
                  >
                    Account
                  </Link>
                </motion.div>
                <motion.div
                  initial={
                    reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce
                      ? 0
                      : (navLinks.length + (role === "admin" ? 2 : 1)) * 0.05,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="border-b border-charcoal/10 py-4 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
                  >
                    Log out
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={
                  reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduce ? 0 : navLinks.length * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full"
              >
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block border-b border-charcoal/10 py-4 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
                >
                  Log in
                </Link>
              </motion.div>
            )}

            <motion.div
              initial={
                reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce
                  ? 0
                  : (navLinks.length + (user ? (role === "admin" ? 3 : 2) : 1)) *
                      0.05,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <Link
                href="/cart"
                onClick={onClose}
                className="block py-4 font-heading text-2xl text-ink hover:text-mahogany transition-colors"
              >
                Cart
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
