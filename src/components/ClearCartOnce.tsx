"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

// Shown on the confirmation page right after an order is placed.
export default function ClearCartOnce() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
