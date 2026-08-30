# Femme Silk Atelier — Shopify theme 2.1.0

Online Store 2.0 boutique theme. Folders at **repo / zip root**.

```
assets/  blocks/  config/  layout/  locales/  sections/  snippets/  templates/
```

Theme **2.1.0** matches the live atelier shop (Cloudflare + GitHub):

- Cinematic hero film, silk marquee, rotating campaign films
- Six aisles from house stills (babydoll, sets, gowns, swim, corsetry, body stockings)
- Exotic collection in motion with size menus linked to inventory
- Full 36-piece house catalog as a preview fallback before products are imported
- Size guide with visual charts, fit lab, and sister sizes
- Night / Body / After dusk footer, announcement bar, predictive search
- Color presets: Noir Atelier, Champagne Pearl, Emerald Velvet

## Install

**Zip:** download [`Femme-Silk-Atelier.zip`](https://github.com/feeds-source/silkmoments-shop/raw/main/public/Femme-Silk-Atelier.zip) → Online Store → Themes → Add theme → **Upload zip file**. Do not unzip. Zip root must show `layout/`, not a wrapper folder.

**GitHub:** connect **`feeds-source/femme-silk-atelier`**, branch **`main`** — not `vite-react-template` and not `silkmoments-shop`. Grant the Shopify GitHub app access to this repo first.

## After install

1. Pages → **Size guide**, handle `size-guide`, template **size-guide**
2. Products: option **Size**, track quantity per variant (the theme reads inventory per size)
3. Collections for aisles (`bras`, `babydoll`, `gowns`, `swim`…)
4. Enable Cash on Delivery if you use it
5. Theme settings → announcement, colors, cart notes, social links
