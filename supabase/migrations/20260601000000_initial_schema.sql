-- ============================================================
-- Migration: 20260601000000_initial_schema.sql
-- Foundation of Luv — Initial Database Schema
-- Tables: workshop_registrations, site_content, email_logs
-- ============================================================

-- ─────────────────────────────────────────
-- 1. Workshop Registrations
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at           timestamptz DEFAULT now(),
  full_name            text,
  email                text,
  phone                text,
  city                 text,
  organization         text,
  job_title            text,
  profile              text,
  interests            text[],
  cybersecurity_level  text        DEFAULT 'Beginner',
  financial_level      text        DEFAULT 'Beginner',
  referral             text,
  special_requirements text,
  questions            text,
  consent_marketing    boolean     DEFAULT false,
  consent_data         boolean     DEFAULT false,
  consent_photos       boolean     DEFAULT false,
  ticket_type          text        DEFAULT 'free',
  payment_method       text,
  payment_reference    text
);

-- ─────────────────────────────────────────
-- 2. Site Content (CMS)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  section    text        NOT NULL,
  key        text        NOT NULL,
  value      text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (section, key)
);

-- ─────────────────────────────────────────
-- 3. Email Logs
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  sent_at    timestamptz DEFAULT now(),
  recipients text[],
  subject    text,
  body       text,
  status     text        DEFAULT 'sent',
  sent_by    text
);

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content           ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs             ENABLE ROW LEVEL SECURITY;

-- Service role: full access to all tables
DROP POLICY IF EXISTS "service_role_all_registrations" ON workshop_registrations;
CREATE POLICY "service_role_all_registrations"
  ON workshop_registrations FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "service_role_all_site_content" ON site_content;
CREATE POLICY "service_role_all_site_content"
  ON site_content FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "service_role_all_email_logs" ON email_logs;
CREATE POLICY "service_role_all_email_logs"
  ON email_logs FOR ALL TO service_role USING (true);

-- Anonymous users: can INSERT new registrations (public form)
DROP POLICY IF EXISTS "anon_insert_registrations" ON workshop_registrations;
CREATE POLICY "anon_insert_registrations"
  ON workshop_registrations FOR INSERT TO anon WITH CHECK (true);

-- Anonymous users: can READ site_content (powers the public CMS)
DROP POLICY IF EXISTS "anon_read_site_content" ON site_content;
CREATE POLICY "anon_read_site_content"
  ON site_content FOR SELECT TO anon USING (true);

-- ─────────────────────────────────────────
-- Seed: Default Site Content
-- ─────────────────────────────────────────
INSERT INTO site_content (section, key, value) VALUES
  ('hero',     'title',    'Building A World Rooted In Love'),
  ('hero',     'subtitle', 'Foundation of Luv empowers communities through compassion, dignity, and human connection.'),
  ('contact',  'phone',    '443-402-5802'),
  ('contact',  'address',  'hello@foundationofluv.org'),
  ('contact',  'email',    'hello@foundationofluv.org'),
  ('workshop', 'date',     'Saturday, July 18, 2026'),
  ('workshop', 'time',     '10:00 AM - 3:00 PM EST'),
  ('workshop', 'location', 'Online (Zoom Link Provided Upon Registration)'),
  ('about',    'intro',    'At FOL, we believe love is an energy that transcends barriers. Through our programs in health, education, housing, mental wellness, and community empowerment, we foster resilience and inspire individuals to reach their fullest potential.')
ON CONFLICT (section, key) DO NOTHING;
