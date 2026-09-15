"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🧵" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/custom-orders", label: "Custom Orders", icon: "🎨" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-charcoal/20 bg-ink">
      <div className="px-6 py-5">
        <Link
          href="/admin"
          className="font-heading text-lg text-kora hover:text-zari-gold transition-colors"
        >
          Suti &amp; Thread
        </Link>
        <p className="mt-0.5 font-body text-xs text-charcoal">Admin panel</p>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "mb-1 flex items-center gap-2.5 rounded px-3 py-2.5 font-body text-sm transition-colors",
                isActive
                  ? "bg-kora/10 text-kora"
                  : "text-charcoal hover:bg-kora/5 hover:text-kora",
              ].join(" ")}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-charcoal/20 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded px-3 py-2 font-body text-xs text-charcoal hover:text-kora transition-colors"
        >
          ← Back to shop
        </Link>
      </div>
    </aside>
  );
}
