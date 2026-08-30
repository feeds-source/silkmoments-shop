import { Link } from "@tanstack/react-router";
import { FOOTER_AISLES } from "@/lib/footer";

export function AtelierFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-accent/25">
      <img src="/banners/lounge.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="footer-veil absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 pb-28 md:py-20 md:pb-20">
        <div className="grid-footer">
          <div className="max-w-lg">
            <p className="font-display text-4xl tracking-[0.12em] text-accent sm:tracking-[0.28em] md:text-5xl">FEMME</p>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-muted">Silk Atelier</p>
            <p className="mt-5 font-display text-2xl italic leading-snug text-fg md:text-3xl">
              Exotic silk, cut for the body.
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Jewel-tone lingerie, night, and lounge. Cash on delivery worldwide. A printable receipt at every order.
            </p>
          </div>

          <div className="mt-12 grid-footer-nav lg:mt-0">
          {FOOTER_AISLES.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs uppercase tracking-[0.22em] text-accent">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.cats.map((c) => (
                  <li key={c}>
                    <Link
                      to="/shop"
                      search={{ cat: c }}
                      className="text-sm text-muted transition-colors duration-150 hover:text-accent"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-accent">House</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted transition-colors duration-150 hover:text-accent">
                  The atelier
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-muted transition-colors duration-150 hover:text-accent">
                  Size guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted transition-colors duration-150 hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-muted transition-colors duration-150 hover:text-accent">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted transition-colors duration-150 hover:text-accent">
                  Shop all
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-subtle">Write</p>
            <a
              href="mailto:info@silkmoments.com"
              className="mt-2 inline-block text-sm text-accent transition-colors duration-150 hover:text-fg"
            >
              info@silkmoments.com
            </a>
          </div>
        </div>
        </div>

        <div className="gold-rule mt-14" />

        <div className="mt-6 flex flex-col gap-3 text-xs uppercase tracking-[0.16em] text-subtle md:flex-row md:items-center md:justify-between">
          <p>Cash on delivery · Sizes 30B–42C · Free Size to XXL</p>
          <p>© {new Date().getFullYear()} Silk Moments · Adult atelier</p>
        </div>
      </div>
    </footer>
  );
}
