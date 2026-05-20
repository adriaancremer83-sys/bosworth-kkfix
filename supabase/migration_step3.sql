-- KK-Fix Step 3 Migration — QR Scan Tracking
-- Run in: https://supabase.com/dashboard/project/rtjeqeobxycfsipckwur/editor

CREATE TABLE IF NOT EXISTS qr_scans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lat         FLOAT,
  lng         FLOAT,
  city        TEXT,
  region      TEXT,
  country     TEXT,
  device_type TEXT,
  user_agent  TEXT,
  batch_id    TEXT,
  unit_id     TEXT,
  ip_address  TEXT,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL
);

-- Index for common filter patterns
CREATE INDEX IF NOT EXISTS qr_scans_timestamp_idx ON qr_scans (timestamp DESC);
CREATE INDEX IF NOT EXISTS qr_scans_batch_idx     ON qr_scans (batch_id);
CREATE INDEX IF NOT EXISTS qr_scans_product_idx   ON qr_scans (product_id);

-- RLS
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert qr_scans"    ON qr_scans;
DROP POLICY IF EXISTS "Service role all qr_scans" ON qr_scans;

-- Allow anonymous inserts (QR page is public, no auth)
CREATE POLICY "Public insert qr_scans" ON qr_scans
  FOR INSERT WITH CHECK (true);

-- Service role can do everything (admin dashboard reads)
CREATE POLICY "Service role all qr_scans" ON qr_scans
  FOR ALL USING (true) WITH CHECK (true);
