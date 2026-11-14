"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/actions/auth";
import { useCart } from "@/lib/cart";

// Client component: asks /api/me who is logged in, so the layout stays static.
export default function AuthLinks() {
  const [role, setRole] = useState(undefined);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setRole(d.role))
      .catch(() => setRole(null));
  }, [pathname]);

  const active = (p) => (pathname.startsWith(p) ? "nav-link is-active" : "nav-link");

  if (role === undefined) return null;
  if (!role) {
    return (
      <>
        <Link href="/cart" className={active("/cart")}>Cart <span className="ml-1">({count})</span></Link>
        <Link href="/login" className="nav-link">Login</Link>
        <Link href="/register" className="nav-link nav-cta">Join</Link>
      </>
    );
  }
  return (
    <>
      {role === "STUDENT" ? (
        <>
          <Link href="/cart" className={active("/cart")}>Cart <span className="ml-1">({count})</span></Link>
          <Link href="/orders" className={active("/orders")}>My orders</Link>
        </>
      ) : (
        <>
          <Link href="/vendor" className={active("/vendor")}>Vendor</Link>
          <Link href="/counter" className={active("/counter")}>Counter</Link>
        </>
      )}
      <form action={logout} className="nav-logout">
        <button className="nav-link" type="submit">Logout</button>
      </form>
    </>
  );
}
