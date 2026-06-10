-- ============================================================
-- Migration: 20260610000000_create_events_table.sql
-- Foundation of Luv — Events & Scheduling System
-- ============================================================

-- ─────────────────────────────────────────
-- Events Table
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  title             text        NOT NULL,
  description       text        DEFAULT '',
  date              text        NOT NULL,
  time              text        DEFAULT '',
  location          text        DEFAULT 'Online (Podore Link Provided Upon Registration)',
  type              text        DEFAULT 'Workshop',
  status            text        DEFAULT 'draft'
                                CHECK (status IN ('draft', 'published', 'cancelled')),
  registration_link text        DEFAULT '',
  image_url         text        DEFAULT ''
);

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Anonymous / public users can READ published events only
DROP POLICY IF EXISTS "anon_read_published_events" ON events;
CREATE POLICY "anon_read_published_events"
  ON events FOR SELECT TO anon
  USING (status = 'published');

-- Service role has full access (admin panel operations)
DROP POLICY IF EXISTS "service_role_all_events" ON events;
CREATE POLICY "service_role_all_events"
  ON events FOR ALL TO service_role
  USING (true);

-- ─────────────────────────────────────────
-- Performance Indexes
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS events_date_idx   ON events (date);
CREATE INDEX IF NOT EXISTS events_status_idx ON events (status);
