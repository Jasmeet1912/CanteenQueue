"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { cancelOrder, createOrder, orderInput } from "@/lib/orders";

// MODULE 1: checkout form -> Server Action
export async function placeOrder(_prev, formData) {
  const session = await requireUser("STUDENT");

  let items;
  try {
    items = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    return { error: "Invalid cart" };
  }

  const parsed = orderInput.safeParse({
    items,
    slot: formData.get("slot"),
    payment: formData.get("payment"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const result = await createOrder(session.userId, parsed.data);
  if (!result.ok) return { error: result.error };

  revalidatePath("/queue");
  redirect(`/orders/${result.order.id}?placed=1`);
}

export async function cancelMyOrder(orderId) {
  const session = await requireUser("STUDENT");
  const ok = await cancelOrder(orderId, session.userId);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/queue");
  return ok;
}
