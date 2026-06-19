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

if (!dbPassword) {
  console.error('Error: SUPABASE_SECRET_KEY not found in .env');
  process.exit(1);
}

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
  'sa-east-1', 'ca-central-1', 'ap-south-1'
];

async function tryRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@${host}:6543/postgres?sslmode=require`;
  
  console.log(`Trying ${region} (${host})...`);
  
  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    console.log(`🟢 SUCCESS: Connected to ${region} pooler!`);
    await client.query('SELECT 1');
    console.log('Query test passed!');
    await client.end();
    return true;
  } catch (err) {
    console.log(`🔴 Failed for ${region}:`, err.message);
    try {
      await client.end();
    } catch (e) {}
    return false;
  }
}

async function run() {
  for (const region of regions) {
    const ok = await tryRegion(region);
    if (ok) {
      console.log(`\n🎉 Found active region: ${region}`);
      process.exit(0);
    }
  }
  console.log('\n❌ All regions failed.');
}

run();
