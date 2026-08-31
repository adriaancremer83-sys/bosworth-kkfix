-- KK-Fix QR scan tracking — runs in the KIA-KAHA MINING Supabase project.
-- This is also included at the end of the Kia-Kaha repo's supabase/schema.sql;
-- run it once in the Supabase SQL editor. Idempotent.
--
-- This portal serves one product and stores no content in Supabase; qr_scans is
-- the only table it touches. Both the insert (/api/track-scan) and the read
-- (/stats) run server-side with the service-role key, which bypasses RLS — so
-- RLS is left on with no policies (deny-by-default), matching the rest of the
-- Kia-Kaha schema. product_id is a plain text tag ('kk-fix'), not a foreign key.

create table if not exists public.qr_scans (
  id              uuid primary key default gen_random_uuid(),
  timestamp       timestamptz not null default now(),
  lat             double precision,
  lng             double precision,
  city            text,
  region          text,
  country         text,
  device_type     text,
  user_agent      text,
  batch_id        text,
  unit_id         text,
  ip_address      text,
  product_id      text,
  location_source text default 'ip'
);

create index if not exists qr_scans_timestamp_idx on public.qr_scans(timestamp desc);
create index if not exists qr_scans_batch_idx     on public.qr_scans(batch_id);
create index if not exists qr_scans_product_idx   on public.qr_scans(product_id);

alter table public.qr_scans enable row level security;
-- No anon/authenticated policies => insert and read only via the service role.
