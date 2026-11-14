import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { createOrder, orderInput } from "@/lib/orders";
import { getSession } from "@/lib/session";

// GET /api/orders -> my orders
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not logged in" }, { status: 401 });

  const rows = db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.userId))
    .orderBy(desc(orders.id))
    .all();
  return Response.json(rows);
}

// POST /api/orders  body: { items:[{menuItemId,qty}], slot, payment }
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not logged in" }, { status: 401 });
  if (session.role !== "STUDENT") return Response.json({ error: "Students only" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = orderInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const result = createOrder(session.userId, parsed.data);
  if (!result.ok) return Response.json({ error: result.error }, { status: 409 });
  return Response.json(result.order, { status: 201 });
}
