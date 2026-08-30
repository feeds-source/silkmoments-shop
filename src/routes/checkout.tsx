import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { OrderLines, StatusPill, TotalsBlock } from "@/components/receipt-block";
import { COUNTRIES } from "@/lib/catalog";
import { hydrateCart, useCart } from "@/lib/cart-store";
import { useStock } from "@/lib/inventory";
import { placeOrder, type StoreOrder } from "@/lib/orders";
import { printOrder } from "@/lib/print-receipt";
import { quoteCart, money } from "@/lib/quote";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { user, isPending } = useCurrentUserState();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);
  const cart = hydrateCart(lines);
  const [shipName, setShipName] = useState("");
  const [shipAddr, setShipAddr] = useState("");
  const [shipCountry, setShipCountry] = useState<(typeof COUNTRIES)[number]>("United Arab Emirates");
  const [placed, setPlaced] = useState<StoreOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const q = quoteCart(
    cart.reduce((n, l) => n + l.product.price * l.qty, 0),
    cart.reduce((n, l) => n + l.qty, 0),
    shipAddr,
    shipCountry,
  );

  if (isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-10 w-48 animate-pulse rounded bg-elevated" />
      </main>
    );
  }
  if (!user) {
    sessionStorage.setItem("femme_next", "/checkout");
    return <RedirectToSignIn to="/login" />;
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const order = await placeOrder({
        data: {
          shipName,
          shipAddr,
          shipCountry,
          items: cart.map((l) => ({ id: l.product.id, qty: l.qty, size: l.size })),
        },
      });
      setPlaced(order);
      clear();
      void useStock.getState().load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.24em] text-accent">Secure checkout</p>
      <h1 className="mt-2 font-display text-4xl text-fg">{placed ? "Order received" : "Review receipt"}</h1>

      {placed ? (
        <section className="mt-8 max-w-xl rounded-xl border border-line bg-surface p-5">
          <p className="text-muted">
            Thank you. Order <strong className="text-fg">{placed.order_no}</strong> is with the atelier.
          </p>
          <p className="mt-3 text-sm text-muted">
            {placed.ship_name}
            <br />
            {placed.ship_addr}
            <br />
            {placed.ship_country}
          </p>
          <div className="mt-4">
            <OrderLines order={placed} />
            <TotalsBlock order={placed} />
          </div>
          <div className="mt-4">
            <StatusPill status={placed.status} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="h-12 rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg"
              onClick={() => printOrder(placed, [], { name: placed.ship_name, addr: placed.ship_addr, country: placed.ship_country })}
            >
              Print receipt
            </button>
            <Link
              to="/shop"
              className="inline-flex h-12 items-center rounded-full border border-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent"
            >
              Add more
            </Link>
          </div>
        </section>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form className="max-w-md space-y-4" onSubmit={(e) => void onConfirm(e)}>
            <p className="text-sm text-muted">
              Signed in as <strong className="text-fg">{user.primaryEmail ?? user.displayName}</strong>
            </p>
            <label className="block text-sm text-accent">
              Full name
              <input
                required
                value={shipName}
                onChange={(e) => setShipName(e.target.value)}
                className="mt-1 h-11 w-full border border-line bg-elevated px-3 text-fg"
              />
            </label>
            <label className="block text-sm text-accent">
              Country
              <select
                value={shipCountry}
                onChange={(e) => setShipCountry(e.target.value as (typeof COUNTRIES)[number])}
                className="mt-1 h-11 w-full border border-line bg-elevated px-3 text-fg"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-accent">
              Delivery address
              <textarea
                required
                rows={3}
                value={shipAddr}
                onChange={(e) => setShipAddr(e.target.value)}
                className="mt-1 w-full border border-line bg-elevated px-3 py-2 text-fg"
              />
            </label>
            <p className="text-sm text-muted">Cash on delivery. Confirm only after the receipt looks right.</p>
            {error && <p className="text-blush">{error}</p>}
            <button
              type="submit"
              disabled={busy || cart.length === 0}
              className="h-12 w-full rounded-full bg-accent text-xs font-semibold uppercase tracking-widest text-accent-fg disabled:opacity-50"
            >
              {busy ? "Placing…" : `Confirm order · ${money(q.total)}`}
            </button>
          </form>
          <aside className="h-fit rounded-xl border border-line bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-accent">Receipt</p>
            {cart.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Bag is empty.</p>
            ) : (
              <ul className="mt-3">
                {cart.map((l) => (
                  <li key={`${l.product.id}-${l.size}`} className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-2 border-b border-line py-3">
                    <div
                      className="h-14 w-12 shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${l.product.image})` }}
                    />
                    <div className="min-w-0">
                      <strong className="text-sm break-words">{l.product.name}</strong>
                      <p className="text-xs text-muted">{l.size}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button type="button" className="h-11 w-11 border border-line" onClick={() => setQty(l.product.id, l.size, l.qty - 1)}>
                          −
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" className="h-11 w-11 border border-line" onClick={() => setQty(l.product.id, l.size, l.qty + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <button type="button" className="text-sm text-accent" onClick={() => setQty(l.product.id, l.size, 0)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <TotalsBlock addr={shipAddr} country={shipCountry} />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="h-11 rounded-full border border-accent px-4 text-xs uppercase tracking-widest text-accent"
                onClick={() => printOrder(null, cart, { name: shipName, addr: shipAddr, country: shipCountry })}
              >
                Print receipt
              </button>
              <Link to="/shop" className="inline-flex h-11 items-center text-sm text-accent">
                Add more products
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
