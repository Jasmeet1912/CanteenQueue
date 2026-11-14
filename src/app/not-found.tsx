import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Not found</h2>
      <p>We could not find that page.</p>
      <Link href="/menu" className="underline">Back to menu</Link>
    </div>
  );
}
