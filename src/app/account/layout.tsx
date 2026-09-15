"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/account", label: "Profile", icon: "○" },
  { href: "/account/orders", label: "Orders", icon: "◻" },
  { href: "/account/custom-orders", label: "Custom orders", icon: "△" },
  { href: "/account/addresses", label: "Addresses", icon: "□" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <nav className="w-full shrink-0 md:w-56">
          <h2 className="mb-4 font-display text-lg text-ink">My account</h2>
          <ul className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-x-visible">
            {navItems.map((item) => {
              const isActive =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block rounded-lg px-3 py-2 font-body text-sm transition-colors",
                      isActive
                        ? "bg-mahogany/10 text-mahogany"
                        : "text-charcoal hover:bg-kora hover:text-ink",
                    ].join(" ")}
                  >
                    <span className="mr-2 inline-block w-4 text-center">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
