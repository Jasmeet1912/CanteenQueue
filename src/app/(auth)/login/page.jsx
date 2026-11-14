import { login } from "@/actions/auth";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <aside className="auth-aside">
          <span className="auth-aside-kicker">A little less queue</span>
          <span className="auth-aside-mark" aria-hidden="true">CQ</span>
          <h2>Make lunch<br />your moment.</h2>
          <p>Order ahead, pick a time, and let the canteen take care of the rest.</p>
          <span className="auth-aside-foot"><span /> Good food. A smoother break.</span>
        </aside>
        <div className="auth-main">
          <span className="eyebrow">Welcome back</span>
          <h1 className="auth-title">Log in</h1>
          <p className="auth-copy">Sign in to see your orders and keep lunch moving.</p>
          <AuthForm action={login} button="Log in" />
          <p className="auth-switch">New to Canteen Queue? <Link href="/register">Join now <span aria-hidden="true">→</span></Link></p>
        </div>
      </section>
    </div>
  );
}
