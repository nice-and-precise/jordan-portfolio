const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function verify() {
    console.log("Verifying Outcomes...");
    const outcomesSnapshot = await db.collection('outcomes').get();
    console.log(`Found ${outcomesSnapshot.size} outcomes.`);
    outcomesSnapshot.forEach(doc => {
        console.log(`- ${doc.data().title}: ${doc.data().value}${doc.data().suffix}`);
    });

    console.log("\nVerifying Projects...");
    const projectsSnapshot = await db.collection('projects').get();
    console.log(`Found ${projectsSnapshot.size} projects.`);
    projectsSnapshot.forEach(doc => {
        console.log(`- ${doc.data().title}`);
    });

    if (outcomesSnapshot.size > 0 && projectsSnapshot.size > 0) {
        console.log("\nVerification SUCCESS");
    } else {
        console.log("\nVerification FAILED");
    }
}

verify().catch(console.error);
