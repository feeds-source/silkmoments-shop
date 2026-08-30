import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS_BY_ID, defaultSize, type Product } from "./catalog";
import { useStock } from "./inventory";

export type CartLine = { id: string; size: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (id: string, size?: string) => boolean;
  setQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
};

function same(a: CartLine, id: string, size: string) {
  return a.id === id && a.size === size;
}

function cap(id: string, size: string, qty: number) {
  const stock = useStock.getState().qty(id, size);
  return Math.max(0, Math.min(20, stock, qty));
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (id, size) => {
        const product = PRODUCTS_BY_ID[id];
        const picked = size || (product ? defaultSize(product) : "M");
        const hit = get().lines.find((l) => same(l, id, picked));
        const next = cap(id, picked, (hit?.qty ?? 0) + 1);
        if (next <= 0) return false;
        if (hit) {
          if (next === hit.qty) return false;
          set({
            lines: get().lines.map((l) => (same(l, id, picked) ? { ...l, qty: next } : l)),
          });
        } else {
          set({ lines: [...get().lines, { id, size: picked, qty: next }] });
        }
        return true;
      },
      setQty: (id, size, qty) => {
        const next = cap(id, size, qty);
        if (next <= 0) set({ lines: get().lines.filter((l) => !same(l, id, size)) });
        else set({ lines: get().lines.map((l) => (same(l, id, size) ? { ...l, qty: next } : l)) });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "femme_cart_v3" },
  ),
);

export function hydrateCart(lines: CartLine[]): Array<{ product: Product; size: string; qty: number }> {
  return lines
    .map((l) => {
      const product = PRODUCTS_BY_ID[l.id];
      const size = l.size || (product ? defaultSize(product) : "");
      return product && l.qty > 0 ? { product, size, qty: l.qty } : null;
    })
    .filter((l): l is { product: Product; size: string; qty: number } => Boolean(l));
}

export function qtyInBag(lines: CartLine[], id: string, size: string) {
  return lines.find((l) => l.id === id && l.size === size)?.qty ?? 0;
}
