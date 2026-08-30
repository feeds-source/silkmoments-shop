import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductMedia } from "@/components/product-media";
import { SizePicker } from "@/components/size-picker";
import { PRODUCTS_BY_ID, sizesFor } from "@/lib/catalog";
import { qtyInBag, useCart } from "@/lib/cart-store";
import { firstInStockSize, useStock } from "@/lib/inventory";
import { money } from "@/lib/quote";

export const Route = createFileRoute("/shop/$productId")({ component: ProductPage });

function ProductPage() {
  const { productId } = Route.useParams();
  const product = PRODUCTS_BY_ID[productId];
  const add = useCart((s) => s.add);
  const lines = useCart((s) => s.lines);
  const qty = useStock((s) => s.qty);
  const [size, setSize] = useState(() => (product ? firstInStockSize(product, qty) : ""));
  const [note, setNote] = useState("");

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted">This piece is no longer in the atelier.</p>
        <Link to="/shop" className="mt-4 inline-block text-accent">
          Back to shop
        </Link>
      </main>
    );
  }

  const chart = sizesFor(product);
  const picked = size || firstInStockSize(product, qty);
  const left = Math.max(0, qty(product.id, picked) - qtyInBag(lines, product.id, picked));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/shop" search={{ cat: product.category }} className="text-sm text-accent">
        Back to {product.category}
      </Link>
      <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-2">
        <ProductMedia product={product} className="min-h-72 overflow-hidden rounded-xl border border-line sm:min-h-96" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight break-words text-fg sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-xl font-semibold tabular-nums text-accent">{money(product.price)}</p>
          <p className="mt-4 max-w-md text-muted">{product.description}</p>
          <div className="mt-6">
            <SizePicker product={product} value={picked} onChange={setSize} />
          </div>
          <p className="mt-3 text-xs text-muted">
            {chart.length > 8
              ? "Band + cup as worn in atelier fittings. 30B–42C."
              : chart[0] === "Free Size"
                ? "One size. Drapes to the body."
                : "XS–XXL. Nighties also in Free Size."}
          </p>
          <button
            type="button"
            disabled={left <= 0}
            className="mt-8 h-12 max-w-full rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg disabled:opacity-40 sm:px-8"
            onClick={() => {
              const ok = add(product.id, picked);
              setNote(ok ? `Added · ${picked}` : "That size is gone");
            }}
          >
            {left <= 0 ? "Sold out" : note || `Add to bag · ${picked}`}
          </button>
        </div>
      </div>
    </main>
  );
}
