-- ============================================================
-- Migration: 20260610130000_create_storage_bucket.sql
-- Foundation of Luv — Supabase Storage for event flyers
-- ============================================================

-- Create public storage bucket for event flyers/images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-flyers',
  'event-flyers',
  true,
  10485760,  -- 10 MB max per file
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Allow public to READ (view) objects in event-flyers
DROP POLICY IF EXISTS "Public read event flyers" ON storage.objects;
CREATE POLICY "Public read event flyers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-flyers');

-- Allow service role full access (admin uploads/deletes)
DROP POLICY IF EXISTS "Service role manage event flyers" ON storage.objects;
CREATE POLICY "Service role manage event flyers"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'event-flyers');
