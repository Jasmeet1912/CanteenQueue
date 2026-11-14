"use client";

import { useSyncExternalStore } from "react";

const KEY = "canteen-cart";
const EMPTY = [];

// The cart lives in localStorage. We cache the parsed value so React gets a
// stable reference until the stored text actually changes.
let cache = { raw: "[]", lines: EMPTY };

function read() {
  let raw = "[]";
  try {
    raw = localStorage.getItem(KEY) ?? "[]";
  } catch {}
  if (raw !== cache.raw) {
    let lines = EMPTY;
    try {
      lines = JSON.parse(raw);
    } catch {}
    cache = { raw, lines };
  }
  return cache.lines;
}

function write(lines) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {}
  window.dispatchEvent(new Event("cart-changed"));
}

function subscribe(onChange) {
  window.addEventListener("cart-changed", onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener("cart-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function addToCart(item) {
  const lines = read().map((l) => ({ ...l }));
  const found = lines.find((l) => l.menuItemId === item.menuItemId);
  if (found) found.qty = Math.min(10, found.qty + 1);
  else lines.push({ ...item, qty: 1 });
  write(lines);
}

export function setQty(menuItemId, qty) {
  write(
    read()
      .map((l) => (l.menuItemId === menuItemId ? { ...l, qty } : l))
      .filter((l) => l.qty > 0)
  );
}

export function clearCart() {
  write([]);
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  // false on the server / first render, true once running in the browser
  const ready = useSyncExternalStore(() => () => {}, () => true, () => false);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, total, count, ready };
}
