import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";

// GET /api/menu -> available menu items
export async function GET() {
  const items = db.select().from(menuItems).where(eq(menuItems.available, true)).all();
  return Response.json(items);
}
