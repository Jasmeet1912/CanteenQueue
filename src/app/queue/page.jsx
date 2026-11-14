import AutoRefresh from "@/components/AutoRefresh";
import { getQueue } from "@/lib/queue";

export const metadata = { title: "Queue board" };

// MODULE 3: public token board (no login, tokens only - no personal data).
export const dynamic = "force-dynamic";

function Column({ title, tokens, tone, note }) {
  return (
    <section className={`queue-column queue-${tone}`}>
      <div className="queue-column-heading">
        <div><span className="queue-indicator" aria-hidden="true" /><h2>{title}</h2></div>
        <span className="queue-count">{tokens.length}</span>
      </div>
      <p className="queue-note">{note}</p>
      {tokens.length === 0 ? (
        <p className="queue-empty">Nothing here right now</p>
      ) : (
      <div className="queue-tokens">
        {tokens.map((t) => (
          <span key={t.id} className="queue-token" title={`Pickup ${t.pickupSlot}`}>
            <span>Token</span> #{t.tokenNumber}
          </span>
        ))}
      </div>
      )}
    </section>
  );
}

export default async function QueuePage() {
  const { ready, preparing, waiting } = await getQueue();
  return (
    <div className="queue-page">
      <AutoRefresh seconds={5} />
      <header className="page-heading">
        <span className="eyebrow">Live canteen updates</span>
        <h1 className="queue-title">Queue board</h1>
        <p>Your token’s place in line, at a glance.</p>
      </header>
      <div className="queue-columns">
        <Column title="Ready to collect" tokens={ready} tone="ready" note="Head to the counter when you see your token." />
        <Column title="Preparing" tokens={preparing} tone="preparing" note="The kitchen is working on these orders." />
        <Column title="Waiting" tokens={waiting} tone="waiting" note="Orders are lined up by pickup time." />
      </div>
      <p className="queue-footnote"><span className="live-dot" aria-hidden="true" /> Updates automatically every 5 seconds</p>
    </div>
  );
}
