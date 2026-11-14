# Fifteen Minutes, One Samosa: Canteen Ordering and Queue Management

**Course:** INT257 (Next.js, App Router) · **Project:** P20

During short breaks, canteen counters suffer from unclear queues, shouted orders and payment delays. This app lets students order ahead, lets the vendor prepare orders, and gives everyone a token-based queue.

**Flow:** Student order → Vendor preparation → Queue/token → Pickup completion.

## Run it

```bash
npm install
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

Code map: `src/lib/orders.ts` (Module 1) · `src/actions/vendor.ts` (Module 2) · `src/lib/queue.ts` + `src/actions/counter.ts` (Module 3) · `src/db/schema.ts` (shared).

## Syllabus mapping (INT257)

### Unit I: Fundamentals, Routing and Navigation
| Topic | Where |
|---|---|
| App Router, project structure | `src/app`, `src/components`, `src/lib`, `src/actions`, `src/db` |
| File-based routing | `/menu`, `/cart`, `/checkout`, `/orders`, `/vendor`, `/counter`, `/queue` |
| Dynamic routes | `/menu/[itemId]`, `/orders/[orderId]`, `/api/orders/[orderId]` |
| Route groups and layouts | `(auth)` group for login/register; root `layout.tsx` with navbar |
| Navigation | `Link`, `usePathname` (active link in `AuthLinks.tsx`) |
| Loading, error and not-found UI | `loading.tsx`, `orders/loading.tsx`, `error.tsx`, `not-found.tsx` |

### Unit II: Rendering and Data Fetching
| Topic | Where |
|---|---|
| SSG | `/menu/[itemId]` via `generateStaticParams` |
| ISR / revalidation | `/menu` has `revalidate = 60`; vendor "sold out" calls `revalidatePath("/menu")` |
| SSR | `/orders/[orderId]`, `/vendor`, `/counter`, `/queue` (rendered on every request) |
| CSR | `/cart` (cart lives in the browser's localStorage) |
| Server vs Client Components | Pages are server components; `AddToCartButton`, `CheckoutForm`, `AutoRefresh` are client components |
| Live updates | `AutoRefresh` calls `router.refresh()` every 5 s |

### Unit III: APIs and Server Actions
| Topic | Where |
|---|---|
| Route Handlers, HTTP methods | `GET /api/menu`, `GET/POST /api/orders`, `GET/PATCH /api/orders/[orderId]`, `GET /api/me` |
| Status codes and error handling | 400 invalid, 401 not logged in, 403 forbidden, 404 not found, 409 conflict, 201 created |
| Server Actions | `placeOrder`, `cancelMyOrder`, `advanceOrder`, `toggleAvailability`, `recordPayment`, `finishPickup`, `login`, `register`, `logout` |
| Forms and validation | Zod schemas in `src/lib/orders.ts` and `src/actions/auth.ts`; `useActionState` shows errors |
| Optimistic UI | `CancelOrderButton` (`useOptimistic`) |

### Unit IV: Authentication and Database
| Topic | Where |
|---|---|
| Authentication, sessions | `src/lib/session.ts`: signed JWT in an httpOnly cookie (`jose`), passwords hashed with `bcryptjs` |
| Protected routes | `src/proxy.ts` (optimistic check) + `requireUser()` in every protected page/action |
| Authorization / RBAC | Roles `STUDENT` and `VENDOR`. Students can only read their own orders; vendor pages are vendor-only |
| ORM and DB connection | Drizzle ORM + SQLite (`src/db/`) |
| CRUD | Users (create/read), menu items (read/update), orders (create/read/update) |
| Env variables | `.env` with `DATABASE_URL` and `AUTH_SECRET` |

### Unit V: Performance, SEO and Deployment
| Topic | Where |
|---|---|
| Image optimization | `next/image` on menu and item pages |
| Metadata API | Title template in `layout.tsx`; `generateMetadata` on `/menu/[itemId]` |
| Code splitting, lazy loading | `next/dynamic` for `SlotPicker` in `CheckoutForm.tsx` |
| Production build | `npm run build` / `npm start` |
| Error logging | `error.tsx` logs the error (replace with a monitoring service in production) |

### Unit VI: Advanced Features and Industry Practices
| Topic | Where |
|---|---|
| Project architecture | Folder layout above; logic in `lib/`, mutations in `actions/` |
| Security practices | Prices always read from the DB (never trusted from the browser), Zod validation, auth check in every action/handler, httpOnly cookies, secrets in `.env` |

### Not included (kept simple)
File upload, intercepting/parallel routes and automated unit tests are not built. Real online payment is not integrated either: payment is recorded by the vendor at the counter.

## Team split

| Module | Owner |
|---|---|
| 1. Student Ordering | Jessica |
| 2. Vendor Order Management | _Teammate 2_ |
| 3. Queue & Payment Management | _Teammate 3_ |

## Tech stack
Next.js (App Router), TypeScript, Tailwind CSS, Drizzle ORM, SQLite (better-sqlite3), Zod, jose, bcryptjs.

## Deploying
SQLite is a local file, so it works for a demo on your own machine or a VM. Serverless hosts like Vercel have no persistent disk. To deploy there, switch Drizzle to a hosted database (Turso or Postgres) and set `DATABASE_URL` and `AUTH_SECRET`.
