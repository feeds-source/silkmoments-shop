import { createFileRoute, Link } from "@tanstack/react-router";
import { TotalsBlock } from "@/components/receipt-block";
import { hydrateCart, useCart } from "@/lib/cart-store";
import { useStock } from "@/lib/inventory";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const cart = hydrateCart(lines);
  const stockQty = useStock((s) => s.qty);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-fg">Your bag</h1>
      {cart.length === 0 ? (
        <Link to="/shop" className="mt-6 inline-block text-accent">
          Shop the collection
        </Link>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
          <ul>
            {cart.map((l) => (
              <li key={`${l.product.id}-${l.size}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-line py-4">
                <div
                  className="h-16 w-14 bg-elevated bg-cover bg-center"
                  style={{ backgroundImage: `url(${l.product.image})` }}
                />
                <div>
                  <strong className="block text-sm">{l.product.name}</strong>
                  <p className="text-xs text-muted">
                    {l.size} · {Math.max(0, stockQty(l.product.id, l.size) - l.qty)} more in atelier
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" className="h-11 w-11 border border-line" onClick={() => setQty(l.product.id, l.size, l.qty - 1)}>
                      −
                    </button>
                    <span className="w-6 text-center">{l.qty}</span>
                    <button
                      type="button"
                      className="h-11 w-11 border border-line disabled:opacity-40"
                      disabled={l.qty >= stockQty(l.product.id, l.size)}
                      onClick={() => setQty(l.product.id, l.size, l.qty + 1)}
                    >
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
          <aside className="h-fit rounded-xl border border-line bg-surface p-5">
            <TotalsBlock />
            <Link
              to="/checkout"
              className="mt-6 flex h-12 items-center justify-center rounded-full bg-accent text-xs font-semibold uppercase tracking-widest text-accent-fg"
            >
              Review receipt
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
