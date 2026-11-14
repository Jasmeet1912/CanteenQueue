"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { menuItems, orders } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { NEXT_STATUS } from "@/lib/status";

// ---------- MODULE 2: Vendor Order Management ----------

// PLACED -> PREPARING -> READY
export async function advanceOrder(orderId: number) {
  await requireUser("VENDOR");
  const order = db.select().from(orders).where(eq(orders.id, orderId)).get();
  const next = order && NEXT_STATUS[order.status];
  if (!order || !next) return;
  db.update(orders).set({ status: next }).where(eq(orders.id, orderId)).run();
  revalidatePath("/vendor");
  revalidatePath("/queue");
  revalidatePath("/counter");
}

// Mark an item sold out / back in stock. The static /menu page is refreshed.
export async function toggleAvailability(itemId: number) {
  await requireUser("VENDOR");
  const item = db.select().from(menuItems).where(eq(menuItems.id, itemId)).get();
  if (!item) return;
  db.update(menuItems).set({ available: !item.available }).where(eq(menuItems.id, itemId)).run();
  revalidatePath("/menu");
  revalidatePath("/vendor");
}
