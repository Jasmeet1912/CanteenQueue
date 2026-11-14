import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const client = createClient({ url: process.env.DATABASE_URL ?? "file:dev.db" });
const db = drizzle(client, { schema });

async function main() {
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.menuItems);
  await db.delete(schema.users);
  await client.execute("DELETE FROM sqlite_sequence"); // restart ids at 1 so reseeding is repeatable

  const hash = (p) => bcrypt.hashSync(p, 10);

  await db.insert(schema.users).values([
    { name: "Demo Student", email: "student@demo.com", passwordHash: hash("student123"), role: "STUDENT" },
    { name: "Canteen Vendor", email: "vendor@demo.com", passwordHash: hash("vendor123"), role: "VENDOR" },
  ]);

  await db.insert(schema.menuItems).values([
    { name: "Samosa", description: "Crispy potato samosa with chutney", category: "Snacks", price: 15 },
    { name: "Veg Puff", description: "Flaky pastry with spiced veg filling", category: "Snacks", price: 20 },
    { name: "Vada Pav", description: "Mumbai-style vada pav", category: "Snacks", price: 25 },
    { name: "Veg Sandwich", description: "Grilled sandwich with cheese", category: "Meals", price: 40 },
    { name: "Chole Bhature", description: "Two bhature with chole", category: "Meals", price: 60 },
    { name: "Maggi", description: "Masala Maggi", category: "Meals", price: 35 },
    { name: "Masala Chai", description: "Hot tea", category: "Drinks", price: 10 },
    { name: "Cold Coffee", description: "Iced coffee", category: "Drinks", price: 40 },
    { name: "Lemon Soda", description: "Fresh lime soda", category: "Drinks", price: 25 },
  ]);

  console.log("Seeded. Logins: student@demo.com / student123, vendor@demo.com / vendor123");
}

main().then(() => process.exit(0));
