import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";

// GET /api/menu -> available menu items
export async function GET() {
  const items = await db.select().from(menuItems).where(eq(menuItems.available, true));
  return Response.json(items);
}
