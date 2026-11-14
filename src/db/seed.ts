import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL ?? "dev.db");
const db = drizzle(sqlite, { schema });

db.delete(schema.orderItems).run();
db.delete(schema.orders).run();
db.delete(schema.menuItems).run();
db.delete(schema.users).run();
sqlite.exec("DELETE FROM sqlite_sequence"); // restart ids at 1 so reseeding is repeatable

const hash = (p: string) => bcrypt.hashSync(p, 10);

db.insert(schema.users).values([
  { name: "Demo Student", email: "student@demo.com", passwordHash: hash("student123"), role: "STUDENT" },
  { name: "Canteen Vendor", email: "vendor@demo.com", passwordHash: hash("vendor123"), role: "VENDOR" },
]).run();

db.insert(schema.menuItems).values([
  { name: "Samosa", description: "Crispy potato samosa with chutney", category: "Snacks", price: 15 },
  { name: "Veg Puff", description: "Flaky pastry with spiced veg filling", category: "Snacks", price: 20 },
  { name: "Vada Pav", description: "Mumbai-style vada pav", category: "Snacks", price: 25 },
  { name: "Veg Sandwich", description: "Grilled sandwich with cheese", category: "Meals", price: 40 },
  { name: "Chole Bhature", description: "Two bhature with chole", category: "Meals", price: 60 },
  { name: "Maggi", description: "Masala Maggi", category: "Meals", price: 35 },
  { name: "Masala Chai", description: "Hot tea", category: "Drinks", price: 10 },
  { name: "Cold Coffee", description: "Iced coffee", category: "Drinks", price: 40 },
  { name: "Lemon Soda", description: "Fresh lime soda", category: "Drinks", price: 25 },
]).run();

console.log("Seeded. Logins: student@demo.com / student123, vendor@demo.com / vendor123");
