# Fifteen Minutes, One Samosa: Canteen Ordering and Queue Management

**Course:** INT257 – Modern Web Application Development (Next.js, App Router)
**Project ID:** P20

## Problem Statement

During short class breaks, food counters suffer from unclear queues, shouted orders and payment delays. Students abandon purchases and vendors lose sales. This app lets students order ahead, lets vendors prepare orders in sequence, and gives everyone a clear token-based queue.

## Modules and Ownership

| Module | Scope | Owner |
|---|---|---|
| Module 1 – Student Ordering | Browse menus, place orders, select pickup time/token | **Jessica** |
| Module 2 – Vendor Order Management | Receive orders, prepare them, update preparation/pickup status | Teammate 2 |
| Module 3 – Queue & Payment Management | Generate tokens, manage queue sequence, track payment/order completion | Teammate 3 |

**Integration flow:** Student order → Vendor preparation → Queue/token → Pickup completion.

---

## Module 1: Student Ordering

### Features
1. Student sign-up / login
2. Browse canteen menu (categories, search, item details)
3. Cart (add / remove / change quantity)
4. Choose pickup time slot
5. Place order and receive a token / order confirmation
6. "My Orders" page with live status (Placed → Preparing → Ready → Picked up)

### Routes (App Router)

```
/                          Landing page
/login, /register          Auth
/menu                      Menu listing (SSG + ISR)
/menu/[itemId]             Item details (dynamic route)
/cart                      Cart
/checkout                  Pickup slot + place order (protected)
/orders                    My orders (protected)
/orders/[orderId]          Order status / token (protected, SSR)
/api/menu                  GET menu items
/api/orders                GET (own orders), POST (create)
/api/orders/[orderId]      GET single order, PATCH (cancel)
```

### Planned Structure

```
src/
  app/
    (auth)/login, register
    (student)/menu, cart, checkout, orders
    api/menu, api/orders
    layout.tsx, loading.tsx, error.tsx, not-found.tsx
  components/   MenuCard, CartDrawer, SlotPicker, OrderStatusBadge
  lib/          db.ts, auth.ts, validators.ts
  actions/      placeOrder.ts, cartActions.ts
prisma/         schema.prisma
```

---

## Syllabus Mapping (Module 1 ↔ INT257)

### Unit I – Fundamentals, Routing and Navigation (CO1)
| Syllabus topic | Where used in Module 1 |
|---|---|
| App Router, project structure, dev workflow | Whole project uses `src/app` structure |
| File-based routing | `/menu`, `/cart`, `/checkout`, `/orders` |
| Dynamic routes | `/menu/[itemId]`, `/orders/[orderId]` |
| Nested routes and layouts | `(student)` route group with shared navbar/cart layout |
| Navigation | `Link`, `useRouter`, active nav state |
| Error and loading UI | `loading.tsx` skeletons for menu, `error.tsx` for failed orders, `not-found.tsx` |

### Unit II – Rendering and Data Fetching (CO2)
| Syllabus topic | Where used in Module 1 |
|---|---|
| SSG / ISR | Menu page is statically generated and revalidated when vendors update items |
| SSR | Order status page rendered fresh per request |
| Client-side rendering | Cart, slot picker, quantity controls |
| Server vs Client Components | Menu list = server; cart and forms = client |
| Fetch API, caching, revalidation | `fetch` with `next: { revalidate }` and `revalidateTag('menu')` |
| Rendering strategy selection | Documented comparison in `docs/rendering-strategies.md` |

### Unit III – APIs and Server Actions (CO3)
| Syllabus topic | Where used in Module 1 |
|---|---|
| Route Handlers, REST, HTTP methods | `/api/menu` (GET), `/api/orders` (GET, POST), `/api/orders/[orderId]` (GET, PATCH) |
| Dynamic route handlers | `/api/orders/[orderId]` |
| Request/response handling | Status codes, JSON errors, validation responses |
| Server Actions, form handling | `placeOrder` action for checkout form |
| Form validation | Zod schema: items, quantity, pickup slot |
| Data mutations | Create order, cancel order |
| Optimistic UI | Cart updates and order placement feedback with `useOptimistic` |
| File upload | Optional: student profile photo |

### Unit IV – Authentication and Database (CO4)
| Syllabus topic | Where used in Module 1 |
|---|---|
| Authentication, session management | Student login with session cookies (Auth.js or custom JWT) |
| Protected routes | `/checkout` and `/orders` require login (middleware/proxy) |
| Authorization, RBAC | Roles: `STUDENT`, `VENDOR`, `ADMIN`. Students see only their own orders |
| ORM basics, DB connectivity | Prisma + PostgreSQL/SQLite |
| CRUD operations | Users, MenuItems (read), Orders (create/read/update) |
| Data validation, env variables | Zod + `.env` (`DATABASE_URL`, `AUTH_SECRET`) |

### Unit V – Performance, SEO and Deployment (CO5)
| Syllabus topic | Where used in Module 1 |
|---|---|
| Image optimization | `next/image` for food photos |
| Metadata API | Per-page titles; dynamic metadata on `/menu/[itemId]` |
| Code splitting, lazy loading | `next/dynamic` for cart drawer and slot picker |
| SEO fundamentals | Semantic HTML, metadata, sitemap |
| Production build, env config | `next build`, separate dev/prod env files |
| Deployment, monitoring, error logging | Vercel deployment, error boundary logging |

### Unit VI – Advanced Features and Industry Practices (CO6)
| Syllabus topic | Where used in Module 1 |
|---|---|
| Intercepting / Parallel routes | Item details shown as modal over `/menu` (optional) |
| Project architecture, component organization | Folder structure above |
| Security best practices | Input validation, auth checks in every action/handler, no secrets in client |
| Testing overview | Unit tests for validators; basic API tests |

---

## Practicals Coverage (Module 1)

| # | Syllabus practical | Module 1 deliverable |
|---|---|---|
| 1 | Create Next.js app, explore App Router | Project setup and structure |
| 2 | File-based, nested, dynamic routing, layouts, loading/error UI | Menu, item, cart, orders routes |
| 3 | Server/client data fetching, compare rendering strategies | Menu (ISR) vs order status (SSR) vs cart (CSR) |
| 4 | Caching and revalidation | Menu cache + `revalidateTag` |
| 5 | REST APIs with Route Handlers | `/api/menu`, `/api/orders` |
| 6 | Forms, validation, file handling, Server Actions | Checkout form + `placeOrder` |
| 7 | ORM + CRUD | Prisma models for User, MenuItem, Order, OrderItem |
| 8 | Auth, sessions, protected routes, RBAC | Student login + role checks |
| 9 | Image optimization, metadata, code splitting, lazy loading | Menu images, metadata, dynamic imports |
| 10 | Build and deploy | Vercel deployment with env config |

---

## Integration Contract with Other Modules

Shared **Order** record, agreed with teammates:

```
Order {
  id, userId, status, pickupSlot, totalAmount,
  tokenNumber (set by Module 3),
  paymentStatus (managed by Module 3),
  createdAt
}
status: PLACED -> PREPARING -> READY -> PICKED_UP   (Module 2 updates)
```

- **Module 1 (me):** creates orders with `status = PLACED`, shows status to the student.
- **Module 2:** reads `PLACED` orders, updates status.
- **Module 3:** assigns `tokenNumber`, orders the queue, updates `paymentStatus`.

## Tech Stack
Next.js (App Router), TypeScript, Prisma, Zod, Auth.js, Tailwind CSS.

## Getting Started
```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

## Git Workflow
- `main`: stable. Each member works on `module-1-student`, `module-2-vendor`, `module-3-queue`.
- Open pull requests into `main`. Agree on the shared Prisma schema before changing it.
