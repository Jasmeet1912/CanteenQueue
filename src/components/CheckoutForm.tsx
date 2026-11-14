"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState } from "react";
import { placeOrder } from "@/actions/orders";
import { useCart } from "@/lib/cart";

// Lazy loading: the slot picker JS is only fetched on the checkout page.
const SlotPicker = dynamic(() => import("./SlotPicker"), {
  loading: () => <p className="text-sm text-gray-500">Loading pickup times...</p>,
});

export default function CheckoutForm() {
  const { lines, total, ready } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, undefined);

  if (!ready) return null;
  if (lines.length === 0) {
    return (
      <p>
        Your cart is empty. <Link href="/menu" className="underline">Browse menu</Link>
      </p>
    );
  }

  const cart = JSON.stringify(lines.map((l) => ({ menuItemId: l.menuItemId, qty: l.qty })));

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="cart" value={cart} />
      <ul className="rounded border bg-white p-3 text-sm">
        {lines.map((l) => (
          <li key={l.menuItemId} className="flex justify-between">
            <span>{l.name} × {l.qty}</span>
            <span>₹{l.price * l.qty}</span>
          </li>
        ))}
        <li className="mt-2 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </li>
      </ul>

      <SlotPicker />

      <fieldset className="space-y-1">
        <legend className="font-medium">Payment (collected at the counter)</legend>
        <label className="mr-4"><input type="radio" name="payment" value="CASH" defaultChecked /> Cash</label>
        <label><input type="radio" name="payment" value="UPI" /> UPI</label>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
}
