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
})();
