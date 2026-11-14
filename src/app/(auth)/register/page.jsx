import { register } from "@/actions/auth";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-center text-xl font-bold">Student registration</h1>
      <AuthForm action={register} withName button="Create account" />
    </div>
  );
}
