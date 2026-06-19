import https from 'https';
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

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_SERVICE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase config in .env file');
  process.exit(1);
}

const hostname = url.replace('https://', '');

const options = {
  hostname,
  path: '/rest/v1/workshop_registrations?limit=1',
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Sample record keys:', parsed.length > 0 ? Object.keys(parsed[0]) : 'No records found');
      console.log('Full sample record:', parsed[0] || 'Empty');
    } catch (e) {
      console.log('Response body:', data);
    }
  });
});

req.on('error', console.error);
req.end();
