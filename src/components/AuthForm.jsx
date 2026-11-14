"use client";

import { useActionState } from "react";

export default function AuthForm({ action, withName, button }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const input = "w-full rounded border p-2";
  return (
    <form action={formAction} className="mx-auto max-w-sm space-y-3">
      {withName && <input name="name" placeholder="Name" className={input} required />}
      <input name="email" type="email" placeholder="Email" className={input} required />
      <input name="password" type="password" placeholder="Password" className={input} required />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="w-full rounded bg-black p-2 text-white disabled:opacity-50">
        {pending ? "Please wait..." : button}
      </button>
    </form>
  );
}
