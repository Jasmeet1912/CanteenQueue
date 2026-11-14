import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { menuItems, orderItems, orders } from "@/db/schema";
import { SLOTS } from "./status";
import { nextToken, today } from "./queue";

// ---------- MODULE 1: Student Ordering ----------

export const orderInput = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.number().int().positive(),
        qty: z.number().int().min(1).max(10),
      })
    )
    .min(1, "Your cart is empty"),
  slot: z.enum(SLOTS, { error: "Pick a pickup time" }),
  payment: z.enum(["CASH", "UPI"], { error: "Pick a payment method" }),
});
export type OrderInput = z.infer<typeof orderInput>;

// Used by both the checkout Server Action and POST /api/orders.
// Prices always come from the database, never from the browser.
export function createOrder(userId: number, input: OrderInput) {
  return db.transaction((tx) => {
    const ids = input.items.map((i) => i.menuItemId);
    const rows = tx.select().from(menuItems).where(inArray(menuItems.id, ids)).all();

    let total = 0;
    const lines = [];
    for (const item of input.items) {
      const m = rows.find((r) => r.id === item.menuItemId);
      if (!m || !m.available) {
        return { ok: false as const, error: `${m?.name ?? "An item"} is not available` };
      }
      total += m.price * item.qty;
      lines.push({ menuItemId: m.id, name: m.name, price: m.price, qty: item.qty });
    }

    const order = tx
      .insert(orders)
      .values({
        userId,
        pickupSlot: input.slot,
        total,
        orderDate: today(),
        tokenNumber: nextToken(tx), // Module 3 generates the token
        paymentMethod: input.payment,
      })
      .returning()
      .get();

    tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id }))).run();
    return { ok: true as const, order };
  });
}

export function getOrderWithItems(orderId: number) {
  const order = db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return null;
  const items = db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).all();
  return { ...order, items };
}

export function cancelOrder(orderId: number, userId: number) {
  const res = db
    .update(orders)
    .set({ status: "CANCELLED" })
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId), eq(orders.status, "PLACED")))
    .run();
  return res.changes > 0;
}
