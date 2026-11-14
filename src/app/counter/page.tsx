import type { Metadata } from "next";
import { recordPayment } from "@/actions/counter";
import AutoRefresh from "@/components/AutoRefresh";
import PickupButton from "@/components/PickupButton";
import StatusBadge from "@/components/StatusBadge";
import { getActiveOrders } from "@/lib/queue";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Counter" };

// MODULE 3: Queue & Payment Management - the counter screen
export default async function CounterPage() {
  await requireUser("VENDOR");

  const rows = getActiveOrders();

  return (
    <div className="space-y-4">
      <AutoRefresh seconds={5} />
      <h1 className="text-2xl font-bold">Counter: payment &amp; pickup</h1>
      <p className="text-sm text-gray-600">
        Take payment when the student arrives. Hand over only when the order is Ready and Paid.
      </p>
      {rows.length === 0 && <p>Queue is empty.</p>}
      {rows.map((o) => (
        <div key={o.id} className="flex items-center gap-4 rounded border bg-white p-3">
          <div className="w-16 text-center text-2xl font-bold">#{o.tokenNumber}</div>
          <div className="flex-1 text-sm">
            <p>Pickup {o.pickupSlot}</p>
            <p>₹{o.total} · {o.paymentMethod} · {o.paymentStatus === "PAID" ? "✅ Paid" : "❌ Unpaid"}</p>
          </div>
          <StatusBadge status={o.status} />
          {o.paymentStatus === "UNPAID" && (
            <form action={recordPayment.bind(null, o.id)}>
              <button className="rounded border px-3 py-1 text-sm">Mark paid</button>
            </form>
          )}
          <PickupButton orderId={o.id} />
        </div>
      ))}
    </div>
  );
}
