import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";
import AddToCartButton from "@/components/AddToCartButton";

export const metadata = { title: "Menu" };

export default async function MenuPage() {
  // The menu comes from the live database; do not query it during static builds.
  await connection();
  const items = await db.select().from(menuItems).where(eq(menuItems.available, true));
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="menu-page">
      <header className="page-heading">
        <span className="eyebrow">Fresh from the canteen</span>
        <h1 className="menu-title">The menu</h1>
        <p>Find a favourite, add it to your bag, and choose a pickup time.</p>
      </header>
      {categories.map((cat) => (
        <section key={cat} className="menu-category">
          <div className="category-heading">
            <h2>{cat}</h2>
            <span>{items.filter((item) => item.category === cat).length} available</span>
          </div>
          <div className="menu-grid">
            {items
              .filter((i) => i.category === cat)
              .map((item) => (
                <article key={item.id} className="menu-item">
                  <Link href={`/menu/${item.id}`} className="menu-image-link" aria-label={`View ${item.name}`}>
                    <Image src="/food.svg" alt="" width={96} height={72} className="menu-image" />
                  </Link>
                  <div className="menu-item-info">
                    <Link href={`/menu/${item.id}`} className="menu-item-name">
                      {item.name}
                    </Link>
                    <p className="menu-item-price">₹{item.price}</p>
                  </div>
                  <AddToCartButton id={item.id} name={item.name} price={item.price} />
                </article>
              ))}
          </div>
        </section>
      ))}
      <div className="menu-footer">
        <p>Found something good?</p>
        <Link href="/cart" className="page-action">Review your bag <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
