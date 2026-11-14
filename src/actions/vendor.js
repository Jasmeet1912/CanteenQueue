"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { menuItems, orders } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { NEXT_STATUS } from "@/lib/status";

// ---------- MODULE 2: Vendor Order Management ----------

// PLACED -> PREPARING -> READY
export async function advanceOrder(orderId) {
  await requireUser("VENDOR");
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  const next = order && NEXT_STATUS[order.status];
  if (!order || !next) return;
  await db.update(orders).set({ status: next }).where(eq(orders.id, orderId));
  revalidatePath("/vendor");
  revalidatePath("/queue");
  revalidatePath("/counter");
}

// Mark an item sold out / back in stock. The static /menu page is refreshed.
export async function toggleAvailability(itemId) {
  await requireUser("VENDOR");
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, itemId));
  if (!item) return;
  await db.update(menuItems).set({ available: !item.available }).where(eq(menuItems.id, itemId));
  revalidatePath("/menu");
  revalidatePath("/vendor");
}
