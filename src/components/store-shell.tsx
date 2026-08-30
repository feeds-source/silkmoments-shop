import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AtelierFooter } from "@/components/atelier-footer";
import { InstallBanner } from "@/components/install-banner";
import { isAdminEmail } from "@/lib/admin";
import { hydrateCart, useCart } from "@/lib/cart-store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { FOOTER_AISLES } from "@/lib/footer";
import { useStock } from "@/lib/inventory";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isPending } = useCurrentUserState();
  const lines = useCart((s) => s.lines);
  const count = hydrateCart(lines).reduce((n, l) => n + l.qty, 0);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const admin = isAdminEmail(user?.primaryEmail);
  const loadStock = useStock((s) => s.load);

  useEffect(() => {
    void loadStock().then(() => {
      const stock = useStock.getState();
      const cart = useCart.getState();
      for (const line of cart.lines) {
        const max = stock.qty(line.id, line.size);
        if (line.qty > max) cart.setQty(line.id, line.size, max);
      }
    });
  }, [loadStock]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <InstallBanner />
      <header className="sticky top-0 z-30 border-b border-accent/20 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
          <Link to="/" className="flex min-w-0 shrink flex-col leading-none">
            <span className="font-display text-lg italic tracking-[0.18em] text-accent sm:text-xl sm:tracking-[0.32em]">FEMME</span>
            <span className="mt-1 hidden text-2xs uppercase tracking-[0.28em] text-muted min-[380px]:block">Silk Atelier</span>
          </Link>
          <nav className="hidden min-w-0 items-center gap-1 md:flex">
            <NavLink to="/" label="Home" active={path === "/"} />
            <NavLink to="/shop" label="Shop" active={path.startsWith("/shop")} />
            <NavLink to="/size-guide" label="Sizes" active={path === "/size-guide"} />
            <NavLink to="/about" label="Atelier" active={path === "/about"} />
            <NavLink to="/contact" label="Contact" active={path === "/contact"} />
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {admin && <NavLink to="/admin" label="Orders" active={path === "/admin"} />}
            {isPending ? (
              <div className="h-11 w-16 animate-pulse rounded-full bg-elevated sm:w-20" />
            ) : user ? (
              <Link
                to="/account"
                className="hidden h-11 items-center rounded-full border border-line px-3 text-xs uppercase tracking-wider text-accent transition-colors duration-150 hover:border-accent sm:inline-flex"
              >
                Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden h-11 items-center rounded-full border border-line px-3 text-xs uppercase tracking-wider text-accent transition-colors duration-150 hover:border-accent sm:inline-flex"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/cart"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-accent/40 bg-accent px-2.5 text-xs uppercase tracking-wider text-accent-fg sm:gap-2 sm:px-3"
            >
              <ShoppingBag className="size-4 shrink-0" />
              <span className="hidden sm:inline">Bag</span>
              <em className="not-italic">{count}</em>
            </Link>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-accent/20 bg-surface px-4 py-5 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink to="/" label="Home" active={path === "/"} onClick={() => setOpen(false)} />
              <NavLink to="/shop" label="Shop" active={path.startsWith("/shop")} onClick={() => setOpen(false)} />
              <NavLink to="/size-guide" label="Sizes" active={path === "/size-guide"} onClick={() => setOpen(false)} />
              <NavLink to="/about" label="Atelier" active={path === "/about"} onClick={() => setOpen(false)} />
              <NavLink to="/contact" label="Contact" active={path === "/contact"} onClick={() => setOpen(false)} />
            </div>
            <div className="gold-rule my-4" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {FOOTER_AISLES.map((group) => (
                <div key={group.title}>
                  <p className="text-2xs uppercase tracking-[0.2em] text-accent">{group.title}</p>
                  <div className="mt-2 flex flex-col">
                    {group.cats.map((c) => (
                      <Link
                        key={c}
                        to="/shop"
                        search={{ cat: c }}
                        className="h-10 text-sm text-muted"
                        onClick={() => setOpen(false)}
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <div>{children}</div>

      <AtelierFooter />

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-accent/25 bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <TabLink to="/" label="Home" active={path === "/"} />
        <TabLink to="/shop" label="Shop" active={path.startsWith("/shop")} />
        <TabLink to="/cart" label={count ? `Bag ${count}` : "Bag"} active={path === "/cart"} />
        <TabLink to={user ? "/account" : "/login"} label="Account" active={path === "/account" || path === "/login"} />
      </nav>
    </div>
  );
}

function NavLink({
  to,
  label,
  active,
  onClick,
}: {
  to: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex h-11 items-center px-3 text-xs uppercase tracking-[0.2em] transition-colors duration-150 ${
        active ? "text-accent" : "text-muted hover:text-accent"
      }`}
    >
      {label}
    </Link>
  );
}

function TabLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex h-14 flex-col items-center justify-center text-2xs uppercase tracking-wider ${
        active ? "text-accent" : "text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
