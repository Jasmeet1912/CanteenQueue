import Link from "next/link";

export default function Home() {
  const box = "rounded border bg-white p-4";
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fifteen Minutes, One Samosa</h1>
      <p>
        Order ahead, pick a pickup time, get a token number and collect your food without
        standing in a messy queue.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={box}>
          <h2 className="font-semibold">1. Student</h2>
          <p className="text-sm">Browse the menu, order and choose a pickup slot.</p>
          <Link href="/menu" className="text-sm underline">Open menu</Link>
        </div>
        <div className={box}>
          <h2 className="font-semibold">2. Vendor</h2>
          <p className="text-sm">See incoming orders and mark them preparing / ready.</p>
          <Link href="/vendor" className="text-sm underline">Vendor dashboard</Link>
        </div>
        <div className={box}>
          <h2 className="font-semibold">3. Queue &amp; payment</h2>
          <p className="text-sm">Tokens, queue order, payment and pickup completion.</p>
          <Link href="/queue" className="text-sm underline">Queue board</Link>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        Demo logins: student@demo.com / student123 &middot; vendor@demo.com / vendor123
      </p>
    </div>
  );
}
