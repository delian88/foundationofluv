import https from 'https';
import fs from 'fs';
import path from 'path';

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
const key = env.VITE_SUPABASE_SERVICE_KEY;
const hostname = url.replace('https://', '');

const options = {
  hostname,
  path: '/rest/v1/workshop_registrations?limit=1',
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  res.resume();
});

req.on('error', console.error);
req.end();
