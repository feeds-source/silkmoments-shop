import type { Product } from "./catalog";

export const SITE_NAME = "Femme — Silk Moments";
export const SITE_URL = "https://www.silkmoments.com";

export const HOUSE_KEYWORDS =
  "silk lingerie, jewel tone lingerie, silk babydoll, lace teddy, silk nightgown, bridal lingerie, silk robe, wireless bra, t-shirt bra, lace bralette, balconette set, silk slip, satin gown, silk bustier, lace waspie, seamed stockings, shapewear, silk kaftan, cashmere wrap, silk sleep mask, cash on delivery lingerie, Femme Silk Moments, exotic silk";

export const HOUSE_DESCRIPTION =
  "Femme by Silk Moments — jewel-tone silk lingerie, lace babydolls, teddies, bridal robes, and lounge. Cash on delivery worldwide with discreet packaging.";

export const HOUSE_TITLE = "Femme — Silk Moments | Silk lingerie, night & lounge";

/** Shopper queries — not OEM / factory terms. */
export const PRODUCT_KEYWORDS: Record<string, string> = {
  "everyday-soft-bra": "wireless soft cup bra, t-shirt wireless bra, modal microfiber everyday bra",
  "ultimate-tshirt-bra": "molded cup t-shirt bra, seamless tshirt bra, one-piece molded bra",
  "first-fit-teen-bra": "stretch lace bralette, first bra wireless bralette, lace bralette",
  "lace-balconette-set": "lace balconette bra and panty set, 2 piece lingerie set, eyelash lace balconette",
  "daily-hipster": "modal hipster panty, mid rise brief, modal jersey underwear",
  "seamless-thong": "seamless thong, laser cut panty, no-show thong",
  "ruby-brazilian": "silk brazilian panty, satin brief gold trim, jewel tone silk underwear",
  "lace-camisole": "stretch lace camisole, lace cami top, champagne lace undershirt",
  "ruby-babydoll": "ruby lace babydoll set, short lace chemise, 2 piece babydoll",
  "satin-night-set": "satin cami shorts pajama set, satin tap short night set, 2 piece satin sleepwear",
  "short-lace-nighty": "sheer lace nightgown, short lace chemise, transparent lace nighty",
  "silk-night-slip": "silk night slip, floor length silk chemise, champagne silk nightdress",
  "satin-gown": "black satin nightgown, floor length satin gown, long satin sleep gown",
  "noir-teddy": "black lace teddy, one piece lace bodysuit lingerie, eyelash lace teddy",
  "emerald-teddy": "silk teddy, emerald silk bodysuit, gold lace trim teddy",
  "mesh-bodysuit": "mesh contour bodysuit, sculpting mesh teddy, power mesh lingerie bodysuit",
  "ivory-bridal-set": "ivory bridal lingerie set, pearl clasp lace bra panty, wedding night lingerie set",
  "getting-ready-robe": "ivory silk bridal robe, getting ready robe, satin charmeuse wedding robe",
  "emerald-bustier": "silk bustier, boned bustier corset, lace up silk corset",
  "ruby-waspie": "lace waspie corset, short underbust corset, waspie with gold hardware",
  "seamed-stockings": "seamed stockings, back seam silk look hosiery, vintage seamed stockings",
  "lace-holdups": "lace hold ups, silicone welt stay-up stockings, lace top holdups",
  "lace-garter": "lace garter belt, 4 strap garter, gold hardware garter belt",
  "body-stocking": "lace body stocking, sheer bodystocking, one piece lace catsuit",
  "high-waist-shaper": "high waist shaper, light control shapewear brief, power mesh tummy shaper",
  "slip-short": "anti chafe slip short, dress short liner, shapewear slip shorts",
  "sculpt-midi": "midi shapewear slip, smoothing half slip, champagne underdress slip",
  "silk-bikini": "silk bikini set, padded satin bikini, jewel tone two piece swimwear",
  "cloud-robe": "knit lounge robe, mid weight dressing gown, self tie knit robe",
  "lounge-wide-pant": "modal wide leg lounge pant, draped palazzo lounge, modal sleep pant",
  "silk-kaftan": "silk kaftan, jewel tone caftan, silk resort cover up",
  "orchid-sarong": "silk sarong, satin wrap skirt, resort sarong",
  "thermal-set": "brushed thermal pajama set, waffle thermal lounge set, winter layering set",
  "plum-wrap": "cashmere wrap, merino cashmere shawl, knitted wrap",
  "silk-eye-mask": "silk sleep mask, embroidered eye mask, mulberry silk sleep mask",
  "gold-body-chain": "gold body chain, body jewelry, gold plated body chain",
};

export function keywordsFor(id: string) {
  return PRODUCT_KEYWORDS[id] ?? HOUSE_KEYWORDS;
}

export function productTitle(name: string) {
  return `${name} | ${SITE_NAME}`;
}

export function productDescription(p: Pick<Product, "name" | "description" | "category">) {
  return `${p.name} — ${p.description} ${p.category} in jewel silk and lace. Cash on delivery worldwide.`;
}

export function shopTitle(aisle?: string) {
  if (!aisle || aisle === "All") return `Shop silk lingerie | ${SITE_NAME}`;
  return `${aisle} | ${SITE_NAME}`;
}

export function shopDescription(aisle?: string) {
  if (!aisle || aisle === "All") {
    return "Shop the house: silk bras, lace babydolls, teddies, nightgowns, bridal robes, and lounge. Cash on delivery worldwide.";
  }
  return `${aisle} from Femme by Silk Moments — jewel-tone silk and lace. Cash on delivery worldwide.`;
}

export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: productDescription(p),
    image: `${SITE_URL}${p.image}`,
    sku: p.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: p.category,
    keywords: keywordsFor(p.id),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${p.id}`,
      priceCurrency: "USD",
      price: p.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };
}

export function houseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: SITE_NAME,
    url: SITE_URL,
    description: HOUSE_DESCRIPTION,
    keywords: HOUSE_KEYWORDS,
    brand: SITE_NAME,
  };
}

export function productHead(p: Product | undefined) {
  if (!p) {
    return {
      meta: [
        { title: `Piece not found | ${SITE_NAME}` },
        { name: "description", content: HOUSE_DESCRIPTION },
        { name: "robots", content: "noindex" },
      ],
    };
  }
  const title = productTitle(p.name);
  const description = productDescription(p);
  const keywords = keywordsFor(p.id);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { property: "og:image", content: `${SITE_URL}${p.image}` },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  };
}
