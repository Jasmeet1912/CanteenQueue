import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// ---- Shared by all 3 modules ----

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["STUDENT", "VENDOR"] }).notNull().default("STUDENT"),
});

export const menuItems = sqliteTable("menu_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  price: integer("price").notNull(), // rupees
  available: integer("available", { mode: "boolean" }).notNull().default(true),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  // Module 1 creates (PLACED). Module 2 moves PLACED -> PREPARING -> READY.
  // Module 3 completes (PICKED_UP) after payment.
  status: text("status", {
    enum: ["PLACED", "PREPARING", "READY", "PICKED_UP", "CANCELLED"],
  }).notNull().default("PLACED"),
  pickupSlot: text("pickup_slot").notNull(),
  total: integer("total").notNull(),
  // Module 3: token + payment
  orderDate: text("order_date").notNull(), // tokens restart every day
  tokenNumber: integer("token_number").notNull(),
  paymentMethod: text("payment_method", { enum: ["CASH", "UPI"] }).notNull(),
  paymentStatus: text("payment_status", { enum: ["UNPAID", "PAID"] })
    .notNull()
    .default("UNPAID"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  qty: integer("qty").notNull(),
});
