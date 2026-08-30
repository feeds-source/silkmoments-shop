export function PageHero({
  image,
  video,
  kicker,
  title,
  body,
  children,
}: {
  image: string;
  video?: string;
  kicker: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate min-h-[44vh] overflow-hidden border-b border-accent/20 md:min-h-[56vh]">
      <img src={image} alt="" className="ken absolute inset-0 h-full w-full object-cover" />
      {video ? (
        <video
          className="motion-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={image}
          aria-hidden
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-veil absolute inset-0" />
      <div className="relative mx-auto flex min-h-[44vh] max-w-6xl flex-col justify-end px-4 py-12 md:min-h-[56vh] md:py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">{kicker}</p>
        <h1 className="mt-2 max-w-3xl text-balance font-display text-4xl italic leading-tight text-fg md:text-6xl">
          {title}
        </h1>
        {body ? <p className="mt-4 max-w-lg text-pretty text-muted">{body}</p> : null}
        {children}
      </div>
    </section>
  );
}
