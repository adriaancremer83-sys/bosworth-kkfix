-- Add location_source column to distinguish GPS vs IP-based location tracking
ALTER TABLE qr_scans ADD COLUMN IF NOT EXISTS location_source TEXT DEFAULT 'ip';
