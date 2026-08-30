create table if not exists inventory (
  product_id text not null,
  size       text not null,
  qty        integer not null default 0 check (qty >= 0),
  primary key (product_id, size)
);
create index if not exists inventory_product_id_idx on inventory (product_id);
