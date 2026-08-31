import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CAMPAIGNS } from "@/lib/banners";

export function CampaignBanners() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % CAMPAIGNS.length), 7000);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = CAMPAIGNS[i];

  return (
    <section
      className="relative isolate overflow-hidden border-y border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[52vh] md:min-h-[62vh]">
        {CAMPAIGNS.map((c, idx) => (
          <div
            key={c.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              idx === i ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={idx !== i}
          >
            <img src={c.poster} alt="" className="h-full w-full object-cover ken" />
            {c.video && idx === i && (
              <video
                className="motion-video absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={c.poster}
              >
                <source src={c.video} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
        <div className="hero-veil absolute inset-0" />
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-4 py-12 md:min-h-[62vh]">
          <p className="text-xs uppercase tracking-[0.32em] text-accent">{current.kicker}</p>
          <h2 className="mt-2 font-display text-4xl italic text-fg md:text-5xl">{current.title}</h2>
          <Link
            to="/shop"
            search={{ room: current.room }}
            className="mt-6 inline-flex h-12 w-fit items-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-widest text-accent-fg transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            Shop {current.kicker}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {CAMPAIGNS.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.title}
            className={`h-11 w-11 rounded-full border text-xs ${
              idx === i ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg/70 text-fg"
            }`}
            onClick={() => setI(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
