import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { PRODUCTS_BY_ID, sizesFor } from "@/lib/catalog";
import { takeStock } from "@/lib/inventory";
import { dollarsToCents, quoteCents } from "@/lib/quote";

export type OrderItem = {
  product_id: string;
  name: string;
  qty: number;
  unit_cents: number;
};

export type OrderEmail = {
  id: number;
  kind: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
};

export type StoreOrder = {
  id: number;
  order_no: string;
  email: string;
  ship_name: string;
  ship_addr: string;
  ship_country: string;
  subtotal_cents: number;
  shipping_cents: number;
  pack_cents: number;
  tax_cents: number;
  other_cents: number;
  tax_label: string;
  total_cents: number;
  status: string;
  tracking: string | null;
  created_at: string;
  items: OrderItem[];
  emails: OrderEmail[];
};

type OrderRow = Omit<StoreOrder, "items" | "emails">;

async function userEmail(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql.query<{ email: string }>(`select email from "user" where id = $1`, [userId]);
  return rows[0]?.email ?? "";
}

async function requireAdmin(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const email = await userEmail(sql, userId);
  if (!isAdminEmail(email)) {
    throw new Error("Forbidden");
  }
  return email;
}

async function loadItems(sql: Awaited<ReturnType<typeof getSql>>, orderId: number) {
  return sql.query<OrderItem>(
    "select product_id, name, qty, unit_cents from order_items where order_id = $1 order by id",
    [orderId],
  );
}

async function loadEmails(sql: Awaited<ReturnType<typeof getSql>>, orderId: number) {
  return sql.query<OrderEmail>(
    "select id, kind, to_email, subject, body, status from order_emails where order_id = $1 order by id desc",
    [orderId],
  );
}

async function pack(sql: Awaited<ReturnType<typeof getSql>>, row: OrderRow, withEmails = false): Promise<StoreOrder> {
  const items = await loadItems(sql, row.id);
  const emails = withEmails ? await loadEmails(sql, row.id) : [];
  return { ...row, items, emails };
}

function receiptBody(order: StoreOrder, extra = "") {
  const lines = order.items.map((i) => `  ${i.qty} × ${i.name}`).join("\n");
  return [
    "Femme — Silk Moments",
    `Order ${order.order_no}`,
    `Status: ${order.status}`,
    "",
    `Ship to: ${order.ship_name}`,
    order.ship_addr,
    order.ship_country ? `Country: ${order.ship_country}` : "",
    "",
    "Items",
    lines,
    extra,
    "",
    "Payment: cash on delivery",
    "Questions: info@silkmoments.com",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      shipName: z.string().trim().min(1),
      shipAddr: z.string().trim().min(1),
      shipCountry: z.string().trim().min(1),
      items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(20), size: z.string().trim().min(1) })).min(1),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const email = await userEmail(sql, context.userId);
    const lines: OrderItem[] = [];
    for (const line of data.items) {
      const product = PRODUCTS_BY_ID[line.id];
      if (!product) throw new Error(`Unknown product ${line.id}`);
      if (!sizesFor(product).includes(line.size)) throw new Error(`Size ${line.size} is not cut for ${product.name}`);
      lines.push({
        product_id: product.id,
        name: `${product.name} · ${line.size}`,
        qty: line.qty,
        unit_cents: dollarsToCents(product.price),
      });
    }
    for (const line of data.items) {
      await takeStock(sql, line.id, line.size, line.qty);
    }
    const subtotal = lines.reduce((n, l) => n + l.unit_cents * l.qty, 0);
    const qty = lines.reduce((n, l) => n + l.qty, 0);
    const quote = quoteCents(subtotal, qty, data.shipAddr, data.shipCountry);
    const orderNo = `FM${Date.now().toString(36).toUpperCase()}`;

    const inserted = await sql.query<OrderRow>(
      `insert into orders (
        user_id, order_no, email, ship_name, ship_addr, ship_country, currency,
        subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label, total_cents, status
      ) values ($1,$2,$3,$4,$5,$6,'USD',$7,$8,$9,$10,$11,$12,$13,'received')
      returning id, order_no, email, ship_name, ship_addr, ship_country,
        subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label,
        total_cents, status, tracking, created_at::text as created_at`,
      [
        context.userId,
        orderNo,
        email || "guest",
        data.shipName,
        data.shipAddr,
        data.shipCountry,
        subtotal,
        quote.ship,
        quote.pack,
        quote.tax,
        quote.other,
        quote.taxLabel,
        quote.total,
      ],
    );
    const order = inserted[0];
    if (!order) throw new Error("Could not place order");
    for (const line of lines) {
      await sql.query(
        "insert into order_items (order_id, product_id, name, qty, unit_cents) values ($1,$2,$3,$4,$5)",
        [order.id, line.product_id, line.name, line.qty, line.unit_cents],
      );
    }
    const packed = await pack(sql, order, true);
    await sql.query(
      "insert into order_emails (order_id, kind, to_email, subject, body, status) values ($1,$2,$3,$4,$5,'demo')",
      [
        order.id,
        "placed",
        packed.email,
        `We received order ${order.order_no}`,
        receiptBody(packed, "\nWe will confirm your order shortly, then dispatch with tracking."),
      ],
    );
    return pack(sql, order, true);
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<OrderRow>(
      `select id, order_no, email, ship_name, ship_addr, ship_country,
        subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label,
        total_cents, status, tracking, created_at::text as created_at
       from orders where user_id = $1 order by created_at desc`,
      [context.userId],
    );
    return Promise.all(rows.map((r) => pack(sql, r, true)));
  });

export const listAdminOrders = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ status: z.enum(["all", "received", "confirmed", "dispatched"]).default("all") }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows =
      data.status === "all"
        ? await sql.query<OrderRow>(
            `select id, order_no, email, ship_name, ship_addr, ship_country,
              subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label,
              total_cents, status, tracking, created_at::text as created_at
             from orders order by created_at desc`,
          )
        : await sql.query<OrderRow>(
            `select id, order_no, email, ship_name, ship_addr, ship_country,
              subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label,
              total_cents, status, tracking, created_at::text as created_at
             from orders where status = $1 order by created_at desc`,
            [data.status],
          );
    return Promise.all(rows.map((r) => pack(sql, r, true)));
  });

export const confirmOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const updated = await sql.query<OrderRow>(
      `update orders set status = 'confirmed', confirmed_at = now()
       where id = $1 and status <> 'dispatched'
       returning id, order_no, email, ship_name, ship_addr, ship_country,
        subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label,
        total_cents, status, tracking, created_at::text as created_at`,
      [data.id],
    );
    const order = updated[0];
    if (!order) throw new Error("Order not found");
    const packed = await pack(sql, order, true);
    await sql.query(
      "insert into order_emails (order_id, kind, to_email, subject, body, status) values ($1,$2,$3,$4,$5,'demo')",
      [
        order.id,
        "confirmed",
        packed.email,
        `Order ${order.order_no} is confirmed`,
        receiptBody(packed, "\nYour order is confirmed. We will email again when it ships."),
      ],
    );
    return pack(sql, order, true);
  });

export const dispatchOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const tracking = `FM-SHIP-${data.id}-${Date.now().toString(36).toUpperCase()}`;
    const updated = await sql.query<OrderRow>(
      `update orders set status = 'dispatched', tracking = $1,
         confirmed_at = coalesce(confirmed_at, now()), dispatched_at = now()
       where id = $2
       returning id, order_no, email, ship_name, ship_addr, ship_country,
        subtotal_cents, shipping_cents, pack_cents, tax_cents, other_cents, tax_label,
        total_cents, status, tracking, created_at::text as created_at`,
      [tracking, data.id],
    );
    const order = updated[0];
    if (!order) throw new Error("Order not found");
    const packed = await pack(sql, order, true);
    await sql.query(
      "insert into order_emails (order_id, kind, to_email, subject, body, status) values ($1,$2,$3,$4,$5,'demo')",
      [
        order.id,
        "dispatched",
        packed.email,
        `Your Femme order ${order.order_no} is on the way`,
        receiptBody(packed, `\nShipment dispatched.\nTracking: ${tracking}`),
      ],
    );
    return pack(sql, order, true);
  });
