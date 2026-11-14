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

// Used by both the checkout Server Action and POST /api/orders.
// Prices always come from the database, never from the browser.
export async function createOrder(userId, input) {
  return db.transaction(async (tx) => {
    const ids = input.items.map((i) => i.menuItemId);
    const rows = await tx.select().from(menuItems).where(inArray(menuItems.id, ids));

    let total = 0;
    const lines = [];
    for (const item of input.items) {
      const m = rows.find((r) => r.id === item.menuItemId);
      if (!m || !m.available) {
        return { ok: false , error: `${m?.name ?? "An item"} is not available` };
      }
      total += m.price * item.qty;
      lines.push({ menuItemId: m.id, name: m.name, price: m.price, qty: item.qty });
    }

    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        pickupSlot: input.slot,
        total,
        orderDate: today(),
        tokenNumber: await nextToken(tx), // Module 3 generates the token
        paymentMethod: input.payment,
      })
      .returning();

    await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
    return { ok: true , order };
  });
}

export async function getOrderWithItems(orderId) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { ...order, items };
}

export async function cancelOrder(orderId, userId) {
  const res = await db
    .update(orders)
    .set({ status: "CANCELLED" })
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId), eq(orders.status, "PLACED")));
  return res.rowsAffected > 0;
}
