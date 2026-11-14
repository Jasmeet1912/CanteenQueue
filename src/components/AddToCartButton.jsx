"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton(props) {
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        addToCart({ menuItemId: props.id, name: props.name, price: props.price });
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
      }}
      className="add-button"
    >
      {added ? "Added ✓" : "Add"}
    </button>
  );
}
