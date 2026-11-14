import CheckoutForm from "@/components/CheckoutForm";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  await requireUser("STUDENT"); // protected route (proxy.ts also checks)
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
