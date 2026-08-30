import { MARQUEE } from "@/lib/banners";

export function SilkMarquee() {
  const tiles = [...MARQUEE, ...MARQUEE];
  return (
    <section className="overflow-hidden border-b border-line bg-surface py-4" aria-label="Moving atelier stills">
      <div className="marquee-track flex w-max gap-3">
        {tiles.map((t, i) => (
          <img
            key={`${t.src}-${i}`}
            src={t.src}
            alt={i < MARQUEE.length ? t.alt : ""}
            className="h-36 w-56 shrink-0 rounded-lg object-cover md:h-48 md:w-72"
          />
        ))}
      </div>
    </section>
  );
}
