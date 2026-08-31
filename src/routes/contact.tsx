import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Femme — Silk Moments" },
      { name: "description", content: "Write to the Femme atelier. Orders, fit, and house notes — info@silkmoments.com." },
      { name: "keywords", content: "contact silk moments, femme atelier email, silk lingerie support" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-accent/20">
        <img src="/banners/sleep.jpg" alt="" className="ken absolute inset-0 h-full w-full object-cover" />
        <div className="hero-veil absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 py-16">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Atelier</p>
          <h1 className="mt-2 font-display text-5xl italic text-fg">Write to the house</h1>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="max-w-md text-muted">Questions about an order, a fit, or a size from 30B to 42C? The atelier replies by email.</p>
        <a href="mailto:info@silkmoments.com" className="mt-6 inline-block text-accent">
          info@silkmoments.com
        </a>
        <p className="mt-8 text-sm text-subtle">Silk Moments · cash on delivery worldwide</p>
      </div>
    </main>
  );
}
