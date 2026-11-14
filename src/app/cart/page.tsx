"use client";

import Link from "next/link";
import { setQty, useCart } from "@/lib/cart";

// Client-side rendered: the cart lives in the browser (localStorage).
export default function CartPage() {
  const { lines, total, ready } = useCart();

  if (!ready) return null;
  if (lines.length === 0) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/menu" className="underline">Browse menu</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cart</h1>
      <ul className="space-y-2">
        {lines.map((l) => (
          <li key={l.menuItemId} className="flex items-center gap-3 rounded border bg-white p-3">
            <span className="flex-1">{l.name}</span>
            <button onClick={() => setQty(l.menuItemId, l.qty - 1)} className="rounded border px-2">−</button>
            <span>{l.qty}</span>
            <button onClick={() => setQty(l.menuItemId, Math.min(10, l.qty + 1))} className="rounded border px-2">+</button>
            <span className="w-16 text-right">₹{l.price * l.qty}</span>
          </li>
        ))}
      </ul>
      <p className="text-right text-lg font-semibold">Total: ₹{total}</p>
      <div className="text-right">
        <Link href="/checkout" className="rounded bg-black px-4 py-2 text-white">
          Checkout
        </Link>
      </div>
    </div>
  );
}
