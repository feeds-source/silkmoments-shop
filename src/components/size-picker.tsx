import { Link } from "@tanstack/react-router";
import { chartFor, sizesFor, type Product } from "@/lib/catalog";
import { qtyInBag, useCart } from "@/lib/cart-store";
import { useStock } from "@/lib/inventory";
import { CHART_COPY } from "@/lib/size-guide";

export function SizePicker({
  product,
  value,
  onChange,
  variant = "pills",
}: {
  product: Product;
  value: string;
  onChange: (size: string) => void;
  variant?: "pills" | "select";
}) {
  const sizes = sizesFor(product);
  const qty = useStock((s) => s.qty);
  const lines = useCart((s) => s.lines);

  if (variant === "select") {
    return (
      <label className="block">
        <span className="text-2xs uppercase tracking-[0.24em] text-accent">Size</span>
        <select
          className="mt-2 h-11 w-full min-w-0 max-w-full truncate rounded-full border border-line bg-elevated px-3 text-sm text-fg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {sizes.map((s) => {
            const left = Math.max(0, qty(product.id, s) - qtyInBag(lines, product.id, s));
            return (
              <option key={s} value={s} disabled={left <= 0}>
                {s}
                {left <= 0 ? " — sold out" : ` · ${left} left`}
              </option>
            );
          })}
        </select>
      </label>
    );
  }

  return (
    <div>
      <p className="text-2xs uppercase tracking-[0.24em] text-accent">Size</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {sizes.map((s) => {
          const left = Math.max(0, qty(product.id, s) - qtyInBag(lines, product.id, s));
          const on = value === s;
          return (
            <button
              key={s}
              type="button"
              disabled={left <= 0}
              className={`h-11 min-w-11 max-w-full shrink-0 rounded-full border px-3 text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-40 ${
                on ? "border-blush bg-blush text-fg" : "border-line text-muted"
              }`}
              onClick={() => onChange(s)}
            >
              {s}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-subtle">
        {Math.max(0, qty(product.id, value) - qtyInBag(lines, product.id, value))} in the atelier
        {" · "}
        <Link to="/size-guide" hash={CHART_COPY[chartFor(product)].id} className="text-accent">
          Size guide
        </Link>
      </p>
    </div>
  );
}
