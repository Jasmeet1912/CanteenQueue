"use client";

import Link from "next/link";
import { setQty, useCart } from "@/lib/cart";

export default function CartPage() {
  const { lines, total, ready } = useCart();

  if (!ready) return null;

  if (lines.length === 0) {
    return (
      <div className="cart-page">
        <header className="page-heading">
          <span className="eyebrow">A good lunch starts here</span>
          <h1 className="cart-title">Your bag</h1>
          <p>Your picks will be waiting here while you decide.</p>
        </header>
        <section className="cart-empty">
          <span className="empty-mark" aria-hidden="true">00</span>
          <h2>Your bag is taking a break</h2>
          <p>Have a look through the menu and add something tasty.</p>
          <Link href="/menu" className="page-action">Browse the menu <span aria-hidden="true">→</span></Link>
        </section>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="page-heading">
        <span className="eyebrow">One last look</span>
        <h1 className="cart-title">Your bag</h1>
        <p>Adjust your picks before choosing a pickup time.</p>
      </header>

      <div className="cart-layout">
        <section className="cart-items-panel" aria-label="Items in your bag">
          <div className="cart-panel-heading">
            <h2>Your picks</h2>
            <span>{lines.reduce((count, line) => count + line.qty, 0)} items</span>
          </div>
          <ul className="cart-items">
            {lines.map((line) => (
              <li key={line.menuItemId} className="cart-item">
                <div className="cart-item-mark" aria-hidden="true">CQ</div>
                <div className="cart-item-details">
                  <strong>{line.name}</strong>
                  <span>₹{line.price} each</span>
                </div>
                <div className="quantity-control" aria-label={`Quantity of ${line.name}`}>
                  <button
                    type="button"
                    onClick={() => setQty(line.menuItemId, line.qty - 1)}
                    aria-label={`Remove one ${line.name}`}
                  >−</button>
                  <span>{line.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(line.menuItemId, Math.min(10, line.qty + 1))}
                    aria-label={`Add one ${line.name}`}
                    disabled={line.qty >= 10}
                  >+</button>
                </div>
                <strong className="cart-line-total">₹{line.price * line.qty}</strong>
              </li>
            ))}
          </ul>
          <Link href="/menu" className="keep-browsing"><span aria-hidden="true">←</span> Keep browsing</Link>
        </section>

        <aside className="cart-summary">
          <span className="eyebrow">Order summary</span>
          <h2>Nearly yours.</h2>
          <div className="summary-row"><span>Items</span><span>₹{total}</span></div>
          <div className="summary-row"><span>Pickup</span><span>Choose at checkout</span></div>
          <div className="summary-total"><span>Total</span><strong>₹{total}</strong></div>
          <p>Payment is collected at the counter when you pick up.</p>
          <Link href="/checkout" className="checkout-action">Choose a pickup time <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </div>
  );
}
