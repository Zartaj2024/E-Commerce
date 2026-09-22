"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

const quickLinks = [
  { href: "/products", label: "Products" },
  { href: "/custom-order", label: "Custom order" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Account" },
];

export function Footer() {
  const reduce = useReducedMotion();

  return (
    <motion.footer
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-auto border-t border-charcoal/20 bg-kora"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="font-heading text-xl text-ink hover:text-mahogany transition-colors"
            >
              Suti &amp; Thread
            </Link>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-charcoal">
              Made by hand, one piece at a time. Hand-embroidered products and
              custom commissions.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-sm text-ink">Quick links</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center font-body text-sm text-charcoal hover:text-mahogany transition-colors"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-mahogany transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-sm text-ink">Stay in the loop</h3>
            <p className="mt-4 font-body text-sm text-charcoal">
              New pieces and custom order updates, delivered occasionally.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border-b border-charcoal/30 bg-transparent px-0 py-2 font-body text-sm text-ink placeholder:text-charcoal/50 focus:border-peacock focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="rounded bg-mahogany px-4 py-2 font-body text-xs text-kora hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal/20 px-6 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-body text-xs text-charcoal">
            &copy; {new Date().getFullYear()} Suti &amp; Thread. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <span className="font-body text-xs text-charcoal/50">
              Privacy policy
            </span>
            <span className="font-body text-xs text-charcoal/50">
              Terms of service
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
