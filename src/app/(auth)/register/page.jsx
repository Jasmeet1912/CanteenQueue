import { register } from "@/actions/auth";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <aside className="auth-aside auth-aside-join">
          <span className="auth-aside-kicker">Your break, made better</span>
          <span className="auth-aside-mark" aria-hidden="true">CQ</span>
          <h2>Your next<br />favourite is<br />closer.</h2>
          <p>Make an account to order from the canteen and collect when it suits you.</p>
          <span className="auth-aside-foot"><span /> Pick a meal. Pick a time. Enjoy.</span>
        </aside>
        <div className="auth-main">
          <span className="eyebrow">A seat at the table</span>
          <h1 className="auth-title">Join us</h1>
          <p className="auth-copy">Create your student account and get lunch in motion.</p>
          <AuthForm action={register} withName button="Create my account" />
          <p className="auth-switch">Already have an account? <Link href="/login">Log in <span aria-hidden="true">→</span></Link></p>
        </div>
      </section>
    </div>
  );
}
