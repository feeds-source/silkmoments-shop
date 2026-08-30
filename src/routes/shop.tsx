import { Outlet, createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";

type ShopSearch = { cat?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
  component: Shop,
});

function Shop() {
  const isPiece = useRouterState({
    select: (s) => s.matches.some((m) => m.routeId.includes("$productId")),
  });
  if (isPiece) return <Outlet />;

  const { cat } = Route.useSearch();
  const current = CATEGORIES.includes(cat as (typeof CATEGORIES)[number])
    ? (cat as (typeof CATEGORIES)[number])
    : "All";
  const list =
    current === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === (current as Category));

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-accent/20">
        <img src="/banners/lounge.jpg" alt="" className="ken absolute inset-0 h-full w-full object-cover" />
        <div className="hero-veil absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Boutique</p>
          <h1 className="mt-2 font-display text-4xl italic text-fg md:text-6xl">
            {current === "All" ? "Shop the house" : current}
          </h1>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={c === "All" ? {} : { cat: c }}
              className={`inline-flex h-11 items-center rounded-full border px-3 text-2xs uppercase tracking-wider md:px-4 md:text-xs ${
                current === c ? "border-blush bg-blush text-fg" : "border-line text-muted"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
        <div className="mt-8 grid-shop">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} wide={Boolean(p.tag)} />
          ))}
        </div>
      </div>
    </main>
  );
}
