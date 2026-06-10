// migrate-events.mjs — Run with: node migrate-events.mjs
// Creates the events table in Supabase for FOL Events & Scheduling

import https from 'https';
import fs from 'fs';
import path from 'path';

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
} catch (e) {}

const PROJECT_REF = 'huzrbgrvcfeywllxloje';
const SERVICE_KEY = env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

const SQL = `
-- Events Table for FOL Admin Events & Scheduling
CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text DEFAULT '',
  date text NOT NULL,
  time text DEFAULT '',
  location text DEFAULT 'Online (Zoom Link Provided Upon Registration)',
  type text DEFAULT 'Workshop',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  registration_link text DEFAULT '',
  image_url text DEFAULT ''
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read published events
CREATE POLICY IF NOT EXISTS "Public read published events"
  ON events FOR SELECT
  USING (status = 'published');

-- Service role can do everything
CREATE POLICY IF NOT EXISTS "Service role full access to events"
  ON events FOR ALL
  USING (auth.role() = 'service_role');

-- Create index on date and status for performance
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_status_idx ON events(status);
`;

function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, status: res.statusCode, data });
        } else {
          resolve({ ok: false, status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Use Supabase Management API to run SQL
function runManagementSQL(sql) {
  return new Promise((resolve, reject) => {
    const MGMT_KEY = env.SUPABASE_SECRET_KEY;
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${MGMT_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        resolve({ ok: res.statusCode < 300, status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('🚀 Creating events table in Supabase...\n');

  const result = await runManagementSQL(SQL);
  if (result.ok) {
    console.log('✅ Events table created successfully!');
    console.log('   Table: events');
    console.log('   Columns: id, title, description, date, time, location, type, status, registration_link, image_url');
    console.log('\n🎉 Done! Go to Admin Panel → Events to start adding events.');
  } else {
    console.log('⚠️  Management API response:', result.status, result.data);
    console.log('\nIf the above shows an error, please run this SQL manually in the Supabase SQL Editor:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(SQL);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

main().catch(console.error);
