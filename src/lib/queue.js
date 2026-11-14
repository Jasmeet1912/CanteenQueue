import "server-only";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { SLOTS } from "./status";

// ---------- MODULE 3: Queue & Payment Management ----------

export function today() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

// Token generation: 1, 2, 3 ... restarting every day.
// Called by Module 1 when an order is placed (the integration point).
export async function nextToken(tx) {
  const [row] = await tx
    .select({ max: sql`max(${orders.tokenNumber})` })
    .from(orders)
    .where(eq(orders.orderDate, today()));
  return (row?.max ?? 0) + 1;
}

// Used by the queue board, vendor dashboard and counter so they all agree.
export async function getActiveOrders() {
  const slot = (s) => SLOTS.indexOf(s);
  const rows = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.orderDate, today()),
        inArray(orders.status, ["PLACED", "PREPARING", "READY"])
      )
    )
    .orderBy(asc(orders.tokenNumber));
  // Queue sequence: by pickup slot first, then by token (first come first served).
  return rows.sort((a, b) => slot(a.pickupSlot) - slot(b.pickupSlot) || a.tokenNumber - b.tokenNumber);
}

export async function getQueue() {
  const rows = await getActiveOrders();
  return {
    ready: rows.filter((o) => o.status === "READY"),
    preparing: rows.filter((o) => o.status === "PREPARING"),
    waiting: rows.filter((o) => o.status === "PLACED"),
  };
}

export async function markPaid(orderId) {
  const res = await db
    .update(orders)
    .set({ paymentStatus: "PAID" })
    .where(and(eq(orders.id, orderId), inArray(orders.status, ["PLACED", "PREPARING", "READY"])));
  return res.rowsAffected > 0;
}

// Pickup can only complete when the order is READY and PAID.
export async function completePickup(orderId) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status !== "READY") return { ok: false, error: "Order is not ready yet" };
  if (order.paymentStatus !== "PAID") return { ok: false, error: "Payment not received" };
  await db.update(orders).set({ status: "PICKED_UP" }).where(eq(orders.id, orderId));
  return { ok: true };
}
