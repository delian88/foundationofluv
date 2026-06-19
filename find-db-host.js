import dns from 'dns';

const projectRef = 'huzrbgrvcfeywllxloje';
const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
  'sa-east-1', 'ca-central-1', 'ap-south-1'
];

async function check() {
  for (const region of regions) {
    const host = `db.${projectRef}.${region}.supabase.co`;
    const hostPooler = `aws-0-${region}.pooler.supabase.com`;
    
    // Try resolving host
    try {
      const ip = await dns.promises.resolve4(host);
      console.log(`FOUND host: ${host} -> ${ip}`);
    } catch (e) {}

    try {
      const ip = await dns.promises.resolve4(hostPooler);
      // Wait, the pooler host is shared, we connect to it using the project ref in the username
      // e.g. postgres.huzrbgrvcfeywllxloje@aws-0-us-east-1.pooler.supabase.com
      // Let's print all active pooler hosts that resolve.
      // But how do we know which one belongs to our project?
      // Actually, when a project is provisioned in a region, that region's pooler is the one used.
      // Let's resolve the project's API host DNS to see if it reveals the region.
    } catch (e) {}
  }

  // Let's resolve the API URL
  try {
    const apiHost = `${projectRef}.supabase.co`;
    const ip = await dns.promises.resolve(apiHost);
    console.log(`API Host ${apiHost} resolves to:`, ip);
    
    // Let's try resolving the CNAME
    const cnames = await dns.promises.resolveCname(apiHost).catch(() => []);
    console.log(`API Host CNAMEs:`, cnames);
  } catch (e) {
    console.log('Error resolving API host:', e.message);
  }
}

check();
