import Link from "next/link";
import AuthLinks from "./AuthLinks";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 p-3 text-sm">
        <Link href="/" className="font-bold">
          🥟 Canteen Queue
        </Link>
        <Link href="/menu">Menu</Link>
        <Link href="/queue">Queue board</Link>
        <AuthLinks />
      </div>
    </nav>
  );
}
