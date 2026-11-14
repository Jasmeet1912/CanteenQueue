"use client";

import { useOptimistic, useTransition } from "react";
import { cancelMyOrder } from "@/actions/orders";
import StatusBadge from "./StatusBadge";

// Optimistic UI: the badge flips to "Cancelled" immediately, then the server confirms.
export default function CancelOrderButton({ orderId, status }) {
  const [optimisticStatus, setOptimistic] = useOptimistic(status);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <StatusBadge status={optimisticStatus} />
      {optimisticStatus === "PLACED" && (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setOptimistic("CANCELLED");
              await cancelMyOrder(orderId);
            })
          }
          className="rounded border px-2 py-0.5 text-sm"
        >
          Cancel order
        </button>
      )}
    </div>
  );
}
