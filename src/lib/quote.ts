export function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function moneyCents(c: number) {
  return money((c || 0) / 100);
}

export function dollarsToCents(n: number) {
  return Math.round(n * 100);
}

export function taxFor(addr: string, country: string) {
  const blob = `${country} ${addr}`.toLowerCase();
  if (/(ae|uae|united arab|dubai|abu dhabi)/.test(blob)) return { rate: 0.05, label: "UAE VAT 5%" };
  if (/(gb|uk|united kingdom|england|scotland|wales)/.test(blob)) return { rate: 0.2, label: "UK VAT 20%" };
  if (/(germany|france|italy|spain|netherlands|ireland|belgium|austria|sweden)/.test(blob)) {
    return { rate: 0.2, label: "EU VAT 20%" };
  }
  return { rate: 0, label: "Duties & taxes (not charged)" };
}

export function quoteCart(subtotal: number, qty: number, addr: string, country: string) {
  const pack = qty <= 0 ? 0 : 2.95 + Math.max(0, qty - 1) * 0.85;
  const ship = subtotal >= 100 ? 0 : 8;
  const taxInfo = taxFor(addr, country);
  const tax = Math.round(subtotal * taxInfo.rate * 100) / 100;
  const other = qty <= 0 ? 0 : 1.5;
  return {
    pack,
    ship,
    tax,
    taxLabel: taxInfo.label,
    other,
    total: subtotal + pack + ship + tax + other,
  };
}

export function quoteCents(subtotalCents: number, qty: number, addr: string, country: string) {
  const q = quoteCart(subtotalCents / 100, qty, addr, country);
  return {
    pack: dollarsToCents(q.pack),
    ship: dollarsToCents(q.ship),
    tax: dollarsToCents(q.tax),
    taxLabel: q.taxLabel,
    other: dollarsToCents(q.other),
    total: dollarsToCents(q.total),
  };
}
