import type { Metadata } from "next";
import AutoRefresh from "@/components/AutoRefresh";
import { getQueue } from "@/lib/queue";

export const metadata: Metadata = { title: "Queue board" };

// MODULE 3: public token board (no login, tokens only - no personal data).
export const dynamic = "force-dynamic";

function Column({ title, tokens, color }: { title: string; tokens: { id: number; tokenNumber: number; pickupSlot: string }[]; color: string }) {
  return (
    <div className={`rounded border p-3 ${color}`}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      {tokens.length === 0 && <p className="text-sm text-gray-500">-</p>}
      <div className="flex flex-wrap gap-2">
        {tokens.map((t) => (
          <span key={t.id} className="rounded bg-white px-3 py-1 text-xl font-bold" title={t.pickupSlot}>
            #{t.tokenNumber}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function QueuePage() {
  const { ready, preparing, waiting } = getQueue();
  return (
    <div className="space-y-4">
      <AutoRefresh seconds={5} />
      <h1 className="text-2xl font-bold">Queue board</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Column title="Ready - collect now" tokens={ready} color="bg-green-100" />
        <Column title="Preparing" tokens={preparing} color="bg-yellow-100" />
        <Column title="Waiting" tokens={waiting} color="bg-gray-100" />
      </div>
      <p className="text-sm text-gray-600">Ordered by pickup time, then token number. Updates every 5 seconds.</p>
    </div>
  );
}
