import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Parse .env file
const env = {};
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

const dbPassword = env.SUPABASE_SECRET_KEY;
const projectRef = 'huzrbgrvcfeywllxloje';
const host = `aws-0-eu-west-2.pooler.supabase.com`;

if (!dbPassword) {
  console.error('Error: SUPABASE_SECRET_KEY not found in .env');
  process.exit(1);
}

console.log('Connecting to PostgreSQL database at:', host);

const client = new pg.Client({
  user: `postgres.${projectRef}`,
  password: dbPassword,
  host: host,
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully!');

    const sql = `
      -- Add sex and age_group columns if they do not exist
      ALTER TABLE workshop_registrations ADD COLUMN IF NOT EXISTS sex text;
      ALTER TABLE workshop_registrations ADD COLUMN IF NOT EXISTS age_group text;
    `;

    console.log('Executing migration SQL...');
    const res = await client.query(sql);
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
