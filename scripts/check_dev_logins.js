const https = require('https');

const SERVER_BASE = 'https://14.225.217.232:5445';

const accounts = [
  { label: 'Admin / CEO C-Level', email: 'admin@vione.vn', pass: '123456' },
  { label: 'Member / Tech Solutions', email: 'tech.solutions@vione.vn', pass: '123456' },
  { label: 'Partner / Peer 1', email: 'peer1@vione.vn', pass: '123456' },
  { label: 'Demo User', email: 'demo.user@vione.vn', pass: '123456' },
];

function testLogin(acc) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ email: acc.email, password: acc.pass, username: acc.email });
    const req = https.request(`${SERVER_BASE}/api/auth/login`, {
      method: 'POST',
      rejectUnauthorized: false,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.access_token) {
            resolve({ acc: acc.label, email: acc.email, status: res.status, ok: true, user: parsed.user, token: parsed.access_token });
          } else {
            resolve({ acc: acc.label, email: acc.email, status: res.status, ok: false, error: body });
          }
        } catch (e) {
          resolve({ acc: acc.label, email: acc.email, status: res.status, ok: false, error: body });
        }
      });
    });
    req.on('error', (err) => resolve({ acc: acc.label, email: acc.email, ok: false, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ acc: acc.label, email: acc.email, ok: false, error: 'TIMEOUT' }); });
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('>>> TESTING LOGINS ON SERVER DEV:', SERVER_BASE);
  for (const acc of accounts) {
    const res = await testLogin(acc);
    console.log(`[${res.ok ? 'PASS' : 'FAIL'}] ${res.acc} (${res.email}) -> Status: ${res.status || 'ERR'}, OK: ${res.ok}`);
    if (res.user) {
      console.log(`    User ID: ${res.user.id || res.user.userId}, Role: ${res.user.role || res.user.roles}`);
    } else if (!res.ok) {
      console.log(`    Error: ${res.error?.slice(0, 100)}`);
    }
  }
}

main();
