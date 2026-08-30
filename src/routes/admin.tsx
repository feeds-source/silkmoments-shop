import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OrderLines, StatusPill, TotalsBlock } from "@/components/receipt-block";
import { isAdminEmail } from "@/lib/admin";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PRODUCTS, sizesFor } from "@/lib/catalog";
import { setStock, useStock } from "@/lib/inventory";
import { confirmOrder, dispatchOrder, listAdminOrders, type OrderEmail, type StoreOrder } from "@/lib/orders";
import { printOrder } from "@/lib/print-receipt";
import { moneyCents } from "@/lib/quote";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [filter, setFilter] = useState<"all" | "received" | "confirmed" | "dispatched">("all");
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState<OrderEmail | null>(null);

  async function load(next = filter) {
    try {
      const rows = await listAdminOrders({ data: { status: next } });
      setOrders(rows);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Admin access needed");
    }
  }

  useEffect(() => {
    if (user && isAdminEmail(user.primaryEmail)) void load("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-10 w-64 animate-pulse rounded bg-elevated" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (!isAdminEmail(user.primaryEmail)) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-4xl text-fg">Orders received</h1>
        <p className="mt-4 text-muted">This desk is limited to the store owner.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.24em] text-accent">Atelier desk</p>
      <h1 className="mt-2 font-display text-4xl text-fg">Orders received</h1>
      <StockDesk />
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "received", "confirmed", "dispatched"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`h-11 rounded-full border px-4 text-xs uppercase tracking-wider ${
              filter === f ? "border-blush bg-blush text-fg" : "border-line text-muted"
            }`}
            onClick={() => {
              setFilter(f);
              void load(f);
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {notice && <p className="mt-4 text-sm text-muted">{notice}</p>}
      {email && (
        <aside className="mt-6 rounded-xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-accent">Shipment email</p>
          <strong className="mt-1 block">{email.subject}</strong>
          <p className="text-sm text-muted">To {email.to_email}</p>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-accent">{email.body}</pre>
          <button type="button" className="mt-3 text-sm text-accent" onClick={() => setEmail(null)}>
            Close
          </button>
        </aside>
      )}
      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <strong>{o.order_no}</strong> <StatusPill status={o.status} />
                <p className="mt-1 text-sm text-muted">
                  {o.email} · {o.ship_name} · {moneyCents(o.total_cents)}
                </p>
                <p className="text-sm text-muted">{o.ship_addr}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {o.status === "received" && (
                  <button
                    type="button"
                    className="h-11 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-widest text-accent-fg"
                    onClick={async () => {
                      try {
                        const next = await confirmOrder({ data: { id: o.id } });
                        setNotice(`Confirmed ${next.order_no}`);
                        await load();
                      } catch (err) {
                        setNotice(err instanceof Error ? err.message : "Confirm failed");
                      }
                    }}
                  >
                    Confirm
                  </button>
                )}
                {o.status !== "dispatched" && (
                  <button
                    type="button"
                    className="h-11 rounded-full border border-accent px-4 text-xs uppercase tracking-widest text-accent"
                    onClick={async () => {
                      try {
                        const next = await dispatchOrder({ data: { id: o.id } });
                        setNotice(`Dispatch email written for ${next.order_no}`);
                        setEmail(next.emails[0] ?? null);
                        await load();
                      } catch (err) {
                        setNotice(err instanceof Error ? err.message : "Dispatch failed");
                      }
                    }}
                  >
                    Dispatch & email
                  </button>
                )}
                <button
                  type="button"
                  className="h-11 text-sm text-accent"
                  onClick={() => printOrder(o, [], { name: o.ship_name, addr: o.ship_addr, country: o.ship_country })}
                >
                  Print
                </button>
              </div>
            </div>
            <div className="mt-3">
              <OrderLines order={o} />
              <TotalsBlock order={o} />
            </div>
            {o.tracking && <p className="mt-2 text-sm text-muted">Tracking {o.tracking}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}

function StockDesk() {
  const qty = useStock((s) => s.qty);
  const load = useStock((s) => s.load);
  const [open, setOpen] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  return (
    <section className="mt-8 rounded-xl border border-line bg-surface p-5">
      <p className="text-xs uppercase tracking-widest text-accent">Inventory</p>
      <p className="mt-1 text-sm text-muted">Sizes linked to remaining pieces. Checkout takes them off the rack.</p>
      {notice && <p className="mt-2 text-sm text-accent">{notice}</p>}
      <ul className="mt-4 divide-y divide-line">
        {PRODUCTS.map((p) => (
          <li key={p.id} className="py-3">
            <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === p.id ? null : p.id)}>
              <span className="text-sm">{p.name}</span>
              <span className="text-xs text-subtle">
                {sizesFor(p).reduce((n, s) => n + qty(p.id, s), 0)} pcs
              </span>
            </button>
            {open === p.id && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sizesFor(p).map((s) => (
                  <label key={s} className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs">
                    <span className="uppercase tracking-wider text-muted">{s}</span>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      defaultValue={qty(p.id, s)}
                      className="h-9 w-14 bg-transparent text-fg"
                      onBlur={async (e) => {
                        const next = Math.max(0, Number(e.target.value) || 0);
                        try {
                          await setStock({ data: { productId: p.id, size: s, qty: next } });
                          await load();
                          setNotice(`Set ${p.name} · ${s} to ${next}`);
                        } catch (err) {
                          setNotice(err instanceof Error ? err.message : "Could not save stock");
                        }
                      }}
                    />
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
