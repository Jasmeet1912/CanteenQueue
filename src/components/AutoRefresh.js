"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Re-fetches the server-rendered page every few seconds (simple "live" updates).
export default function AutoRefresh({ seconds = 5 }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
