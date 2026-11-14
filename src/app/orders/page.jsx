import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireUser } from "@/lib/session";
import StatusBadge from "@/components/StatusBadge";

export const metadata = { title: "My orders" };

export default async function OrdersPage() {
  const session = await requireUser("STUDENT");
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.userId))
    .orderBy(desc(orders.id));

  return (
    <div className="orders-page">
      <header className="page-heading">
        <span className="eyebrow">Your lunch, all in one place</span>
        <h1 className="orders-title">My orders</h1>
        <p>Keep an eye on your tokens and pickup times.</p>
      </header>

      {myOrders.length === 0 ? (
        <section className="orders-empty">
          <span className="empty-mark" aria-hidden="true">01</span>
          <h2>No orders yet</h2>
          <p>Your next canteen favourite is only a few clicks away.</p>
          <Link href="/menu" className="page-action">Browse the menu <span aria-hidden="true">→</span></Link>
        </section>
      ) : (
        <ul className="orders-list">
          {myOrders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-token" aria-label={`Token ${order.tokenNumber}`}>
                <span>YOUR TOKEN</span>
                <strong>#{order.tokenNumber}</strong>
              </div>
              <div className="order-details">
                <Link href={`/orders/${order.id}`} className="order-link">Order details <span aria-hidden="true">↗</span></Link>
                <p>{order.orderDate} <span aria-hidden="true">·</span> Pickup at {order.pickupSlot}</p>
              </div>
              <div className="order-summary">
                <strong>₹{order.total}</strong>
                <StatusBadge status={order.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
