"use client";

import { useActionState } from "react";

export default function AuthForm({ action, withName, button }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="auth-form">
      {withName && (
        <label className="auth-field">
          <span>Your name</span>
          <input name="name" type="text" autoComplete="name" placeholder="e.g. Sam Patel" required />
        </label>
      )}
      <label className="auth-field">
        <span>Email address</span>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input name="password" type="password" autoComplete={withName ? "new-password" : "current-password"} placeholder="Enter your password" required />
      </label>
      {state?.error && <p className="auth-error" role="alert">{state.error}</p>}
      <button disabled={pending} className="auth-submit" type="submit">
        {pending ? "Please wait..." : button}
        {!pending && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
