import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import AddToCartButton from "@/components/AddToCartButton";

export const metadata: Metadata = { title: "Menu" };

// ISR: built once, refreshed at most every 60s, and instantly when a vendor
// changes availability (revalidatePath("/menu") in the vendor action).
export const revalidate = 60;

export default function MenuPage() {
  const items = db.select().from(menuItems).where(eq(menuItems.available, true)).all();
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menu</h1>
      {categories.map((cat) => (
        <section key={cat} className="space-y-2">
          <h2 className="text-lg font-semibold">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {items
              .filter((i) => i.category === cat)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded border bg-white p-3">
                  <Image src="/food.svg" alt={item.name} width={80} height={50} className="rounded" />
                  <div className="flex-1">
                    <Link href={`/menu/${item.id}`} className="font-medium underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  </div>
                  <AddToCartButton id={item.id} name={item.name} price={item.price} />
                </div>
              ))}
          </div>
        </section>
      ))}
      <p className="text-sm">
        Ready? <Link href="/cart" className="underline">Go to cart</Link>
      </p>
    </div>
  );
}
