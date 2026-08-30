import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductMedia } from "@/components/product-media";
import { SizePicker } from "@/components/size-picker";
import { type Product } from "@/lib/catalog";
import { qtyInBag, useCart } from "@/lib/cart-store";
import { firstInStockSize, useStock } from "@/lib/inventory";
import { money } from "@/lib/quote";

export function ProductCard({ product, wide }: { product: Product; wide?: boolean }) {
  const add = useCart((s) => s.add);
  const lines = useCart((s) => s.lines);
  const qty = useStock((s) => s.qty);
  const [size, setSize] = useState(() => firstInStockSize(product, qty));
  const [note, setNote] = useState("");
  const left = Math.max(0, qty(product.id, size) - qtyInBag(lines, product.id, size));

  useEffect(() => {
    if (qty(product.id, size) <= 0) setSize(firstInStockSize(product, qty));
  }, [product, qty, size]);

  return (
    <article className={`overflow-hidden rounded-xl border border-line bg-surface ${wide ? "span-wide" : ""}`}>
      <Link to="/shop/$productId" params={{ productId: product.id }} className="block">
        <ProductMedia product={product} className="media-fill h-full min-h-52" />
        <div className="p-3">
          <p className="text-2xs uppercase tracking-widest text-accent">{product.category}</p>
          <h3 className="mt-1 text-sm text-fg">{product.name}</h3>
          <p className="mt-1 font-semibold tabular-nums text-accent">{money(product.price)}</p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <SizePicker product={product} value={size} onChange={setSize} variant="select" />
        <button
          type="button"
          disabled={left <= 0}
          className="mt-2 h-11 w-full rounded-full bg-accent text-xs font-semibold uppercase tracking-widest text-accent-fg transition-transform duration-150 ease-out enabled:active:scale-[0.96] disabled:opacity-40"
          onClick={() => {
            const ok = add(product.id, size);
            setNote(ok ? `Added · ${size}` : "That size is gone");
          }}
        >
          {left <= 0 ? "Sold out" : note || "Add"}
        </button>
      </div>
    </article>
  );
}
