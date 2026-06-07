// migrate.mjs — Run with: node migrate.mjs
// This script creates the required Supabase tables for the FOL admin panel.

import https from 'https';
import fs from 'fs';
import path from 'path';

// Simple parser for local .env files
const env = {};
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        env[key] = value;
      }
    });
  }
} catch (e) {
  // Silent fallback
}

const SECRET_KEY = env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY;
const PROJECT_REF = 'huzrbgrvcfeywllxloje';
const SERVICE_KEY = env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

const SQL = `
-- Workshop Registrations Table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  full_name text,
  email text,
  phone text,
  city text,
  organization text,
  job_title text,
  profile text,
  interests text[],
  cybersecurity_level text DEFAULT 'Beginner',
  financial_level text DEFAULT 'Beginner',
  referral text,
  special_requirements text,
  questions text,
  consent_marketing boolean DEFAULT false,
  consent_data boolean DEFAULT false,
  consent_photos boolean DEFAULT false,
  ticket_type text DEFAULT 'free',
  payment_method text,
  payment_reference text
);

-- Site Content CMS Table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  key text NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sent_at timestamptz DEFAULT now(),
  recipients text[],
  subject text,
  body text,
  status text DEFAULT 'sent',
  sent_by text
);

-- Disable RLS for admin access (enable per-table policies if needed)
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY IF NOT EXISTS "service_role_all_registrations" ON workshop_registrations FOR ALL TO service_role USING (true);
CREATE POLICY IF NOT EXISTS "service_role_all_site_content" ON site_content FOR ALL TO service_role USING (true);
CREATE POLICY IF NOT EXISTS "service_role_all_email_logs" ON email_logs FOR ALL TO service_role USING (true);

-- Allow anon to INSERT registrations (for the public registration form)
CREATE POLICY IF NOT EXISTS "anon_insert_registrations" ON workshop_registrations FOR INSERT TO anon WITH CHECK (true);

-- Allow anon to READ site_content (for the public site CMS features)
CREATE POLICY IF NOT EXISTS "anon_read_site_content" ON site_content FOR SELECT TO anon USING (true);

-- Seed initial site_content defaults
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'title', 'Building A World Rooted In Love'),
  ('hero', 'subtitle', 'Foundation of Luv empowers communities through compassion, dignity, and human connection.'),
  ('contact', 'phone', '443-402-5802'),
  ('contact', 'address', '#9960 Raven Hurst Road, Middle River MD 21221'),
  ('contact', 'email', 'hello@foundationofluv.org'),
  ('workshop', 'date', 'Saturday, July 18, 2026'),
  ('workshop', 'time', '10:00 AM - 3:00 PM EST'),
  ('workshop', 'location', 'Online & Middle River MD'),
  ('about', 'intro', 'At FOL, we believe love is an energy that transcends barriers. Through our programs in health, education, housing, mental wellness, and community empowerment, we foster resilience and inspire individuals to reach their fullest potential.')
ON CONFLICT (section, key) DO NOTHING;
`;

function callAPI(hostname, path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const bodyBuffer = Buffer.from(body, 'utf-8');
    const options = {
      hostname,
      path,
      method,
      headers: {
        ...headers,
        'Content-Length': bodyBuffer.length,
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

async function runMigration() {
  console.log('🚀 Running FOL database migration...\n');

  // Try management API with sb_secret key
  console.log('Trying Supabase Management API...');
  const mgmtResult = await callAPI(
    'api.supabase.com',
    `/v1/projects/${PROJECT_REF}/database/query`,
    'POST',
    {
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    JSON.stringify({ query: SQL })
  );
  
  console.log('Management API Response:', mgmtResult.status, mgmtResult.body);

  if (mgmtResult.status === 200) {
    console.log('\n✅ Migration completed successfully via Management API!');
    return;
  }

  // Fallback: try with service role key directly  
  console.log('\nFalling back to direct SQL execution...');
  const directResult = await callAPI(
    `${PROJECT_REF}.supabase.co`,
    '/rest/v1/rpc/exec_sql',
    'POST',
    {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY,
      'Content-Type': 'application/json',
    },
    JSON.stringify({ sql: SQL })
  );
  
  console.log('Direct API Response:', directResult.status, directResult.body);

  if (directResult.status >= 200 && directResult.status < 300) {
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.log('\n⚠️  Automatic migration failed. Please run the SQL manually in your Supabase dashboard.');
    console.log('📋 Go to: https://supabase.com/dashboard/project/huzrbgrvcfeywllxloje/sql/new');
    console.log('\nSQL to paste:\n');
    console.log(SQL);
  }

  // Create Super Admin user if possible
  console.log('\nSetting up Super Admin account in Supabase Auth...');
  try {
    const adminUserResult = await callAPI(
      `${PROJECT_REF}.supabase.co`,
      '/auth/v1/admin/users',
      'POST',
      {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        email: env.ADMIN_EMAIL || 'info@azariahmg.com',
        password: env.ADMIN_PASSWORD || 'Admin@webmaster$1',
        email_confirm: true
      })
    );
    if (adminUserResult.status === 201) {
      console.log(`✅ Super Admin account successfully created for ${env.ADMIN_EMAIL || 'info@azariahmg.com'}!`);
    } else if (adminUserResult.status === 422) {
      console.log('ℹ️ Super Admin account already exists (422 email registered).');
    } else {
      console.log(`⚠️ Note: Super Admin creation returned status ${adminUserResult.status}: ${adminUserResult.body}`);
    }
  } catch (err) {
    console.log('⚠️ Failed to auto-create Super Admin account. Please create it manually in the Supabase Auth dashboard.', err.message);
  }
}

runMigration().catch(console.error);
