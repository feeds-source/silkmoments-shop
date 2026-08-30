import { Link } from "@tanstack/react-router";
import { HERO } from "@/lib/banners";

export function CinematicHero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden border-b border-line">
      <img
        src={HERO.poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover ken"
      />
      <video
        className="motion-video absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={HERO.poster}
        aria-hidden
      >
        <source src={HERO.video} type="video/mp4" />
      </video>
      <div className="hero-veil absolute inset-0" />
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 py-16">
        <p className="stagger-item text-xs uppercase tracking-[0.32em] text-accent">{HERO.kicker}</p>
        <h1 className="stagger-item mt-3 max-w-xl font-display text-5xl italic leading-tight text-fg md:text-7xl">
          {HERO.title}
        </h1>
        <p className="stagger-item mt-4 max-w-md text-muted">{HERO.body}</p>
        <Link
          to="/shop"
          className="stagger-item mt-8 inline-flex h-12 w-fit items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Shop the house
        </Link>
      </div>
    </section>
  );
}
