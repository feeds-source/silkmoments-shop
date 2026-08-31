import { createFileRoute, Link } from "@tanstack/react-router";
import { CampaignBanners } from "@/components/campaign-banners";
import { CinematicHero } from "@/components/cinematic-hero";
import { ProductCard } from "@/components/product-card";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { SilkMarquee } from "@/components/silk-marquee";
import { AISLES, SPLIT, STORY, TRUST } from "@/lib/banners";
import { PRODUCTS } from "@/lib/catalog";
import { HOUSE_DESCRIPTION, HOUSE_KEYWORDS, HOUSE_TITLE, houseJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOUSE_TITLE },
      { name: "description", content: HOUSE_DESCRIPTION },
      { name: "keywords", content: HOUSE_KEYWORDS },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = PRODUCTS.filter((p) => p.tag).slice(0, 6);

  return (
    <main>
      <SeoJsonLd data={houseJsonLd()} />
      <CinematicHero />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 rounded-xl border border-line bg-surface/80 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-3">
              <span className="text-2xl" aria-hidden="true">{t.icon}</span>
              <div>
                <p className="text-sm font-semibold text-fg">{t.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SilkMarquee />
      <CampaignBanners />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="overflow-hidden rounded-xl border border-line bg-surface md:grid md:grid-cols-[1fr_1.15fr] md:items-center">
          <div className="relative min-h-72 isolate">
            <img src="/banners/hero.jpg" alt="The Femme Atelier" className="absolute inset-0 h-full w-full object-cover" />
            <div className="hero-veil absolute inset-0 opacity-40" />
          </div>
          <div className="p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">{STORY.kicker}</p>
            <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">{STORY.heading}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{STORY.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/atelier"
                className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg"
              >
                Discover The Atelier
              </Link>
              <Link
                to="/size-guide"
                className="inline-flex h-12 items-center rounded-full border border-line px-6 text-xs font-semibold uppercase tracking-widest text-accent"
              >
                Explore Fit Matrix
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
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
                <h3 className="mt-1 font-display text-xl italic leading-snug break-words text-fg md:text-3xl">{a.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">The Collection</p>
            <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">House Highlights</h2>
          </div>
          <Link to="/shop" className="text-sm text-accent">
            View all pieces
          </Link>
        </div>
        <div className="mt-8 grid-bento">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="grid-campaigns border-t border-line">
        {SPLIT.map((p) => (
          <Link
            key={p.title}
            to="/shop"
            search={{ room: p.room }}
            className="group relative block overflow-hidden"
          >
            <img src={p.image} alt="" className="ken-hover absolute inset-0 h-full w-full object-cover" />
            <div className="hero-veil absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">{p.kicker}</p>
              <h3 className="mt-1 font-display text-3xl italic text-fg">{p.title}</h3>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
