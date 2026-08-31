-- KK-Fix QR scan tracking — runs in the KIA-KAHA MINING Supabase project.
-- Run once in the Supabase SQL editor. Safe to re-run (idempotent).
--
-- This portal serves one product and stores no content in Supabase; the only
-- table it uses is this one. product_id is a plain text tag ('kk-fix'), not a
-- foreign key, so it does not depend on any other table in the Kia-Kaha schema.

CREATE TABLE IF NOT EXISTS qr_scans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lat             FLOAT,
  lng             FLOAT,
  city            TEXT,
  region          TEXT,
  country         TEXT,
  device_type     TEXT,
  user_agent      TEXT,
  batch_id        TEXT,
  unit_id         TEXT,
  ip_address      TEXT,
  product_id      TEXT,
  location_source TEXT DEFAULT 'ip'
);

CREATE INDEX IF NOT EXISTS qr_scans_timestamp_idx ON qr_scans (timestamp DESC);
CREATE INDEX IF NOT EXISTS qr_scans_batch_idx     ON qr_scans (batch_id);
CREATE INDEX IF NOT EXISTS qr_scans_product_idx   ON qr_scans (product_id);

ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- The public product page inserts a scan row with no auth.
DROP POLICY IF EXISTS "Public insert qr_scans" ON qr_scans;
CREATE POLICY "Public insert qr_scans" ON qr_scans
  FOR INSERT WITH CHECK (true);

-- Reads happen only from the server with the service-role key (which bypasses
-- RLS); no anon SELECT policy, so scan data is not publicly readable.
