create table if not exists orders (
  id              serial primary key,
  user_id         text not null,
  order_no        text not null unique,
  email           text not null,
  ship_name       text not null,
  ship_addr       text not null,
  ship_country    text not null default '',
  currency        text not null default 'USD',
  subtotal_cents  integer not null,
  shipping_cents  integer not null,
  pack_cents      integer not null default 0,
  tax_cents       integer not null default 0,
  other_cents     integer not null default 0,
  tax_label       text not null default 'Duties & taxes',
  total_cents     integer not null,
  status          text not null default 'received',
  tracking        text,
  created_at      timestamptz not null default now(),
  confirmed_at    timestamptz,
  dispatched_at   timestamptz
);
create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);

create table if not exists order_items (
  id           serial primary key,
  order_id     integer not null references orders (id) on delete cascade,
  product_id   text not null,
  name         text not null,
  qty          integer not null,
  unit_cents   integer not null
);
create index if not exists order_items_order_id_idx on order_items (order_id);

create table if not exists order_emails (
  id         serial primary key,
  order_id   integer not null references orders (id) on delete cascade,
  kind       text not null,
  to_email   text not null,
  subject    text not null,
  body       text not null,
  status     text not null default 'demo',
  created_at timestamptz not null default now()
);
