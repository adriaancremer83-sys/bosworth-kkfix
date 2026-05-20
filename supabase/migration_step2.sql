-- KK-Fix Step 2 Migration
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/rtjeqeobxycfsipckwur/editor)

-- ── 1. New columns on products ──
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS version TEXT,
  ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS product_image_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- ── 2. New column on kit_contents ──
ALTER TABLE kit_contents
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ── 3. New column on instructions ──
ALTER TABLE instructions
  ADD COLUMN IF NOT EXISTS estimated_time TEXT;

-- ── 4. New tech_specs table ──
CREATE TABLE IF NOT EXISTS tech_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. RLS on tech_specs ──
ALTER TABLE tech_specs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read tech_specs" ON tech_specs;
CREATE POLICY "Public read tech_specs" ON tech_specs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role write tech_specs" ON tech_specs;
CREATE POLICY "Service role write tech_specs" ON tech_specs
  FOR ALL USING (true) WITH CHECK (true);
