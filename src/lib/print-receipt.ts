import type { StoreOrder } from "./orders";
import { money, moneyCents, quoteCart } from "./quote";
import type { Product } from "./catalog";

export function printHtml(title: string, body: string) {
  const html = `<!doctype html><html><head><title>${title}</title>
    <style>
      body{font-family:Georgia,serif;color:#1a1210;padding:28px;max-width:640px;margin:0 auto;background:#fff}
      h1{font-size:22px;letter-spacing:.22em;margin:0}
      .muted{color:#6a5648;font-size:13px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      td,th{border-bottom:1px solid #e6dcd0;padding:8px 0;text-align:left}
      td.r,th.r{text-align:right}
      .total td{font-weight:700;border-top:2px solid #1a1210}
    </style></head><body>${body}</body></html>`;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    window.alert("Printing is not available in this view.");
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  const run = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 800);
  };
  if (iframe.contentWindow?.document.readyState === "complete") run();
  else iframe.onload = run;
}

export function printOrder(
  o: StoreOrder | null,
  cart: Array<{ product: Product; qty: number; size?: string }>,
  ship: { name: string; addr: string; country: string },
) {
  const items = o
    ? o.items.map((i) => `<tr><td>${i.qty} × ${i.name}</td><td class="r">${moneyCents(i.unit_cents * i.qty)}</td></tr>`).join("")
    : cart.map((l) => `<tr><td>${l.qty} × ${l.product.name}${l.size ? ` · ${l.size}` : ""}</td><td class="r">${money(l.product.price * l.qty)}</td></tr>`).join("");
  const name = o?.ship_name || ship.name || "—";
  const addr = o?.ship_addr || ship.addr || "—";
  const country = o?.ship_country || ship.country;
  const no = o?.order_no || "PREVIEW";
  const subtotal = o ? o.subtotal_cents : Math.round(cart.reduce((n, l) => n + l.product.price * l.qty, 0) * 100);
  const q = quoteCart(subtotal / 100, cart.reduce((n, l) => n + l.qty, 0), addr, country);
  const pack = o ? o.pack_cents : Math.round(q.pack * 100);
  const shipC = o ? o.shipping_cents : Math.round(q.ship * 100);
  const tax = o ? o.tax_cents : Math.round(q.tax * 100);
  const other = o ? o.other_cents : Math.round(q.other * 100);
  const total = o ? o.total_cents : Math.round(q.total * 100);
  const taxL = o?.tax_label || q.taxLabel;
  printHtml(
    `Receipt ${no}`,
    `<h1>FEMME</h1><p class="muted">Silk Atelier · info@silkmoments.com</p>
     <p><strong>Receipt ${no}</strong>${o ? ` · ${o.status}` : " · preview"}</p>
     <p>${name}<br/>${addr.replace(/\n/g, "<br/>")}<br/>${country}</p>
     <table><thead><tr><th>Item</th><th class="r">Amount</th></tr></thead><tbody>${items}</tbody></table>
     <table>
       <tr><td>Product cost</td><td class="r">${moneyCents(subtotal)}</td></tr>
       <tr><td>Packaging</td><td class="r">${moneyCents(pack)}</td></tr>
       <tr><td>Shipping</td><td class="r">${shipC === 0 ? "Free" : moneyCents(shipC)}</td></tr>
       <tr><td>${taxL}</td><td class="r">${moneyCents(tax)}</td></tr>
       <tr><td>Other charges (COD)</td><td class="r">${moneyCents(other)}</td></tr>
       <tr class="total"><td>Total due</td><td class="r">${moneyCents(total)}</td></tr>
     </table>
     <p class="muted">Cash on delivery. Packaging = $2.95 gift box + $0.85 per extra piece. Shipping free on product totals of $100+.</p>`,
  );
}
