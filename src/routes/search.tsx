import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { searchHouse } from "@/lib/search";

type SearchParams = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(q);
  const hits = searchHouse(q, 48);
  const typed = q.trim().length >= 2;
  const title = typed ? q.trim() : "The house";

  useEffect(() => {
    setDraft(q);
  }, [q]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = draft.trim();
    void navigate({ search: next ? { q: next } : {} });
  }

  return (
    <main>
      <PageHero
        image="/banners/lounge.jpg"
        kicker="Search"
        title={title}
        body={
          typed
            ? `${hits.products.length} ${hits.products.length === 1 ? "piece" : "pieces"} matching the house.`
            : "Silk gowns, babydolls, bras, and the size studio."
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <form role="search" className="flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={submit}>
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search the atelier</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-accent" />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search silk gowns, babydolls, bras, sizes..."
              className="h-14 w-full rounded-full border border-line bg-elevated pl-11 pr-4 text-base text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="h-14 rounded-full bg-accent px-8 text-xs font-semibold uppercase tracking-widest text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            Search
          </button>
        </form>

        {hits.aisles.length ? (
          <div className="mt-10">
            <p className="text-2xs uppercase tracking-[0.28em] text-accent">Aisles & collections</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {hits.aisles.map((a) => (
                <Link
                  key={a.cat}
                  to="/shop"
                  search={{ cat: a.cat }}
                  className="inline-flex h-11 items-center rounded-full border border-line px-4 text-xs uppercase tracking-wider text-muted hover:border-accent hover:text-accent"
                >
                  {a.cat}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {hits.pages.length ? (
          <div className="mt-8">
            <p className="text-2xs uppercase tracking-[0.28em] text-accent">House</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {hits.pages.map((p) => (
                <Link
                  key={p.href}
                  to={p.href}
                  className="inline-flex h-11 items-center rounded-full border border-line px-4 text-xs uppercase tracking-wider text-muted hover:border-accent hover:text-accent"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10">
          <p className="text-sm text-muted">
            {typed
              ? hits.products.length
                ? `${hits.products.length} ${hits.products.length === 1 ? "piece" : "pieces"}`
                : `No pieces found matching “${q.trim()}”.`
              : "Type two letters to search the atelier."}
          </p>
          {hits.products.length ? (
            <div className="mt-8 grid-shop">
              {hits.products.map((p) => (
                <ProductCard key={p.id} product={p} wide={Boolean(p.tag)} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
