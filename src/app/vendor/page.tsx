import type { Metadata } from "next";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { menuItems, orderItems } from "@/db/schema";
import { advanceOrder, toggleAvailability } from "@/actions/vendor";
import AutoRefresh from "@/components/AutoRefresh";
import StatusBadge from "@/components/StatusBadge";
import { getActiveOrders } from "@/lib/queue";
import { requireUser } from "@/lib/session";
import { NEXT_STATUS } from "@/lib/status";

export const metadata: Metadata = { title: "Vendor dashboard" };

// MODULE 2: Vendor Order Management (SSR + auto refresh)
export default async function VendorPage() {
  await requireUser("VENDOR");

  const active = getActiveOrders();

  const items = active.length
    ? db.select().from(orderItems).where(inArray(orderItems.orderId, active.map((o) => o.id))).all()
    : [];
  const menu = db.select().from(menuItems).all();

  return (
    <div className="space-y-8">
      <AutoRefresh seconds={5} />
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Incoming orders</h1>
        {active.length === 0 && <p>No active orders.</p>}
        {active.map((o) => {
          const next = NEXT_STATUS[o.status];
          return (
            <div key={o.id} className="flex items-center gap-4 rounded border bg-white p-3">
              <div className="w-16 text-center text-2xl font-bold">#{o.tokenNumber}</div>
              <div className="flex-1 text-sm">
                <p className="text-gray-600">Pickup {o.pickupSlot}</p>
                <ul>
                  {items.filter((i) => i.orderId === o.id).map((i) => (
                    <li key={i.id}>{i.name} × {i.qty}</li>
                  ))}
                </ul>
              </div>
              <StatusBadge status={o.status} />
              {next && (
                <form action={advanceOrder.bind(null, o.id)}>
                  <button className="rounded bg-black px-3 py-1 text-sm text-white">
                    {next === "PREPARING" ? "Start preparing" : "Mark ready"}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Menu availability</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {menu.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded border bg-white p-2 text-sm">
              <span className={m.available ? "" : "text-gray-400 line-through"}>{m.name}</span>
              <form action={toggleAvailability.bind(null, m.id)}>
                <button className="rounded border px-2 py-0.5">
                  {m.available ? "Mark sold out" : "Back in stock"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
