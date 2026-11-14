import { getSession } from "@/lib/session";

// Tells the navbar who is logged in (keeps the other pages static-friendly).
export async function GET() {
  const session = await getSession();
  return Response.json({ role: session?.role ?? null });
}
