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
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('RPC Functions found in paths:');
      const paths = Object.keys(parsed.paths);
      const rpcPaths = paths.filter(p => p.startsWith('/rpc/'));
      console.log(rpcPaths);
    } catch (e) {
      console.log('Error parsing response:', e.message);
      console.log('Response excerpt:', data.substring(0, 1000));
    }
  });
});

req.on('error', console.error);
req.end();
