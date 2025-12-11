const https = require('https');

const url = 'https://jordan-7d673.web.app/admin/login';

console.log(`Checking headers for ${url}...`);

const req = https.request(url, { method: 'HEAD' }, (res) => {
    console.log('--- HEADERS START ---');
    console.log(JSON.stringify(res.headers, null, 2));
    console.log('--- HEADERS END ---');
});

req.on('error', (e) => {
    console.error('Error fetching headers:', e);
});

req.end();
