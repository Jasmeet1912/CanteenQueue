# Fifteen Minutes, One Samosa: Canteen Ordering and Queue Managementt

**Course:** INT257 (Next.js, App Router) · **Project:** P20

During short breaks, canteen counters suffer from unclear queues, shouted orders and payment delays. This app lets students order ahead, lets the vendor prepare orders, and gives everyone a token-based queue.

**Flow:** Student order → Vendor preparation → Queue/token → Pickup completion.

## Run it

```bash
npm install   # needs Node 20 or newer
cp .env.example .env     # Windows: copy .env.example .env
npm run setup            # creates dev.db and seeds demo data
npm run dev              # http://localhost:3000
```

Demo logins (after `npm run setup`):

| Role | Email | Password |
|---|---|---|
| Student | student@demo.com | student123 |
| Vendor | vendor@demo.com | vendor123 |

To reset the data any time: `npm run db:seed`.

## Modules

| Module | Who uses it | Pages / API |
|---|---|---|
| **1. Student Ordering** | Student | `/menu`, `/menu/[itemId]`, `/cart`, `/checkout`, `/orders`, `/orders/[orderId]`, `/api/menu`, `/api/orders`, `/api/orders/[orderId]` |
| **2. Vendor Order Management** | Vendor | `/vendor` (incoming orders, Start preparing → Mark ready, sold-out toggle) |
| **3. Queue & Payment Management** | Vendor + public | `/queue` (public token board), `/counter` (mark paid, hand over) |

How they connect (one shared `orders` table):

1. Student places an order → Module 1 saves it as `PLACED` and Module 3's `nextToken()` gives it a token (1, 2, 3 ... restarting each day).
2. Vendor moves it `PLACED → PREPARING → READY` (Module 2).
3. Queue board shows tokens ordered by pickup slot, then token number (Module 3).
4. At the counter the vendor marks it paid. Hand-over only works when the order is `READY` **and** `PAID`, then it becomes `PICKED_UP`.

Code map: `src/lib/orders.js` (Module 1) · `src/actions/vendor.js` (Module 2) · `src/lib/queue.js` + `src/actions/counter.js` (Module 3) · `src/db/schema.js` (shared).

## Team split

| Module | Owner |
|---|---|
| 1. Student Ordering | Jasmeet Oberoi |
| 2. Vendor Order Management | Sahil Kumar |
| 3. Queue & Payment Management | Sesha Reddy Ekkuluri |

## Tech stack
Next.js (App Router), Tailwind CSS, Drizzle ORM, SQLite (libsql), Zod, jose, bcryptjs.

## Deploying
SQLite is a local file, so it works for a demo on your own machine or a VM. Serverless hosts like Vercel have no persistent disk. To deploy there, switch Drizzle to a hosted database (Turso or Postgres) and set `DATABASE_URL` and `AUTH_SECRET`.
