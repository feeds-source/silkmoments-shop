import type { StoreOrder } from "@/lib/orders";
import { money, moneyCents, quoteCart } from "@/lib/quote";
import { hydrateCart, useCart } from "@/lib/cart-store";

export function TotalsBlock({
  order,
  addr = "",
  country = "",
}: {
  order?: StoreOrder | null;
  addr?: string;
  country?: string;
}) {
  const lines = useCart((s) => s.lines);
  const cart = hydrateCart(lines);
  const cartTotal = cart.reduce((n, l) => n + l.product.price * l.qty, 0);
  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const q = quoteCart(cartTotal, cartCount, addr, country);

  const product = order ? moneyCents(order.subtotal_cents) : money(cartTotal);
  const pack = order ? moneyCents(order.pack_cents) : money(q.pack);
  const ship = order
    ? order.shipping_cents === 0
      ? "Free"
      : moneyCents(order.shipping_cents)
    : q.ship === 0
      ? "Free"
      : money(q.ship);
  const taxL = order?.tax_label || q.taxLabel;
  const tax = order ? moneyCents(order.tax_cents) : money(q.tax);
  const other = order ? moneyCents(order.other_cents) : money(q.other);
  const total = order ? moneyCents(order.total_cents) : money(q.total);
  const freeShip = order ? order.shipping_cents === 0 : q.ship === 0;

  return (
    <ul className="mt-4 space-y-2 text-sm">
      <li className="flex justify-between gap-4 border-b border-line py-2">
        <span className="text-muted">Product cost</span>
        <strong>{product}</strong>
      </li>
      <li className="flex justify-between gap-4 border-b border-line py-2">
        <span className="text-muted">Packaging (box $2.95 + $0.85/extra)</span>
        <strong>{pack}</strong>
      </li>
      <li className="flex justify-between gap-4 border-b border-line py-2">
        <span className="text-muted">Shipping{freeShip ? " · free over $100" : ""}</span>
        <strong>{ship}</strong>
      </li>
      <li className="flex justify-between gap-4 border-b border-line py-2">
        <span className="text-muted">{taxL}</span>
        <strong>{tax}</strong>
      </li>
      <li className="flex justify-between gap-4 border-b border-line py-2">
        <span className="text-muted">Other charges (COD)</span>
        <strong>{other}</strong>
      </li>
      <li className="flex justify-between gap-4 pt-3 text-base">
        <span>Total due</span>
        <strong className="text-accent">{total}</strong>
      </li>
    </ul>
  );
}

export function OrderLines({ order }: { order: StoreOrder }) {
  return (
    <ul className="space-y-2 text-sm">
      {order.items.map((i) => (
        <li key={i.product_id} className="flex justify-between gap-3 border-b border-line py-2">
          <span>
            {i.qty} × {i.name}
          </span>
          <strong>{moneyCents(i.unit_cents * i.qty)}</strong>
        </li>
      ))}
    </ul>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "dispatched"
      ? "border-ok text-ok"
      : status === "confirmed"
        ? "border-accent text-accent"
        : "border-blush text-blush";
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs uppercase tracking-wider ${tone}`}>
      {status}
    </span>
  );
}
