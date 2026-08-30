import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <main>
      <section className="relative isolate min-h-[48vh] overflow-hidden border-b border-line">
        <img src="/banners/hero.jpg" alt="" className="ken absolute inset-0 h-full w-full object-cover" />
        <video
          className="motion-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/banners/hero.jpg"
          aria-hidden
        >
          <source src="/banners/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-veil absolute inset-0" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-3xl flex-col justify-end px-4 py-12">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">House</p>
          <h1 className="mt-2 font-display text-5xl italic text-fg">Femme</h1>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-lg text-muted">
          An adult atelier of jewel silk: emerald, champagne, ruby. Bras, nighties, corsetry, and lounge — still-life,
          then motion. Cash on delivery worldwide, a printable receipt at every order.
        </p>
        <p className="mt-4 text-muted">
          The atelier is jewel-toned: emerald silk, champagne ribbon, ruby lace. Still-life, then motion — banners that
          breathe, fabric that moves.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg"
        >
          Shop the house
        </Link>
      </div>
    </main>
  );
}
