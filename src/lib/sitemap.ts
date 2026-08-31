import { CATEGORIES, PRODUCTS } from "./catalog";
import { ROOMS } from "./footer";
import { SITE_URL } from "./seo";

type Entry = { path: string; changefreq: string; priority: string };

function escapeXml(value: string) {
  const amp = String.fromCharCode(38);
  return value
    .replace(/&/g, amp + "amp;")
    .replace(/</g, amp + "lt;")
    .replace(/>/g, amp + "gt;")
    .replace(/"/g, amp + "quot;");
}

export function sitemapEntries(): Entry[] {
  const entries: Entry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/shop", changefreq: "daily", priority: "0.9" },
    { path: "/atelier", changefreq: "monthly", priority: "0.5" },
    { path: "/size-guide", changefreq: "monthly", priority: "0.6" },
    { path: "/contact", changefreq: "yearly", priority: "0.3" },
  ];
  for (const room of Object.keys(ROOMS)) {
    entries.push({ path: `/shop?room=${encodeURIComponent(room)}`, changefreq: "weekly", priority: "0.8" });
  }
  for (const cat of CATEGORIES) {
    if (cat === "All") continue;
    entries.push({ path: `/shop?cat=${encodeURIComponent(cat)}`, changefreq: "weekly", priority: "0.7" });
  }
  for (const p of PRODUCTS) {
    entries.push({ path: `/shop/${p.id}`, changefreq: "weekly", priority: "0.8" });
  }
  return entries;
}

export function buildSitemapXml(lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = sitemapEntries()
    .map(
      (e) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${e.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /register
Disallow: /account
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}
