import { createFileRoute, Link } from "@tanstack/react-router";
import { CampaignBanners } from "@/components/campaign-banners";
import { CinematicHero } from "@/components/cinematic-hero";
import { ProductCard } from "@/components/product-card";
import { SilkMarquee } from "@/components/silk-marquee";
import { CAMPAIGNS, AISLES } from "@/lib/banners";
import { PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = PRODUCTS.filter((p) => p.tag);

  return (
    <main>
      <CinematicHero />
      <SilkMarquee />
      <CampaignBanners />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">New aisles</p>
        <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">More of the house</h2>
        <div className="mt-8 grid-aisles">
          {AISLES.map((a) => (
            <Link
              key={a.cat}
              to="/shop"
              search={{ cat: a.cat }}
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
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Exotic collection</p>
            <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">Lingerie in motion</h2>
          </div>
          <Link to="/shop" className="text-sm text-accent">
            View all
          </Link>
        </div>
        <div className="mt-8 grid-bento">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="grid-campaigns border-t border-line">
        {CAMPAIGNS.map((c) => (
          <Link
            key={c.id}
            to="/shop"
            search={{ cat: c.cat }}
            className="group relative block overflow-hidden"
          >
            <img src={c.poster} alt="" className="ken-hover absolute inset-0 h-full w-full object-cover" />
            <div className="hero-veil absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">{c.kicker}</p>
              <h3 className="mt-1 font-display text-3xl italic text-fg">{c.title}</h3>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
