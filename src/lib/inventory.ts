import { create } from "zustand";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { isAdminEmail } from "@/lib/admin";
import { getSql } from "@/lib/db";
import { PRODUCTS, PRODUCTS_BY_ID, defaultSize, sizesFor, type Product } from "@/lib/catalog";

export type StockRow = { product_id: string; size: string; qty: number };

export function stockKey(id: string, size: string) {
  return `${id}::${size}`;
}

export function seedQty(product: Product, size: string): number {
  const sizes = sizesFor(product);
  const i = sizes.indexOf(size);
  if (i < 0) return 0;
  const mid = defaultSize(product);
  if (size === mid) return 12;
  if (size === "30B" || size === "42C" || size === "32A") return i % 2 === 0 ? 0 : 2;
  if (size === "XS" || size === "XXL") return 1;
  if (size === "Free Size") return 18;
  return 3 + ((i * 4) % 7);
}

export function seedRows(): StockRow[] {
  return PRODUCTS.flatMap((p) => sizesFor(p).map((size) => ({ product_id: p.id, size, qty: seedQty(p, size) })));
}

async function ensureInventory(sql: Awaited<ReturnType<typeof getSql>>) {
  const count = await sql.query<{ n: number }>("select count(*)::int as n from inventory");
  if ((count[0]?.n ?? 0) > 0) return;
  for (const row of seedRows()) {
    await sql.query("insert into inventory (product_id, size, qty) values ($1,$2,$3) on conflict do nothing", [
      row.product_id,
      row.size,
      row.qty,
    ]);
  }
}

export const getStock = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  await ensureInventory(sql);
  return sql.query<StockRow>("select product_id, size, qty from inventory");
});

export const setStock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ productId: z.string(), size: z.string(), qty: z.number().int().min(0).max(999) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const users = await sql.query<{ email: string }>(`select email from "user" where id = $1`, [context.userId]);
    if (!isAdminEmail(users[0]?.email)) throw new Error("Forbidden");
    await sql.query(
      `insert into inventory (product_id, size, qty) values ($1,$2,$3)
       on conflict (product_id, size) do update set qty = excluded.qty`,
      [data.productId, data.size, data.qty],
    );
    return { ok: true as const };
  });

export async function takeStock(
  sql: Awaited<ReturnType<typeof getSql>>,
  productId: string,
  size: string,
  qty: number,
) {
  const product = PRODUCTS_BY_ID[productId];
  if (!product) throw new Error(`Unknown product ${productId}`);
  if (!sizesFor(product).includes(size)) throw new Error(`Size ${size} is not cut for this piece`);
  await ensureInventory(sql);
  const updated = await sql.query<{ qty: number }>(
    `update inventory set qty = qty - $3
     where product_id = $1 and size = $2 and qty >= $3
     returning qty`,
    [productId, size, qty],
  );
  if (!updated[0]) throw new Error(`${product.name} · ${size} is no longer in the atelier`);
  return updated[0].qty;
}

type StockState = {
  byKey: Record<string, number>;
  loaded: boolean;
  load: () => Promise<void>;
  qty: (id: string, size: string) => number;
  available: (id: string, size: string, inBag: number) => number;
};

export const useStock = create<StockState>((set, get) => ({
  byKey: Object.fromEntries(seedRows().map((r) => [stockKey(r.product_id, r.size), r.qty])),
  loaded: false,
  load: async () => {
    try {
      const rows = await getStock();
      set({
        byKey: Object.fromEntries(rows.map((r) => [stockKey(r.product_id, r.size), r.qty])),
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },
  qty: (id, size) => get().byKey[stockKey(id, size)] ?? 0,
  available: (id, size, inBag) => Math.max(0, (get().byKey[stockKey(id, size)] ?? 0) - inBag),
}));

export function firstInStockSize(product: Product, qtyFn: (id: string, size: string) => number): string {
  const sizes = sizesFor(product);
  const prefer = defaultSize(product);
  if (qtyFn(product.id, prefer) > 0) return prefer;
  return sizes.find((s) => qtyFn(product.id, s) > 0) ?? prefer;
}
