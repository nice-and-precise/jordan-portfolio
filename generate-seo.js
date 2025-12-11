const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Admin (re-use existing if possible, or init)
// We assume this runs in root context where serviceAccount is available
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const BASE_URL = 'https://jordan-7d673.web.app';

async function generateSEO() {
    console.log('Generating SEO files...');

    // 1. Fetch Data
    const projectsSnap = await db.collection('projects').get();
    const postsSnap = await db.collection('posts').get();

    // 2. Build Sitemaps Entries
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}</loc>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${BASE_URL}/writing</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`;

    projectsSnap.forEach(doc => {
        xml += `    <url>
        <loc>${BASE_URL}/case-studies/${doc.id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`;
    });

    postsSnap.forEach(doc => {
        const data = doc.data();
        xml += `    <url>
        <loc>${BASE_URL}/writing/${doc.id}</loc>
        <lastmod>${data.date ? new Date(data.date).toISOString() : new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
`;
    });

    xml += `</urlset>`;

    // 3. Write sitemap.xml
    fs.writeFileSync(path.join(__dirname, 'portfolio-next/public/sitemap.xml'), xml);
    console.log('Generated public/sitemap.xml');

    // 4. Write robots.txt
    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Sitemap: ${BASE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(__dirname, 'portfolio-next/public/robots.txt'), robots);
    console.log('Generated public/robots.txt');

    process.exit(0);
}

generateSEO().catch(console.error);
