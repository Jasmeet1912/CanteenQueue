"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { completePickup, markPaid } from "@/lib/queue";

// ---------- MODULE 3: Queue & Payment Management ----------

function refresh() {
  revalidatePath("/counter");
  revalidatePath("/queue");
  revalidatePath("/vendor");
}

export async function recordPayment(orderId: number) {
  await requireUser("VENDOR");
  markPaid(orderId);
  refresh();
}

export async function finishPickup(orderId: number): Promise<{ error?: string }> {
  await requireUser("VENDOR");
  const res = completePickup(orderId);
  refresh();
  return res.ok ? {} : { error: res.error };
}
