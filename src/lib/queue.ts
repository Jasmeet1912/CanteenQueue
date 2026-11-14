import "server-only";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db, type Tx } from "@/db";
import { orders } from "@/db/schema";
import { SLOTS } from "./status";

// ---------- MODULE 3: Queue & Payment Management ----------

export function today() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

// Token generation: 1, 2, 3 ... restarting every day.
// Called by Module 1 when an order is placed (the integration point).
export function nextToken(tx: Tx) {
  const row = tx
    .select({ max: sql<number | null>`max(${orders.tokenNumber})` })
    .from(orders)
    .where(eq(orders.orderDate, today()))
    .get();
  return (row?.max ?? 0) + 1;
}

// Queue sequence: by pickup slot first, then by token (first come first served).
// Used by the queue board, vendor dashboard and counter so they all agree.
export function getActiveOrders() {
  const slot = (s: string) => SLOTS.indexOf(s as (typeof SLOTS)[number]);
  return db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.orderDate, today()),
        inArray(orders.status, ["PLACED", "PREPARING", "READY"])
      )
    )
    .orderBy(asc(orders.tokenNumber))
    .all()
    .sort((a, b) => slot(a.pickupSlot) - slot(b.pickupSlot) || a.tokenNumber - b.tokenNumber);
}

export function getQueue() {
  const rows = getActiveOrders();
  return {
    ready: rows.filter((o) => o.status === "READY"),
    preparing: rows.filter((o) => o.status === "PREPARING"),
    waiting: rows.filter((o) => o.status === "PLACED"),
  };
}

export function markPaid(orderId: number) {
  const res = db
    .update(orders)
    .set({ paymentStatus: "PAID" })
    .where(and(eq(orders.id, orderId), inArray(orders.status, ["PLACED", "PREPARING", "READY"])))
    .run();
  return res.changes > 0;
}

// Pickup can only complete when the order is READY and PAID.
export function completePickup(orderId: number): { ok: boolean; error?: string } {
  const order = db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status !== "READY") return { ok: false, error: "Order is not ready yet" };
  if (order.paymentStatus !== "PAID") return { ok: false, error: "Payment not received" };
  db.update(orders).set({ status: "PICKED_UP" }).where(eq(orders.id, orderId)).run();
  return { ok: true };
}
