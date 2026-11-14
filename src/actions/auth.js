"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function register(_prev, formData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password } = parsed.data;

  const [exists] = await db.select().from(users).where(eq(users.email, email));
  if (exists) return { error: "Email already registered" };

  // Public sign-up always creates a STUDENT. Vendors are seeded.
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash: bcrypt.hashSync(password, 10), role: "STUDENT" })
    .returning();
  await createSession(user.id, user.role);
  redirect("/menu");
}

export async function login(_prev, formData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return { error: "Wrong email or password" };
  }
  await createSession(user.id, user.role);
  redirect(user.role === "VENDOR" ? "/vendor" : "/menu");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
