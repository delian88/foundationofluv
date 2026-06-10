-- ============================================================
-- seed.sql — Foundation of Luv Development Seed Data
-- Run after migrations to populate tables with sample data
-- ============================================================

-- ─────────────────────────────────────────
-- Site Content Defaults
-- ─────────────────────────────────────────
INSERT INTO site_content (section, key, value) VALUES
  ('hero',     'title',     'Building A World Rooted In Love'),
  ('hero',     'subtitle',  'Foundation of Luv empowers communities through compassion, dignity, and human connection.'),
  ('contact',  'phone',     '443-402-5802'),
  ('contact',  'address',   'hello@foundationofluv.org'),
  ('contact',  'email',     'hello@foundationofluv.org'),
  ('workshop', 'date',      'Saturday, July 18, 2026'),
  ('workshop', 'time',      '10:00 AM - 3:00 PM EST'),
  ('workshop', 'location',  'Online (Podore Link Provided Upon Registration)'),
  ('about',    'intro',     'At FOL, we believe love is an energy that transcends barriers. Through our programs in health, education, housing, mental wellness, and community empowerment, we foster resilience and inspire individuals to reach their fullest potential.')
ON CONFLICT (section, key) DO NOTHING;

-- ─────────────────────────────────────────
-- Sample Events (for testing)
-- ─────────────────────────────────────────
INSERT INTO events (title, description, date, time, location, type, status, registration_link) VALUES
  (
    'Cybersecurity & Financial Literacy Workshop',
    'Learn practical skills to protect yourself online and make smarter financial decisions. Facilitated by industry experts and FOL leadership.',
    '2026-07-18',
    '10:00 AM - 3:00 PM EST',
    'Online (Podore Link Provided Upon Registration)',
    'Workshop',
    'published',
    '/register-workshop'
  ),
  (
    'Community Empowerment Seminar',
    'A free seminar focused on community building, mental wellness, and economic empowerment for vulnerable populations.',
    '2026-08-15',
    '2:00 PM - 5:00 PM EST',
    'Online (Podore Link Provided Upon Registration)',
    'Seminar',
    'draft',
    ''
  )
ON CONFLICT DO NOTHING;
