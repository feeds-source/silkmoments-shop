(() => {
  const menuBtn = document.querySelector("[data-menu]");
  const navMob = document.querySelector("[data-nav-mob]");
  menuBtn?.addEventListener("click", () => {
    const open = navMob.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  const slides = document.querySelectorAll("[data-campaign-slide]");
  const dots = document.querySelectorAll("[data-campaign-dot]");
  if (slides.length) {
    let i = 0;
    const show = (n) => {
      i = n % slides.length;
      slides.forEach((el, idx) => {
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
})();
