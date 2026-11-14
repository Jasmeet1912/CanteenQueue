import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireUser } from "@/lib/session";
import StatusBadge from "@/components/StatusBadge";

export const metadata = { title: "My orders" };

export default async function OrdersPage() {
  const session = await requireUser("STUDENT");
  // Authorization: a student only ever queries their own orders.
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.userId))
    .orderBy(desc(orders.id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My orders</h1>
      {myOrders.length === 0 && <p>No orders yet. <Link href="/menu" className="underline">Order now</Link></p>}
      <ul className="space-y-2">
        {myOrders.map((o) => (
          <li key={o.id} className="flex items-center gap-4 rounded border bg-white p-3">
            <Link href={`/orders/${o.id}`} className="font-semibold underline">
              Token #{o.tokenNumber}
            </Link>
            <span className="flex-1 text-sm">{o.orderDate} · {o.pickupSlot} · ₹{o.total}</span>
            <StatusBadge status={o.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
