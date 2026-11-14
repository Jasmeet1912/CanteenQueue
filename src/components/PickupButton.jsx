"use client";

import { useState, useTransition } from "react";
import { finishPickup } from "@/actions/counter";

export default function PickupButton({ orderId }) {
  const [error, setError] = useState();
  const [pending, startTransition] = useTransition();
  return (
    <div className="text-right">
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await finishPickup(orderId);
            setError(res.error);
          })
        }
        className="rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        Hand over
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
