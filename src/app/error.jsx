"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error); // error logging hook (swap for a monitoring service in production)
  }, [error]);
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <button onClick={reset} className="rounded bg-black px-3 py-1 text-white">
        Try again
      </button>
    </div>
  );
}
