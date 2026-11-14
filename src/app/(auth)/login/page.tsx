import type { Metadata } from "next";
import { login } from "@/actions/auth";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-xl font-bold">Login</h1>
      <AuthForm action={login} button="Login" />
    </div>
  );
}
