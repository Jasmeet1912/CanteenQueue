import { notFound } from "next/navigation";
import AutoRefresh from "@/components/AutoRefresh";
import CancelOrderButton from "@/components/CancelOrderButton";
import ClearCartOnce from "@/components/ClearCartOnce";
import { getOrderWithItems } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Order status" };

// SSR: rendered fresh on every request (cookies are read) so status is always current.
export default async function OrderPage({ params, searchParams }) {
  const session = await requireUser("STUDENT");
  const { orderId } = await params;
  const { placed } = await searchParams;

  const order = Number.isInteger(Number(orderId)) ? await getOrderWithItems(Number(orderId)) : null;
  // Authorization: other students' orders look like "not found".
  if (!order || order.userId !== session.userId) notFound();

  const done = order.status === "PICKED_UP" || order.status === "CANCELLED";

  return (
    <div className="max-w-md space-y-4">
      {placed && <ClearCartOnce />}
      {!done && <AutoRefresh seconds={5} />}
      {placed && <p className="rounded bg-green-100 p-2 text-sm">Order placed! Show your token at the counter.</p>}

      <div className="rounded border bg-white p-6 text-center">
        <p className="text-sm text-gray-600">Your token</p>
        <p className="text-6xl font-bold">#{order.tokenNumber}</p>
        <p className="mt-2 text-sm">Pickup: {order.pickupSlot}</p>
      </div>

      <CancelOrderButton orderId={order.id} status={order.status} />

      <div className="rounded border bg-white p-3 text-sm">
        <ul>
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>{i.name} × {i.qty}</span>
              <span>₹{i.price * i.qty}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>₹{order.total}</span>
        </p>
        <p className="mt-2 text-gray-600">
          Payment: {order.paymentMethod} — {order.paymentStatus === "PAID" ? "Paid" : "Pay at counter"}
        </p>
      </div>
    </div>
  );
}
