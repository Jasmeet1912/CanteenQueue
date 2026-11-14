import { cancelOrder, getOrderWithItems } from "@/lib/orders";
import { getSession } from "@/lib/session";

// GET /api/orders/:id -> one order (owner or vendor only)
export async function GET(_req, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not logged in" }, { status: 401 });

  const order = await getOrderWithItems(Number((await params).orderId));
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  if (session.role !== "VENDOR" && order.userId !== session.userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return Response.json(order);
}

// PATCH /api/orders/:id  body: { status: "CANCELLED" }
export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (body?.status !== "CANCELLED") {
    return Response.json({ error: "Only status CANCELLED is allowed" }, { status: 400 });
  }
  const ok = await cancelOrder(Number((await params).orderId), session.userId);
  if (!ok) return Response.json({ error: "Cannot cancel this order" }, { status: 409 });
  return Response.json({ ok: true });
}
