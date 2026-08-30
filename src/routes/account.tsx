import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OrderLines, StatusPill, TotalsBlock } from "@/components/receipt-block";
import { isAdminEmail } from "@/lib/admin";
import { UserButton, RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listMyOrders, type StoreOrder } from "@/lib/orders";
import { printOrder } from "@/lib/print-receipt";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    void listMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoaded(true));
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-10 w-64 animate-pulse rounded bg-elevated" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-fg">{user.primaryEmail ?? "Account"}</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isAdminEmail(user.primaryEmail) && (
          <Link
            to="/admin"
            className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg"
          >
            Admin orders
          </Link>
        )}
        <UserButton />
      </div>
      <h2 className="mt-10 font-display text-2xl text-fg">My orders</h2>
      {!loaded ? (
        <p className="mt-4 text-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-muted">No orders yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <strong>{o.order_no}</strong>
                <StatusPill status={o.status} />
              </div>
              <div className="mt-3">
                <OrderLines order={o} />
                <TotalsBlock order={o} />
              </div>
              {o.tracking && <p className="mt-2 text-sm text-muted">Tracking {o.tracking}</p>}
              <button
                type="button"
                className="mt-4 h-11 rounded-full border border-accent px-4 text-xs uppercase tracking-widest text-accent"
                onClick={() => printOrder(o, [], { name: o.ship_name, addr: o.ship_addr, country: o.ship_country })}
              >
                Print receipt
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
