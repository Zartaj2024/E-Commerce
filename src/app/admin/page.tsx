import { Metadata } from "next";
import { StatBox } from "@/components/admin/StatBox";
import { getAdminStats } from "@/actions/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard — Suti & Thread",
};

export default async function AdminDashboardPage() {
  const result = await getAdminStats();

  const stats = result.success
    ? result.stats
    : { totalOrders: 0, totalRevenue: 0, pendingCustomOrders: 0, activeProducts: 0 };

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox
          icon="📦"
          label="Total orders"
          value={stats.totalOrders}
        />
        <StatBox
          icon="💰"
          label="Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString("en-PK")}`}
        />
        <StatBox
          icon="🎨"
          label="Pending custom orders"
          value={stats.pendingCustomOrders}
        />
        <StatBox
          icon="🧵"
          label="Active products"
          value={stats.activeProducts}
        />
      </div>
    </div>
  );
}
