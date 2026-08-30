# Femme Silk Atelier — Shopify theme 2.2.0

Online Store 2.0 boutique theme. Folders at **repo / zip root**.

```
assets/  blocks/  config/  layout/  locales/  sections/  snippets/  templates/
```

Theme **2.2.0** matches the live house at silkmoments.com:

- Cinematic Shop, Sizes, Atelier, and Search — ken-burn stills, films, aisle mosaic
- Predictive search over the 36-piece house catalog (works before products are imported)
- Three-room atelier (Night / Body / After dusk), lookbook, craft
- Size guide with visual charts, fit lab, and sister sizes
- Announcement bar, color presets: Noir Atelier, Champagne Pearl, Emerald Velvet

## Install

**Zip:** download [`Femme-Silk-Atelier.zip`](https://github.com/feeds-source/silkmoments-shop/raw/main/public/Femme-Silk-Atelier.zip) → Online Store → Themes → Add theme → **Upload zip file**. Do not unzip. Zip root must show `layout/`, not a wrapper folder.

**GitHub:** connect **`feeds-source/femme-silk-atelier`**, branch **`main`** — not `vite-react-template` and not `silkmoments-shop`. Grant the Shopify GitHub app access to this repo first.

## After install (required so Shop / Sizes / Atelier match the house)

1. Online Store → Themes → **Femme Silk Atelier** (GitHub-connected) → **Publish**
2. Pages → Add page for each:
   - Title **The atelier**, handle `atelier`, theme template **atelier**
   - Title **Size guide**, handle `size-guide`, theme template **size-guide**
   - Title **Contact**, handle `contact`, theme template **contact**
3. Products: option **Size**, track quantity per variant (the theme reads inventory per size)
4. Collections for aisles (`bras`, `babydoll`, `gowns`, `swim`…) when you import the catalog
5. Enable Cash on Delivery if you use it
6. Theme settings → announcement, colors, cart notes, social links

Until products are imported, Shop and Search show the 36-piece house preview.
