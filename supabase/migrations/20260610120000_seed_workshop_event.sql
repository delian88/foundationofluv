-- ============================================================
-- Migration: 20260610120000_seed_workshop_event.sql
-- Foundation of Luv — Seed the featured Workshop event
-- This event drives the /workshop page on the public site.
-- Admin can update it via Admin Panel → Events
-- ============================================================

INSERT INTO events (
  id,
  title,
  description,
  date,
  time,
  location,
  type,
  status,
  registration_link,
  image_url,
  created_at,
  updated_at
) VALUES (
  'b1e2f3a4-c5d6-7890-abcd-ef1234567890',
  'Cybersecurity & Financial Literacy Workshop',
  'Learn practical skills to protect yourself online and make smarter financial decisions in a digital age. Facilitated by FOL leadership and industry experts. Includes live Q&A, digital resource materials, and an official Certificate of Completion.',
  '2026-07-18',
  '10:00 AM - 3:00 PM EST',
  'Online (Zoom Link Provided Upon Registration)',
  'Workshop',
  'published',
  '/register-workshop',
  '/workshop-poster.jpg',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  title             = EXCLUDED.title,
  description       = EXCLUDED.description,
  date              = EXCLUDED.date,
  time              = EXCLUDED.time,
  location          = EXCLUDED.location,
  type              = EXCLUDED.type,
  status            = EXCLUDED.status,
  registration_link = EXCLUDED.registration_link,
  image_url         = EXCLUDED.image_url,
  updated_at        = now();
