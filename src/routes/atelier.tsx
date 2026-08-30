import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ATELIER_CRAFT, ATELIER_LOOK, ATELIER_ROOMS } from "@/lib/house";

export const Route = createFileRoute("/atelier")({ component: Atelier });

function Atelier() {
  return (
    <main>
      <PageHero
        image="/banners/hero.jpg"
        video="/banners/hero.mp4"
        kicker="House"
        title="The atelier"
        body="Exotic silk, cut for the body. Emerald, champagne, ruby — still-life, then motion."
      >
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Shop the house
        </Link>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Femme</p>
            <h2 className="mt-2 max-w-md text-balance font-display text-3xl italic text-fg md:text-4xl">
              An adult house of jewel silk.
            </h2>
          </div>
          <div className="space-y-4 text-pretty text-muted">
            <p>
              Femme is Silk Moments after dusk: lingerie, night, and lounge. Banners that breathe, fabric
              that moves. Every still is shot as a painting, then the film starts.
            </p>
            <p>
              Pieces are cut for 30B–42C and Free Size to XXL. Cash on delivery worldwide. A printable
              receipt at every order.
            </p>
            <p className="text-sm text-subtle">
              Returns are not offered on worn pieces — measure first, then write{" "}
              <a className="text-accent" href="mailto:info@silkmoments.com">
                info@silkmoments.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Three rooms</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">Walk the house</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ATELIER_ROOMS.map((room) => (
              <article key={room.title} className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="relative min-h-56 overflow-hidden">
                  <img src={room.image} alt="" className="ken absolute inset-0 h-full w-full object-cover" />
                  {"video" in room && room.video ? (
                    <video
                      className="motion-video absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={room.image}
                      aria-hidden
                    >
                      <source src={room.video} type="video/mp4" />
                    </video>
                  ) : null}
                  <div className="hero-veil absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-2xs uppercase tracking-[0.24em] text-accent">{room.kicker}</p>
                    <h3 className="mt-1 font-display text-3xl italic text-fg">{room.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-pretty text-muted">{room.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {room.cats.map((c) => (
                      <Link
                        key={c}
                        to="/shop"
                        search={{ cat: c }}
                        className="inline-flex h-11 items-center rounded-full border border-line px-3 text-2xs uppercase tracking-wider text-muted hover:border-accent hover:text-accent"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">How we cut</p>
        <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">Silk, lace, gold</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ATELIER_CRAFT.map((item) => (
            <article key={item.title} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-display text-2xl italic text-fg">{item.title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/size-guide"
            className="inline-flex h-12 items-center rounded-full border border-line px-6 text-xs uppercase tracking-widest text-accent hover:border-accent"
          >
            Size charts
          </Link>
          <p className="text-sm text-subtle">Tape snug, stand easy. Charts are the atelier starting point.</p>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Lookbook</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg md:text-4xl">Still-life, then motion</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {ATELIER_LOOK.map((shot) => (
              <figure
                key={shot.src}
                className="relative min-h-44 overflow-hidden rounded-xl border border-line md:min-h-64"
              >
                <img src={shot.src} alt="" className="ken absolute inset-0 h-full w-full object-cover" />
                {"video" in shot && shot.video ? (
                  <video
                    className="motion-video absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={shot.src}
                    aria-hidden
                  >
                    <source src={shot.video} type="video/mp4" />
                  </video>
                ) : null}
                <figcaption className="absolute inset-x-0 bottom-0 bg-bg/70 px-3 py-2 text-2xs uppercase tracking-widest text-muted">
                  {shot.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-line">
        <img src="/banners/lounge.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="hero-veil absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Cash on delivery</p>
          <h2 className="mt-2 max-w-xl text-balance font-display text-4xl italic text-fg md:text-5xl">
            Worldwide. A receipt you can print.
          </h2>
          <p className="mt-4 max-w-md text-pretty text-muted">
            Confirm the bag, we pack in a gift box, you pay when it arrives. Tracking once the atelier
            dispatches.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg"
          >
            Shop the house
          </Link>
        </div>
      </section>
    </main>
  );
}
