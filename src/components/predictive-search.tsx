import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { searchHouse, type HouseHit } from "@/lib/search";
import { money } from "@/lib/quote";

export function PredictiveSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<HouseHit>(() => searchHouse(""));

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const handle = window.setTimeout(() => setHits(searchHouse(query, 6)), 180);
    return () => window.clearTimeout(handle);
  }, [query, open]);

  function close() {
    onOpenChange(false);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    close();
    void navigate({ to: "/search", search: q ? { q } : {} });
  }

  if (!open) return null;

  const typed = query.trim().length >= 2;
  const empty = typed && hits.products.length === 0 && hits.aisles.length === 0 && hits.pages.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search the atelier"
    >
      <button type="button" className="absolute inset-0 bg-bg/85 backdrop-blur-md" aria-label="Close search" onClick={close} />
      <div className="relative z-10 border-b border-line bg-surface shadow-[0_10px_30px_rgb(0_0_0_/_0.5)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <form role="search" className="min-w-0 flex-1" onSubmit={submit}>
              <label htmlFor={inputId} className="sr-only">
                Search products and collections
              </label>
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-4 size-4 text-accent" aria-hidden />
                <input
                  ref={inputRef}
                  id={inputId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search silk gowns, babydolls, bras, sizes..."
                  role="combobox"
                  aria-expanded
                  aria-autocomplete="list"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-14 w-full rounded-full border border-line bg-elevated pl-11 pr-12 text-base text-fg outline-none transition-colors duration-150 placeholder:text-subtle focus:border-accent"
                />
                {query ? (
                  <button
                    type="button"
                    className="absolute right-4 grid size-8 place-items-center text-muted"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </form>
            <button
              type="button"
              className="hidden h-11 shrink-0 items-center rounded-full border border-line px-4 text-xs uppercase tracking-[0.14em] text-fg transition-colors duration-150 hover:border-accent hover:text-accent sm:inline-flex"
              onClick={close}
            >
              Close
            </button>
          </div>

          <div className="mt-6 max-h-[60vh] overflow-y-auto pb-2">
            {empty ? (
              <p className="py-4 text-muted">No pieces found matching “{query.trim()}”.</p>
            ) : (
              <>
                {hits.aisles.length ? (
                  <div className="mb-6">
                    <p className="text-2xs uppercase tracking-[0.28em] text-accent">Aisles & collections</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hits.aisles.map((a) => (
                        <Link
                          key={a.cat}
                          to="/shop"
                          search={{ cat: a.cat }}
                          onClick={close}
                          className="inline-flex h-11 items-center rounded-full border border-line px-4 text-xs uppercase tracking-wider text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
                        >
                          {a.cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hits.pages.length ? (
                  <div className="mb-6">
                    <p className="text-2xs uppercase tracking-[0.28em] text-accent">House</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hits.pages.map((p) => (
                        <Link
                          key={p.href}
                          to={p.href}
                          onClick={close}
                          className="inline-flex h-11 items-center rounded-full border border-line px-4 text-xs uppercase tracking-wider text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {hits.products.length ? (
                  <div>
                    <p className="text-2xs uppercase tracking-[0.28em] text-accent">Pieces in the atelier</p>
                    <div className="predictive-grid mt-4">
                      {hits.products.map((p) => (
                        <Link
                          key={p.id}
                          to="/shop/$productId"
                          params={{ productId: p.id }}
                          onClick={close}
                          className="flex items-center gap-4 rounded-lg border border-line bg-elevated p-3 transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:border-accent"
                        >
                          <img
                            src={p.image}
                            alt=""
                            className="h-16 w-12 shrink-0 rounded-sm object-cover outline outline-1 -outline-offset-1 outline-fg/10"
                          />
                          <span className="min-w-0">
                            <strong className="block truncate text-sm font-medium text-fg">{p.name}</strong>
                            <span className="text-sm text-accent">{money(p.price)}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    {typed ? (
                      <button
                        type="button"
                        className="mt-5 text-sm text-accent"
                        onClick={() => {
                          close();
                          void navigate({ to: "/search", search: { q: query.trim() } });
                        }}
                      >
                        See all results
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
