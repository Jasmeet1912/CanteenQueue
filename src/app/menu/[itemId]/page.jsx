import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import AddToCartButton from "@/components/AddToCartButton";

async function getItem(id) {
  const n = Number(id);
  if (!Number.isInteger(n)) return undefined;
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, n));
  return item;
}

// Item ids are resolved at request time so builds do not require a live database.
export async function generateStaticParams() {
  return [];
}

// Dynamic metadata (SEO)
export async function generateMetadata({ params }) {
  await connection();
  const item = await getItem((await params).itemId);
  return { title: item?.name ?? "Item", description: item?.description };
}

export default async function ItemPage({ params }) {
  await connection();
  const item = await getItem((await params).itemId);
  if (!item) notFound();

  return (
    <div className="max-w-md space-y-3">
      <Image src="/food.svg" alt={item.name} width={320} height={200} className="rounded" priority />
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <p>{item.description}</p>
      <p className="text-lg">₹{item.price}</p>
      {item.available ? (
        <AddToCartButton id={item.id} name={item.name} price={item.price} />
      ) : (
        <p className="text-red-600">Sold out</p>
      )}
    </div>
  );
}
