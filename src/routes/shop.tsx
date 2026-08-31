import { Outlet, createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { AISLES, CAMPAIGNS } from "@/lib/banners";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import { ROOMS, type Room } from "@/lib/footer";
import { CAT_HERO } from "@/lib/house";
import { shopDescription, shopTitle } from "@/lib/seo";

type ShopSearch = { cat?: string; room?: string };

function isRoom(value: string | undefined): value is Room {
  return Boolean(value && value in ROOMS);
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    cat: typeof search.cat === "string" ? search.cat : undefined,
    room: typeof search.room === "string" ? search.room : undefined,
  }),
  head: ({ match }) => {
    const search = match.search as ShopSearch;
    const aisle = search.cat || search.room || "All";
    return {
      meta: [
        { title: shopTitle(aisle) },
        { name: "description", content: shopDescription(aisle) },
        { name: "keywords", content: `${aisle}, silk lingerie, Femme Silk Moments, cash on delivery lingerie` },
      ],
    };
  },
  component: Shop,
});

function Shop() {
  const isPiece = useRouterState({
    select: (s) => s.matches.some((m) => m.routeId.includes("$productId")),
  });
  if (isPiece) return <Outlet />;

  const { cat, room: roomParam } = Route.useSearch();
  const current = CATEGORIES.includes(cat as (typeof CATEGORIES)[number])
    ? (cat as (typeof CATEGORIES)[number])
    : "All";
  const room = current === "All" && isRoom(roomParam) ? roomParam : undefined;
  const list =
    current !== "All"
      ? PRODUCTS.filter((p) => p.category === (current as Category))
      : room
        ? PRODUCTS.filter((p) => ROOMS[room].includes(p.category))
        : PRODUCTS;
  const campaign = room ? CAMPAIGNS.find((c) => c.room === room) : null;
  const hero = current !== "All"
    ? CAT_HERO[current]
    : campaign
      ? { image: campaign.poster, video: campaign.video ?? undefined, kicker: campaign.kicker, body: campaign.title }
      : CAT_HERO.All;
  const title = current !== "All" ? current : room || "Shop the house";

  return (
    <main>
      <PageHero
        image={hero.image}
        video={hero.video}
        kicker={hero.kicker}
        title={title}
        body={hero.body}
      />

      {current === "All" && !room ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">The House</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">Walk the house</h2>
          <div className="mt-8 grid-aisles">
            {AISLES.map((a) => (
              <Link
                key={a.cat}
                to="/shop"
                search={{ room: a.room }}
                className="group relative overflow-hidden rounded-xl border border-line"
              >
                <img src={a.image} alt="" className="ken-hover absolute inset-0 h-full w-full object-cover" />
                <div className="hero-veil absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <p className="text-2xs uppercase tracking-[0.24em] text-accent">{a.cat}</p>
                  <h3 className="mt-1 font-display text-xl italic leading-snug break-words text-fg md:text-3xl">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="sticky top-16 z-20 border-y border-accent/20 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/shop"
              search={c === "All" ? {} : { cat: c }}
              className={`inline-flex h-11 shrink-0 snap-start items-center rounded-full border px-4 text-2xs uppercase tracking-wider ${
                current === c ? "border-blush bg-blush text-fg" : "border-line text-muted"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-muted">
            {list.length} {list.length === 1 ? "piece" : "pieces"}
            {current !== "All" ? ` in ${current}` : room ? ` in ${room}` : " in the atelier"}
          </p>
          <Link to="/size-guide" className="text-sm text-accent">
            Size charts
          </Link>
        </div>
        {list.length === 0 ? (
          <p className="mt-10 text-muted">No pieces in this aisle yet.</p>
        ) : (
          <div className="mt-8 grid-shop">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
