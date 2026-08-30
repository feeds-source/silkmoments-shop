(() => {
  const menuBtn = document.querySelector("[data-menu]");
  const navMob = document.querySelector("[data-nav-mob]");
  menuBtn?.addEventListener("click", () => {
    const open = navMob.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  const media = document.querySelectorAll("[data-campaign-media]");
  const copies = document.querySelectorAll("[data-campaign-copy]");
  const dots = document.querySelectorAll("[data-campaign-dot]");
  const count = media.length;
  if (count) {
    let i = 0;
    const show = (n) => {
      i = ((n % count) + count) % count;
      media.forEach((el, idx) => {
        el.hidden = idx !== i;
        el.querySelectorAll("video").forEach((v) => {
          if (idx === i) v.play().catch(() => {});
          else v.pause();
        });
      });
      copies.forEach((el, idx) => {
        el.hidden = idx !== i;
      });
      dots.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
    };
    dots.forEach((el, idx) => el.addEventListener("click", () => show(idx)));
    setInterval(() => show(i + 1), 7000);
  }

  document.querySelectorAll('form[action*="/cart/add"]').forEach((form) => {
    form.addEventListener("submit", async (e) => {
      if (!form.hasAttribute("data-ajax")) return;
      e.preventDefault();
      const body = new FormData(form);
      await fetch(window.Shopify?.routes?.root ? `${window.Shopify.routes.root}cart/add.js` : "/cart/add.js", {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      const cart = await fetch("/cart.js").then((r) => r.json());
      document.querySelectorAll("[data-cart-count]").forEach((el) => {
        el.textContent = String(cart.item_count);
      });
      const btn = form.querySelector("[type=submit]");
      if (btn) {
        const prev = btn.textContent;
        btn.textContent = "Added";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1400);
      }
    });
  });
  document.querySelectorAll(".variants input[name=id]").forEach((input) => {
    input.addEventListener("change", () => {
      const note = document.querySelector("[data-inv-note]");
      const qty = document.querySelector("#qty");
      const btn = input.form?.querySelector("[type=submit]");
      const available = input.dataset.available === "true";
      const stock = Number(input.dataset.inventory || 0);
      if (note) {
        const guide = note.querySelector("a")?.outerHTML || "";
        note.innerHTML = available
          ? `${stock || ""} in the atelier · ${guide}`
          : `Sold out · ${guide}`;
      }
      if (qty && stock > 0) qty.max = String(stock);
      if (btn) {
        btn.disabled = !available;
        btn.textContent = available ? "Add to bag" : "Sold out";
      }
    });
  });

  const fit = document.querySelector("[data-fit]");
  if (fit) {
    const bands = [
      { band: "30", lo: 63, hi: 67 },
      { band: "32", lo: 68, hi: 72 },
      { band: "34", lo: 73, hi: 77 },
      { band: "36", lo: 78, hi: 82 },
      { band: "38", lo: 83, hi: 87 },
      { band: "40", lo: 88, hi: 92 },
      { band: "42", lo: 93, hi: 97 },
    ];
    const cut = new Set([
      "30B", "32A", "32B", "32C", "32D", "34A", "34B", "34C", "34D",
      "36B", "36C", "36D", "38B", "38C", "38D", "40B", "40C", "42B", "42C",
    ]);
    const alpha = [
      { size: "XS", bust: [78, 82], waist: [60, 64], hip: [86, 90] },
      { size: "S", bust: [83, 87], waist: [65, 69], hip: [91, 95] },
      { size: "M", bust: [88, 92], waist: [70, 74], hip: [96, 100] },
      { size: "L", bust: [93, 97], waist: [75, 79], hip: [101, 105] },
      { size: "XL", bust: [98, 104], waist: [80, 86], hip: [106, 112] },
      { size: "XXL", bust: [105, 112], waist: [87, 94], hip: [113, 120] },
    ];
    const hose = [
      { size: "XS", height: [150, 158], thigh: [48, 52] },
      { size: "S", height: [155, 163], thigh: [50, 54] },
      { size: "M", height: [160, 168], thigh: [53, 57] },
      { size: "L", height: [165, 173], thigh: [56, 61] },
      { size: "XL", height: [170, 178], thigh: [60, 66] },
      { size: "XXL", height: [173, 182], thigh: [65, 72] },
    ];
    const corset = [
      { size: "XS", open: [64, 68] },
      { size: "S", open: [69, 73] },
      { size: "M", open: [74, 78] },
      { size: "L", open: [79, 83] },
      { size: "XL", open: [84, 90] },
      { size: "XXL", open: [91, 98] },
    ];
    const inSpan = (n, span) => n >= span[0] && n <= span[1];
    const pick = (rows, key, n) => {
      const hit = rows.find((r) => inSpan(n, r[key]));
      if (hit) return hit.size;
      return n < rows[0][key][0] ? rows[0].size : rows[rows.length - 1].size;
    };
    const cupOf = (gap) => (gap < 14 ? "A" : gap < 16 ? "B" : gap < 18 ? "C" : "D");
    const bandOf = (under) => {
      const hit = bands.find((b) => under >= b.lo && under <= b.hi);
      if (hit) return hit.band;
      return bands.reduce((best, b) => {
        const mid = (b.lo + b.hi) / 2;
        const d = Math.abs(under - mid);
        return d < best.d ? { band: b.band, d } : best;
      }, { band: "34", d: Infinity }).band;
    };
    const sisters = (size) => {
      const band = Number(size.slice(0, -1));
      const cups = "ABCD";
      const ci = cups.indexOf(size.slice(-1));
      if (!band || ci < 0) return [];
      const vol = (band - 30) / 2 + ci;
      const out = [];
      for (const b of [30, 32, 34, 36, 38, 40, 42]) {
        const c = vol - (b - 30) / 2;
        if (Number.isInteger(c) && c >= 0 && c < 4) out.push(`${b}${cups[c]}`);
      }
      return out;
    };
    let unit = "cm";
    const units = fit.querySelector("[data-fit-units]");
    const out = fit.querySelector("[data-fit-out]");
    const hint = fit.querySelector("[data-fit-hint]");
    units?.querySelectorAll("[data-unit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        unit = btn.dataset.unit;
        units.querySelectorAll("[data-unit]").forEach((b) => b.classList.toggle("is-on", b === btn));
        render();
      });
    });
    const cm = (name) => {
      const n = Number(fit[name]?.value);
      if (!n) return undefined;
      return unit === "in" ? n * 2.54 : n;
    };
    const render = () => {
      const under = cm("under");
      const bust = cm("bust");
      const waist = cm("waist");
      const hip = cm("hip");
      const height = cm("height");
      const thigh = cm("thigh");
      const items = [];
      if (under && bust) {
        const theoretical = `${bandOf(under)}${cupOf(bust - under)}`;
        const chain = sisters(theoretical);
        const size = cut.has(theoretical) ? theoretical : chain.find((s) => cut.has(s)) || theoretical;
        const sib = sisters(size).filter((s) => s !== size && cut.has(s));
        items.push({
          label: "Bra",
          size,
          note: cut.has(theoretical)
            ? `Underbust ${Math.round(under)} cm, gap ${Math.round(bust - under)} cm.${sib.length ? " Sisters " + sib.join(" · ") : ""}`
            : `${theoretical} is not cut. Nearest house size ${size}.`,
        });
      }
      if (bust || waist || hip) {
        const votes = [];
        if (bust) votes.push(pick(alpha, "bust", bust));
        if (waist) votes.push(pick(alpha, "waist", waist));
        if (hip) votes.push(pick(alpha, "hip", hip));
        const counts = {};
        votes.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
        const body = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        items.push({ label: "Body", size: body, note: new Set(votes).size > 1 ? `Between ${[...new Set(votes)].join(" / ")}` : "Matches bust, waist, and hip." });
        const night = body === "XS" ? "S" : body === "XXL" ? "XL" : body;
        items.push({ label: "Nighty", size: night, note: bust && bust >= 83 && bust <= 97 ? "Also drapes in Free Size." : "Free Size is cut for S–L busts." });
        const gown = body === "XS" || body === "S" ? "M" : body;
        items.push({ label: "Gown", size: gown, note: "Hem is centre-back; taller frames take the next length." });
      }
      if (waist) {
        items.push({ label: "Corset", size: pick(corset, "open", waist), note: "Size to the open waist, then lace 4–6 cm." });
      }
      if (height) {
        let size = pick(hose, "height", height);
        let note = `Height ${Math.round(height)} cm.`;
        if (thigh) {
          const byThigh = pick(hose, "thigh", thigh);
          if (byThigh !== size) {
            note = `Height suggests ${size}, thigh suggests ${byThigh} — take ${byThigh} for the welt.`;
            size = byThigh;
          }
        }
        items.push({ label: "Hosiery", size, note });
      }
      if (!items.length) {
        out.hidden = true;
        if (hint) hint.hidden = false;
        return;
      }
      out.hidden = false;
      if (hint) hint.hidden = true;
      out.innerHTML = items
        .map((i) => `<li><p class="kicker">${i.label}</p><strong>${i.size}</strong><p class="subtle">${i.note}</p></li>`)
        .join("");
    };
    fit.addEventListener("input", render);
  }

<<<<<<< HEAD
=======
  // House catalog — used when Shopify has no products yet (GitHub / zip preview).
  const HOUSE = [
    ["everyday-soft-bra","Everyday Soft Cup Bra","Bras",42],
    ["ultimate-tshirt-bra","Ultimate T-Shirt Bra","Bras",48],
    ["first-fit-teen-bra","First Fit Bralette","Bras",28],
    ["lace-balconette-set","Lace Balconette Set","Bra Sets",78],
    ["daily-hipster","Daily Hipster Brief","Panties",16],
    ["seamless-thong","Seamless Soft Thong","Panties",14],
    ["ruby-brazilian","Ruby Silk Brazilian","Panties",22],
    ["lace-camisole","Champagne Lace Camisole","Camisole",36],
    ["ruby-babydoll","Ruby Lace Babydoll","Babydoll",88],
    ["satin-night-set","Satin Night Cami Set","Short Nighty",64],
    ["short-lace-nighty","Noir Short Lace Nighty","Short Nighty",72],
    ["silk-night-slip","Champagne Night Slip","Long Nighty",86],
    ["satin-gown","Black Satin Gown","Gowns",96],
    ["noir-teddy","Noir Lace Teddy","Teddies",98],
    ["emerald-teddy","Emerald Silk Teddy","Teddies",108],
    ["mesh-bodysuit","Mesh Contour Bodysuit","Teddies",88],
    ["ivory-bridal-set","Ivory Pearl Bridal Set","Bridal",148],
    ["getting-ready-robe","Pearl Getting-Ready Robe","Bridal",118],
    ["emerald-bustier","Emerald Silk Bustier","Corsetry",128],
    ["ruby-waspie","Ruby Lace Waspie","Corsetry",96],
    ["seamed-stockings","Champagne Seamed Stockings","Hosiery",32],
    ["lace-holdups","Noir Lace Hold-Ups","Hosiery",28],
    ["lace-garter","Noir Lace Garter","Hosiery",48],
    ["body-stocking","Noir Lace Body Stocking","Body Stockings",42],
    ["high-waist-shaper","High-Waist Soft Shaper","Shapewear",54],
    ["slip-short","Everyday Slip Short","Shapewear",36],
    ["sculpt-midi","Sculpt Midi Slip","Shapewear",62],
    ["silk-bikini","Ruby Silk Bikini","Swim",58],
    ["cloud-robe","Cloud Knit Robe","Loungewear",72],
    ["lounge-wide-pant","Wide-Leg Lounge Pant","Loungewear",58],
    ["silk-kaftan","Jewel Silk Kaftan","Resort",132],
    ["orchid-sarong","Orchid Silk Sarong","Resort",64],
    ["thermal-set","Soft Thermal Set","Thermal",68],
    ["plum-wrap","Plum Cashmere Wrap","Thermal",94],
    ["silk-eye-mask","Champagne Silk Mask","Accessories",24],
    ["gold-body-chain","Gold Body Chain","Accessories",54],
  ].map(([id, name, cat, price]) => ({ id, name, cat, price }));

  const AISLE_NAMES = ["Babydoll","Bra Sets","Gowns","Swim","Corsetry","Body Stockings","Bras","Panties","Teddies","Bridal","Loungewear","Hosiery","Shapewear","Resort","Camisole","Short Nighty","Long Nighty","Thermal","Accessories"];
  const PAGES = [
    { title: "Size guide", href: "/pages/size-guide", terms: "size sizes fit chart measure band cup sister bra 30b 32b 34c" },
    { title: "The atelier", href: "/pages/atelier", terms: "atelier about house craft silk story femme" },
    { title: "Contact", href: "/pages/contact", terms: "contact email write atelier" },
  ];
  const EXTRA = {
    bras: "bra bralette cup balconette t-shirt",
    "bra sets": "bra set balconette pair",
    panties: "panty brief thong hipster brazilian",
    camisole: "cami lace",
    babydoll: "baby doll nighty nightie short lace",
    "short nighty": "nightie night cami satin sleep",
    "long nighty": "nightie slip gown sleep silk",
    gowns: "gown robe satin floor",
    teddies: "teddy body",
    bridal: "ivory wedding robe getting ready",
    corsetry: "corset bustier waspie boning",
    hosiery: "stocking stayup holdup hose thigh",
    "body stockings": "bodystocking sheer body",
    shapewear: "shaper sculpt waist",
    swim: "bikini beach resort",
    loungewear: "lounge robe kimono pant",
    resort: "kaftan sarong wrap beach",
    thermal: "warm sleep set",
    accessories: "mask chain jewelry",
  };

  function fold(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function asset(name) { return (window.FEMME && window.FEMME.asset) ? window.FEMME.asset(name) : name; }
  function searchUrl(q) { return ((window.FEMME && window.FEMME.searchUrl) || "/search") + (q ? "?q=" + encodeURIComponent(q) : ""); }

  function searchHouse(raw, limit) {
    const query = fold(raw);
    const tokens = query.split(/\s+/).filter(Boolean);
    const score = (hay) => {
      const t = fold(hay);
      if (!t || !query) return 0;
      if (t === query) return 100;
      if (t.startsWith(query)) return 80;
      if (t.includes(query)) return 50;
      const hits = tokens.filter((tok) => t.includes(tok));
      if (hits.length === tokens.length) return 32;
      return hits.length * 8;
    };
    if (query.length < 2) {
      return { products: [], aisles: AISLE_NAMES.slice(0, 6), pages: [] };
    }
    const products = HOUSE.map((p) => ({
      p,
      s: Math.max(
        score(p.name) * 2,
        score(p.cat),
        score(p.id.replace(/-/g, " ")),
        score(EXTRA[fold(p.cat)] || "")
      ),
    }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit || 6)
      .map((x) => x.p);
    const aisles = AISLE_NAMES.filter((c) => score(c) > 0 || score(EXTRA[fold(c)] || "") > 0).slice(0, 8);
    const pages = PAGES.filter((p) => score(p.title + " " + p.terms) > 0);
    return { products, aisles, pages };
  }

  function renderHouseHits(container, hits, query) {
    const typed = fold(query).length >= 2;
    if (typed && !hits.products.length && !hits.aisles.length && !hits.pages.length) {
      container.innerHTML = `<p class="muted" style="padding:1rem 0">No pieces found matching “${query}”.</p>`;
      return;
    }
    let html = "";
    if (hits.aisles.length) {
      html += `<div style="margin-bottom:1.5rem"><p class="kicker">Aisles & collections</p><div class="search-pills">`;
      hits.aisles.forEach((c) => { html += `<a class="pill" href="${searchUrl(c)}">${c}</a>`; });
      html += `</div></div>`;
    }
    if (hits.pages.length) {
      html += `<div style="margin-bottom:1.5rem"><p class="kicker">House</p><div class="search-pills">`;
      hits.pages.forEach((p) => { html += `<a class="pill" href="${p.href}">${p.title}</a>`; });
      html += `</div></div>`;
    }
    if (hits.products.length) {
      html += `<p class="kicker">Pieces in the atelier</p><div class="predictive-grid">`;
      hits.products.forEach((p) => {
        html += `<a class="predictive-item" href="${searchUrl(p.name)}">
          <img src="${asset(p.id + ".jpg")}" alt="">
          <span><strong>${p.name}</strong><em>$${p.price.toFixed(2)}</em></span>
        </a>`;
      });
      html += `</div>`;
      if (typed) html += `<a class="gold" href="${searchUrl(query)}" style="display:inline-block;margin-top:1.25rem">See all results</a>`;
    }
    container.innerHTML = html;
  }

>>>>>>> b1e5ef5 (Ship house 2.2.0: cinematic Shop, Sizes, Atelier, and Search.)
  // Predictive Search
  const searchModal = document.querySelector("#predictive-search-modal");
  const searchInput = document.querySelector("#Search-In-Modal");
  const searchOpenBtn = document.querySelector("[data-search-open]");
  const searchCloseBtns = document.querySelectorAll("[data-search-close]");
  const searchResults = document.querySelector(".predictive-results-container");
  const searchLoading = document.querySelector(".search-loading-indicator");

  const openSearch = () => {
    if (!searchModal) return;
    searchModal.classList.add("is-open");
    searchModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
<<<<<<< HEAD
=======
    if (searchResults && !searchInput?.value.trim()) renderHouseHits(searchResults, searchHouse(""), "");
>>>>>>> b1e5ef5 (Ship house 2.2.0: cinematic Shop, Sizes, Atelier, and Search.)
    setTimeout(() => searchInput?.focus(), 100);
  };

  const closeSearch = () => {
    if (!searchModal) return;
    searchModal.classList.remove("is-open");
    searchModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  searchOpenBtn?.addEventListener("click", openSearch);
  searchCloseBtns.forEach((btn) => btn.addEventListener("click", closeSearch));

  document.addEventListener("keydown", (e) => {
<<<<<<< HEAD
    if (e.key === "Escape" && searchModal?.classList.contains("is-open")) {
      closeSearch();
    }
=======
    if (e.key === "Escape" && searchModal?.classList.contains("is-open")) closeSearch();
>>>>>>> b1e5ef5 (Ship house 2.2.0: cinematic Shop, Sizes, Atelier, and Search.)
  });

  let debounceTimer;
  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimer);
<<<<<<< HEAD

    if (!query || query.length < 2) {
      if (searchResults) searchResults.innerHTML = "";
      if (searchLoading) searchLoading.hidden = true;
      return;
    }

    if (searchLoading) searchLoading.hidden = false;

    debounceTimer = setTimeout(async () => {
=======
    if (!query || query.length < 2) {
      if (searchResults) renderHouseHits(searchResults, searchHouse(""), "");
      if (searchLoading) searchLoading.hidden = true;
      return;
    }
    if (searchLoading) searchLoading.hidden = false;
    debounceTimer = setTimeout(async () => {
      const house = searchHouse(query, 6);
      let shopProducts = [];
      let shopCollections = [];
>>>>>>> b1e5ef5 (Ship house 2.2.0: cinematic Shop, Sizes, Atelier, and Search.)
      try {
        const url = `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection&resources[limit]=6`;
        const res = await fetch(url);
        const data = await res.json();
<<<<<<< HEAD
        if (searchLoading) searchLoading.hidden = true;

        const products = data.resources?.results?.products || [];
        const collections = data.resources?.results?.collections || [];

        if (!products.length && !collections.length) {
          searchResults.innerHTML = `<p class="muted" style="padding:1rem 0">No pieces found matching "${query}".</p>`;
          return;
        }

        let html = "";
        if (collections.length) {
          html += `<div style="margin-bottom:1.5rem"><p class="kicker">Aisles & Collections</p><div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem">`;
          collections.forEach((c) => {
            html += `<a class="pill" href="${c.url}">${c.title}</a>`;
          });
          html += `</div></div>`;
        }

        if (products.length) {
          html += `<p class="kicker">Pieces in the Atelier</p><div class="predictive-grid">`;
          products.forEach((p) => {
            const img = p.image ? `<img src="${p.image}" alt="${p.title}">` : "";
            html += `
              <a class="predictive-item" href="${p.url}">
                ${img}
                <div>
                  <strong style="font-size:0.9rem;display:block;color:var(--fg)">${p.title}</strong>
                  <span class="gold" style="font-size:0.85rem">${p.price ? '$' + Number(p.price).toFixed(2) : ''}</span>
                </div>
              </a>
            `;
          });
          html += `</div>`;
        }

        searchResults.innerHTML = html;
      } catch (err) {
        if (searchLoading) searchLoading.hidden = true;
        searchResults.innerHTML = `<p class="muted">Search temporarily unavailable.</p>`;
      }
    }, 250);
  });
=======
        shopProducts = data.resources?.results?.products || [];
        shopCollections = data.resources?.results?.collections || [];
      } catch (err) { /* house catalog still renders */ }
      if (searchLoading) searchLoading.hidden = true;
      if (shopProducts.length || shopCollections.length) {
        let html = "";
        const aisles = [...shopCollections.map((c) => c.title), ...house.aisles];
        const seen = new Set();
        const uniqueAisles = aisles.filter((c) => { const k = fold(c); if (seen.has(k)) return false; seen.add(k); return true; });
        if (uniqueAisles.length) {
          html += `<div style="margin-bottom:1.5rem"><p class="kicker">Aisles & collections</p><div class="search-pills">`;
          uniqueAisles.forEach((c) => {
            const col = shopCollections.find((x) => x.title === c);
            html += `<a class="pill" href="${col ? col.url : searchUrl(c)}">${c}</a>`;
          });
          html += `</div></div>`;
        }
        if (house.pages.length) {
          html += `<div style="margin-bottom:1.5rem"><p class="kicker">House</p><div class="search-pills">`;
          house.pages.forEach((p) => { html += `<a class="pill" href="${p.href}">${p.title}</a>`; });
          html += `</div></div>`;
        }
        html += `<p class="kicker">Pieces in the atelier</p><div class="predictive-grid">`;
        shopProducts.forEach((p) => {
          const img = p.image ? `<img src="${p.image}" alt="">` : "";
          html += `<a class="predictive-item" href="${p.url}">${img}<span><strong>${p.title}</strong><em>${p.price ? "$" + Number(p.price).toFixed(2) : ""}</em></span></a>`;
        });
        html += `</div><a class="gold" href="${searchUrl(query)}" style="display:inline-block;margin-top:1.25rem">See all results</a>`;
        searchResults.innerHTML = html;
        return;
      }
      renderHouseHits(searchResults, house, query);
    }, 180);
  });

  // Search page: filter the house preview grid when Shopify returned no products.
  const pageGrid = document.querySelector("[data-search-grid]");
  const pageCount = document.querySelector("[data-search-count]");
  const pageAisles = document.querySelector("[data-search-aisles]");
  const pageInput = document.querySelector("[data-search-page-input]");
  if (pageGrid && pageInput) {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("q") || pageInput.value || "").trim();
    const hits = searchHouse(q, 48);
    if (pageAisles && hits.aisles.length) {
      pageAisles.innerHTML = `<p class="kicker">Aisles & collections</p><div class="search-pills">${hits.aisles.map((c) => `<a class="pill" href="${searchUrl(c)}">${c}</a>`).join("")}</div>`;
    }
    if (q.length >= 2) {
      const keep = new Set(hits.products.map((p) => fold(p.name)));
      pageGrid.querySelectorAll("article").forEach((card) => {
        const title = fold(card.querySelector("h3")?.textContent);
        card.hidden = keep.size ? !keep.has(title) : true;
      });
      const n = hits.products.length;
      if (pageCount) pageCount.textContent = n ? `${n} ${n === 1 ? "piece" : "pieces"}` : `No pieces found matching “${q}”.`;
    }
  }
>>>>>>> b1e5ef5 (Ship house 2.2.0: cinematic Shop, Sizes, Atelier, and Search.)
})();
