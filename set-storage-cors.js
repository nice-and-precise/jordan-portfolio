
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "jordan-7d673.firebasestorage.app" // Explicitly setting bucket name from config
});

async function setCors() {
    const bucket = admin.storage().bucket();

    console.log(`Setting CORS for bucket: ${bucket.name}`);

    const corsConfiguration = [
        {
            origin: ["*"], // Allow all origins for now (or strictly ["https://jordan-7d673.web.app", "http://localhost:3000"])
            method: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
            responseHeader: ["*"], // Allow all headers
            maxAgeSeconds: 3600
        }
    ];

    try {
        await bucket.setCorsConfiguration(corsConfiguration);
        console.log("✅ CORS configuration successfully applied!");
        console.log("Settings:", JSON.stringify(corsConfiguration, null, 2));
    } catch (error) {
        console.error("❌ Error setting CORS:", error);
    }
}

setCors();
