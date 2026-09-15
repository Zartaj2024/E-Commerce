import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile, getOrders } from "@/actions/account";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AccountPage() {
  const { success, profile, error } = await getProfile();
  if (!success) redirect("/login");

  const { orders } = await getOrders();
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-ink">Profile</h1>

      <div className="mb-8 rounded-lg border border-charcoal/20 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="font-body text-sm text-charcoal">Full name</p>
            <p className="font-body text-ink">
              {profile?.fullName || "Not set"}
            </p>
          </div>
          <div>
            <p className="font-body text-sm text-charcoal">Email</p>
            <p className="font-body text-ink">{profile?.email}</p>
          </div>
          <div>
            <p className="font-body text-sm text-charcoal">Role</p>
            <p className="font-body capitalize text-ink">
              {profile?.role ?? "customer"}
            </p>
          </div>
          <div>
            <p className="font-body text-sm text-charcoal">Member since</p>
            <p className="font-body text-ink">
              {profile?.createdAt ? formatDate(profile.createdAt) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent orders</h2>
          {orders.length > 5 && (
            <Link
              href="/account/orders"
              className="font-body text-sm text-mahogany hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-lg border border-charcoal/20 bg-white p-8 text-center">
            <p className="mb-4 font-body text-charcoal">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/products"
              className="inline-block rounded-lg bg-mahogany px-6 py-2.5 font-body text-sm text-kora transition-colors hover:bg-mahogany/90"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-charcoal/20 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal/10 bg-kora/50">
                  <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="font-body text-sm text-mahogany hover:underline"
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-charcoal">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-body text-sm text-ink">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
