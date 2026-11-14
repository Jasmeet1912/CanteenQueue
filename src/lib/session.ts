import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secret = process.env.AUTH_SECRET;
if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("AUTH_SECRET must be set in production");
}
const key = new TextEncoder().encode(secret ?? "dev-only-secret-change-me");

export type Session = { userId: number; role: "STUDENT" | "VENDOR" };

export async function createSession(userId: number, role: Session["role"]) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key);
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return { userId: payload.userId as number, role: payload.role as Session["role"] };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

// Data-access-layer helpers: call these inside every page, action and handler.
export async function requireUser(role?: Session["role"]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role && session.role !== role) redirect("/");
  return session;
}
