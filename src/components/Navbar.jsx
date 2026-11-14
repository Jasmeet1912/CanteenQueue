import Link from "next/link";
import AuthLinks from "./AuthLinks";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner mx-auto w-full max-w-[1100px] px-6">
        <Link href="/" className="brand-link">
          <span className="brand-mark" aria-hidden="true">CQ</span>
          <span>Canteen Queue</span>
        </Link>
        <Link href="/menu" className="nav-link">Menu</Link>
        <Link href="/queue" className="nav-link">Queue board</Link>
        <AuthLinks />
      </div>
    </nav>
  );
}
