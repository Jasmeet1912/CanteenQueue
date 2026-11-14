"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/actions/auth";
import { useCart } from "@/lib/cart";

// Client component: asks /api/me who is logged in, so the layout stays static.
export default function AuthLinks() {
  const [role, setRole] = useState<string | null | undefined>(undefined);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setRole(d.role))
      .catch(() => setRole(null));
  }, [pathname]);

  const active = (p: string) => (pathname.startsWith(p) ? "font-bold underline" : "");

  if (role === undefined) return null;
  if (!role) {
    return (
      <>
        <Link href="/cart" className={active("/cart")}>Cart ({count})</Link>
        <span className="ml-auto" />
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </>
    );
  }
  return (
    <>
      {role === "STUDENT" ? (
        <>
          <Link href="/cart" className={active("/cart")}>Cart ({count})</Link>
          <Link href="/orders" className={active("/orders")}>My orders</Link>
        </>
      ) : (
        <>
          <Link href="/vendor" className={active("/vendor")}>Vendor</Link>
          <Link href="/counter" className={active("/counter")}>Counter</Link>
        </>
      )}
      <form action={logout} className="ml-auto">
        <button className="underline">Logout</button>
      </form>
    </>
  );
}
